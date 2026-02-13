/**
 * Bun FFI backend for Linux libsecret.
 *
 * Uses `bun:ffi` `dlopen` to bind to `libsecret-1.so` and `libglib-2.0.so`.
 * The `v` (hash-table) variants of the password functions are used
 * because variadic FFI calls are not possible.
 *
 * @module
 * @internal
 */
import type { LibSecretBackend, SearchResult, SecretSchemaDefinition } from "./types.ts";

// Dynamic import hidden from static analysis so Deno/Node don't choke on "bun:ffi".
// deno-lint-ignore no-explicit-any
const bunFfi: any = await (Function('return import("bun:ffi")')() as Promise<unknown>);

const { dlopen, ptr: ptrFn, read: ffiRead, CString: BunCString } = bunFfi;

// ── Library loading ─────────────────────────────────────────────────────────

const glib = dlopen("libglib-2.0.so.0", {
    g_hash_table_new: {
        args: ["ptr", "ptr"],
        returns: "ptr",
    },
    g_hash_table_insert: {
        args: ["ptr", "ptr", "ptr"],
        returns: "i32",
    },
    g_hash_table_destroy: {
        args: ["ptr"],
        returns: "void",
    },
    g_str_hash: {
        args: ["ptr"],
        returns: "u32",
    },
    g_str_equal: {
        args: ["ptr", "ptr"],
        returns: "i32",
    },
    g_free: {
        args: ["ptr"],
        returns: "void",
    },
    g_hash_table_lookup: {
        args: ["ptr", "ptr"],
        returns: "ptr",
    },
    g_hash_table_get_keys: {
        args: ["ptr"],
        returns: "ptr",
    },
    g_hash_table_size: {
        args: ["ptr"],
        returns: "u32",
    },
    g_hash_table_unref: {
        args: ["ptr"],
        returns: "void",
    },
    g_list_free: {
        args: ["ptr"],
        returns: "void",
    },
});

const gobjectLib = dlopen("libgobject-2.0.so.0", {
    g_object_unref: {
        args: ["ptr"],
        returns: "void",
    },
});

const secretLib = dlopen("libsecret-1.so.0", {
    secret_password_storev_sync: {
        args: ["ptr", "ptr", "ptr", "ptr", "ptr", "ptr", "ptr"],
        returns: "i32",
    },
    secret_password_lookupv_sync: {
        args: ["ptr", "ptr", "ptr", "ptr"],
        returns: "ptr",
    },
    secret_password_clearv_sync: {
        args: ["ptr", "ptr", "ptr", "ptr"],
        returns: "i32",
    },
    secret_password_free: {
        args: ["ptr"],
        returns: "void",
    },
    secret_password_searchv_sync: {
        args: ["ptr", "ptr", "i32", "ptr", "ptr"],
        returns: "ptr",
    },
    secret_retrievable_get_label: {
        args: ["ptr"],
        returns: "ptr",
    },
    secret_retrievable_get_attributes: {
        args: ["ptr"],
        returns: "ptr",
    },
    secret_retrievable_get_created: {
        args: ["ptr"],
        returns: "u64",
    },
    secret_retrievable_get_modified: {
        args: ["ptr"],
        returns: "u64",
    },
    secret_retrievable_retrieve_secret_sync: {
        args: ["ptr", "ptr", "ptr"],
        returns: "ptr",
    },
    secret_value_get_text: {
        args: ["ptr"],
        returns: "ptr",
    },
    secret_value_unref: {
        args: ["ptr"],
        returns: "void",
    },
});

const gs = glib.symbols;
const gos = gobjectLib.symbols;
const ss = secretLib.symbols;

// ── Get function pointers for g_str_hash / g_str_equal ──────────────────────

// Bun's dlopen returns symbol addresses that can be used as function pointers
const glibPtrs = dlopen("libglib-2.0.so.0", {
    g_str_hash: { args: [], returns: "void" },
    g_str_equal: { args: [], returns: "void" },
});
const gStrHashPtr = glibPtrs.symbols.g_str_hash;
const gStrEqualPtr = glibPtrs.symbols.g_str_equal;

// ── Helpers ─────────────────────────────────────────────────────────────────

const encoder = new TextEncoder();

/**
 * Encode a JS string to a null-terminated UTF-8 Uint8Array.
 * Returns the buffer and a pointer to it.
 */
function cString(str: string): { buf: Uint8Array; ptr: unknown } {
    const bytes = encoder.encode(str + "\0");
    return { buf: bytes, ptr: ptrFn(bytes) };
}

/**
 * Read a C string from a raw numeric pointer. Returns empty string for null/0.
 */
function readCString(ptr: number): string {
    if (ptr === 0 || ptr === null) return "";
    return new BunCString(ptr);
}

// ── SecretSchema struct layout (64-bit) ─────────────────────────────────────
// Same layout as in ffi_deno.ts — see there for detailed comments.

const SIZEOF_SCHEMA = 592;
const SCHEMA_OFF_NAME = 0;
const SCHEMA_OFF_FLAGS = 8;
const SCHEMA_OFF_ATTRS = 16;
const SIZEOF_SCHEMA_ATTR = 16;

/**
 * Build a SecretSchema struct in memory.
 */
function buildSchema(
    def: SecretSchemaDefinition,
): { buf: Uint8Array; ptr: unknown; refs: unknown[] } {
    const refs: unknown[] = [];
    const buf = new Uint8Array(SIZEOF_SCHEMA);
    const view = new DataView(buf.buffer);

    const name = cString(def.name);
    refs.push(name.buf);
    view.setBigUint64(SCHEMA_OFF_NAME, BigInt(ptrFn(name.buf)), true);

    view.setInt32(SCHEMA_OFF_FLAGS, def.flags, true);

    const count = Math.min(def.attributes.length, 31);
    for (let i = 0; i < count; i++) {
        const attr = def.attributes[i];
        const attrName = cString(attr.name);
        refs.push(attrName.buf);

        const offset = SCHEMA_OFF_ATTRS + i * SIZEOF_SCHEMA_ATTR;
        view.setBigUint64(offset, BigInt(ptrFn(attrName.buf)), true);
        view.setInt32(offset + 8, attr.type, true);
    }

    const ptr = ptrFn(buf);
    refs.push(buf);

    return { buf, ptr, refs };
}

/**
 * Build a GHashTable from a JS Record<string, string>.
 */
function buildHashTable(
    attrs: Record<string, string>,
): { ht: unknown; refs: unknown[] } {
    const refs: unknown[] = [];

    const ht = gs.g_hash_table_new(gStrHashPtr, gStrEqualPtr);

    for (const [key, value] of Object.entries(attrs)) {
        const k = cString(key);
        const v = cString(value);
        refs.push(k.buf, v.buf);
        gs.g_hash_table_insert(ht, k.ptr, v.ptr);
    }

    return { ht, refs };
}

/**
 * Read a GError** out-buffer. Throws if an error was set.
 */
function checkError(errorBuf: Uint8Array, operation: string): void {
    const errorView = new DataView(errorBuf.buffer, errorBuf.byteOffset, errorBuf.byteLength);
    const errorPtr = Number(errorView.getBigUint64(0, true));
    if (errorPtr !== 0) {
        // GError { GQuark domain(4); gint code(4); gchar *message(8) }
        // message is at offset 8
        const msgPtr = Number(ffiRead.ptr(errorPtr + 8));
        const msg = msgPtr !== 0 ? readCString(msgPtr) : "Unknown error";
        gs.g_free(errorPtr);
        throw new Error(`${operation} failed: ${msg}`);
    }
}

// ── GList layout (64-bit) ────────────────────────────────────────────────────
// struct GList { gpointer data; GList *next; GList *prev; }
// data = offset 0 (8), next = offset 8 (8), prev = offset 16 (8)

/**
 * Walk a GList* (numeric pointer) and collect all `data` pointers.
 */
function glistToPointers(listPtr: number): number[] {
    const ptrs: number[] = [];
    let current = listPtr;
    while (current !== 0) {
        const dataPtr = Number(ffiRead.ptr(current));
        ptrs.push(dataPtr);
        const nextPtr = Number(ffiRead.ptr(current + 8));
        current = nextPtr;
    }
    return ptrs;
}

/**
 * Read a GHashTable of gchar*->gchar* into a JS Record.
 */
function readHashTableToRecord(htPtr: number): Record<string, string> {
    const result: Record<string, string> = {};
    const keysListPtr = Number(gs.g_hash_table_get_keys(htPtr));
    if (keysListPtr !== 0) {
        const keyPtrs = glistToPointers(keysListPtr);
        for (const keyPtr of keyPtrs) {
            if (keyPtr === 0) continue;
            const key = readCString(keyPtr);
            const valPtr = Number(gs.g_hash_table_lookup(htPtr, keyPtr));
            const val = valPtr !== 0 ? readCString(valPtr) : "";
            result[key] = val;
        }
        gs.g_list_free(keysListPtr);
    }
    return result;
}

/**
 * Extract password text from a SecretRetrievable, loading it if not already loaded.
 */
function extractPassword(itemPtr: number, errorBuf: Uint8Array): string | null {
    const secretVal = Number(ss.secret_retrievable_retrieve_secret_sync(
        itemPtr,
        null,
        ptrFn(errorBuf),
    ));

    if (secretVal === 0) return null;

    const textPtr = Number(ss.secret_value_get_text(secretVal));
    const text = textPtr !== 0 ? readCString(textPtr) : null;
    ss.secret_value_unref(secretVal);
    return text;
}

// ── Backend implementation ──────────────────────────────────────────────────

export const backend: LibSecretBackend = {
    store(
        schema: SecretSchemaDefinition,
        attributes: Record<string, string>,
        collection: string | null,
        label: string,
        password: string,
    ): void {
        const sch = buildSchema(schema);
        const ht = buildHashTable(attributes);

        const collStr = collection !== null ? cString(collection) : null;
        const labelStr = cString(label);
        const pwStr = cString(password);

        const errorBuf = new Uint8Array(8);

        if (collStr) sch.refs.push(collStr.buf);
        sch.refs.push(labelStr.buf, pwStr.buf);

        const ok = ss.secret_password_storev_sync(
            sch.ptr,
            ht.ht,
            collStr?.ptr ?? null,
            labelStr.ptr,
            pwStr.ptr,
            null, // cancellable
            ptrFn(errorBuf),
        );

        gs.g_hash_table_destroy(ht.ht);

        void sch.refs;
        void ht.refs;

        checkError(errorBuf, "secret_password_storev_sync");

        if (!ok) {
            throw new Error("secret_password_storev_sync returned FALSE");
        }
    },

    lookup(
        schema: SecretSchemaDefinition,
        attributes: Record<string, string>,
    ): string | null {
        const sch = buildSchema(schema);
        const ht = buildHashTable(attributes);
        const errorBuf = new Uint8Array(8);

        const resultPtr = ss.secret_password_lookupv_sync(
            sch.ptr,
            ht.ht,
            null,
            ptrFn(errorBuf),
        );

        gs.g_hash_table_destroy(ht.ht);

        void sch.refs;
        void ht.refs;

        checkError(errorBuf, "secret_password_lookupv_sync");

        if (resultPtr === 0 || resultPtr === null) {
            return null;
        }

        const password = readCString(Number(resultPtr));
        ss.secret_password_free(resultPtr);
        return password;
    },

    clear(
        schema: SecretSchemaDefinition,
        attributes: Record<string, string>,
    ): boolean {
        const sch = buildSchema(schema);
        const ht = buildHashTable(attributes);
        const errorBuf = new Uint8Array(8);

        const ok = ss.secret_password_clearv_sync(
            sch.ptr,
            ht.ht,
            null,
            ptrFn(errorBuf),
        );

        gs.g_hash_table_destroy(ht.ht);

        void sch.refs;
        void ht.refs;

        checkError(errorBuf, "secret_password_clearv_sync");

        return !!ok;
    },

    search(
        schema: SecretSchemaDefinition,
        attributes: Record<string, string>,
        flags: number,
    ): SearchResult[] {
        const sch = buildSchema(schema);
        const ht = buildHashTable(attributes);
        const errorBuf = new Uint8Array(8);

        const listPtr = Number(ss.secret_password_searchv_sync(
            sch.ptr,
            ht.ht,
            flags,
            null, // cancellable
            ptrFn(errorBuf),
        ));

        gs.g_hash_table_destroy(ht.ht);

        void sch.refs;
        void ht.refs;

        checkError(errorBuf, "secret_password_searchv_sync");

        if (listPtr === 0) {
            return [];
        }

        const results: SearchResult[] = [];
        const itemPtrs = glistToPointers(listPtr);

        for (const itemPtr of itemPtrs) {
            if (itemPtr === 0) continue;

            // label (caller-owned)
            const labelPtr = Number(ss.secret_retrievable_get_label(itemPtr));
            const label = labelPtr !== 0 ? readCString(labelPtr) : "";
            if (labelPtr !== 0) gs.g_free(labelPtr);

            // attributes (caller-owned hash table)
            const attrsHt = Number(ss.secret_retrievable_get_attributes(itemPtr));
            const itemAttrs = attrsHt !== 0 ? readHashTableToRecord(attrsHt) : {};
            if (attrsHt !== 0) gs.g_hash_table_unref(attrsHt);

            // timestamps
            const created = ss.secret_retrievable_get_created(itemPtr) as bigint;
            const modified = ss.secret_retrievable_get_modified(itemPtr) as bigint;

            // password
            const errBuf2 = new Uint8Array(8);
            const password = extractPassword(itemPtr, errBuf2);

            results.push({ label, attributes: itemAttrs, password, created, modified });
        }

        // Free the GList and unref each item
        for (const itemPtr of itemPtrs) {
            if (itemPtr !== 0) gos.g_object_unref(itemPtr);
        }
        gs.g_list_free(listPtr);

        return results;
    },
};
