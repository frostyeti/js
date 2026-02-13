/**
 * Deno FFI backend for Linux libsecret.
 *
 * Uses `Deno.dlopen` to bind to `libsecret-1.so` and `libglib-2.0.so`.
 * The `v` (hash-table) variants of the password functions are used
 * because variadic FFI calls are not possible.
 *
 * @module
 * @internal
 */
import type { LibSecretBackend, SearchResult, SecretSchemaDefinition } from "./types.ts";

// deno-lint-ignore no-explicit-any
const Deno_ = (globalThis as any).Deno;

// ── Library loading ─────────────────────────────────────────────────────────

const glib = Deno_.dlopen("libglib-2.0.so.0", {
    g_hash_table_new: {
        parameters: ["pointer", "pointer"],
        result: "pointer",
    },
    g_hash_table_insert: {
        parameters: ["pointer", "pointer", "pointer"],
        result: "i32",
    },
    g_hash_table_destroy: {
        parameters: ["pointer"],
        result: "void",
    },
    g_str_hash: {
        parameters: ["pointer"],
        result: "u32",
    },
    g_str_equal: {
        parameters: ["pointer", "pointer"],
        result: "i32",
    },
    g_free: {
        parameters: ["pointer"],
        result: "void",
    },
    g_hash_table_lookup: {
        parameters: ["pointer", "pointer"],
        result: "pointer",
    },
    g_hash_table_get_keys: {
        parameters: ["pointer"],
        result: "pointer",
    },
    g_hash_table_size: {
        parameters: ["pointer"],
        result: "u32",
    },
    g_hash_table_unref: {
        parameters: ["pointer"],
        result: "void",
    },
    g_list_free: {
        parameters: ["pointer"],
        result: "void",
    },
});

const gobject = Deno_.dlopen("libgobject-2.0.so.0", {
    g_object_unref: {
        parameters: ["pointer"],
        result: "void",
    },
});

const secret = Deno_.dlopen("libsecret-1.so.0", {
    secret_password_storev_sync: {
        // schema, attributes, collection, label, password, cancellable, error
        parameters: ["pointer", "pointer", "pointer", "pointer", "pointer", "pointer", "pointer"],
        result: "i32",
    },
    secret_password_lookupv_sync: {
        // schema, attributes, cancellable, error
        parameters: ["pointer", "pointer", "pointer", "pointer"],
        result: "pointer",
    },
    secret_password_clearv_sync: {
        // schema, attributes, cancellable, error
        parameters: ["pointer", "pointer", "pointer", "pointer"],
        result: "i32",
    },
    secret_password_free: {
        parameters: ["pointer"],
        result: "void",
    },
    secret_password_searchv_sync: {
        // schema, attributes, flags, cancellable, error
        parameters: ["pointer", "pointer", "i32", "pointer", "pointer"],
        result: "pointer", // GList*
    },
    secret_retrievable_get_label: {
        parameters: ["pointer"],
        result: "pointer", // gchar* (caller-owned)
    },
    secret_retrievable_get_attributes: {
        parameters: ["pointer"],
        result: "pointer", // GHashTable* (caller-owned)
    },
    secret_retrievable_get_created: {
        parameters: ["pointer"],
        result: "u64",
    },
    secret_retrievable_get_modified: {
        parameters: ["pointer"],
        result: "u64",
    },
    secret_retrievable_retrieve_secret_sync: {
        // self, cancellable, error
        parameters: ["pointer", "pointer", "pointer"],
        result: "pointer", // SecretValue*
    },
    secret_value_get_text: {
        parameters: ["pointer"],
        result: "pointer", // const gchar* (owned by SecretValue)
    },
    secret_value_unref: {
        parameters: ["pointer"],
        result: "void",
    },
});

const g = glib.symbols;
const go = gobject.symbols;
const s = secret.symbols;

// ── Pointer to g_str_hash and g_str_equal ───────────────────────────────────
// We need function pointers for g_hash_table_new. We use the Deno.dlopen
// callback mechanism or simply pass the symbol addresses.

const glibCallbacks = Deno_.dlopen("libglib-2.0.so.0", {
    g_str_hash: { parameters: [], result: "void" },
    g_str_equal: { parameters: [], result: "void" },
});

// Get the raw function pointers by accessing the symbol addresses
const gStrHashPtr = glibCallbacks.symbols.g_str_hash;
const gStrEqualPtr = glibCallbacks.symbols.g_str_equal;

// ── Helpers ─────────────────────────────────────────────────────────────────

const encoder = new TextEncoder();

/**
 * Encode a JS string to a null-terminated UTF-8 Uint8Array.
 * Keep the buffer alive by returning it alongside the pointer.
 */
function cString(str: string): { buf: Uint8Array; ptr: unknown } {
    const bytes = encoder.encode(str + "\0");
    return { buf: bytes, ptr: Deno_.UnsafePointer.of(bytes) };
}

/**
 * Read a C string from a pointer. Returns empty string for null pointers.
 */
function readCString(ptr: unknown): string {
    if (ptr === null) return "";
    return Deno_.UnsafePointerView.getCString(ptr);
}

// ── SecretSchema struct layout (64-bit) ─────────────────────────────────────
//
// typedef struct {
//     const gchar *name;            // offset 0:  8 bytes (pointer)
//     SecretSchemaFlags flags;       // offset 8:  4 bytes (int/enum)
//     // padding                     // offset 12: 4 bytes
//     SecretSchemaAttribute attrs[32]; // offset 16: 32 * 16 = 512 bytes
//     gint reserved;                 // offset 528: 4 bytes
//     // padding                     // offset 532: 4 bytes
//     gpointer reserved1..7;         // offset 536: 7 * 8 = 56 bytes
// } SecretSchema;                    // total: 592 bytes
//
// SecretSchemaAttribute { const gchar *name; SecretSchemaAttributeType type; }
// = 8 (pointer) + 4 (int) + 4 (padding) = 16 bytes each

const SIZEOF_SCHEMA = 592;
const SCHEMA_OFF_NAME = 0;
const SCHEMA_OFF_FLAGS = 8;
const SCHEMA_OFF_ATTRS = 16;
const SIZEOF_SCHEMA_ATTR = 16;

/**
 * Build a SecretSchema struct in memory.
 * Returns the struct buffer, a pointer to it, and an array of refs
 * that must be kept alive for the duration of the FFI call.
 */
function buildSchema(
    def: SecretSchemaDefinition,
): { buf: Uint8Array; ptr: unknown; refs: unknown[] } {
    const refs: unknown[] = [];
    const buf = new Uint8Array(SIZEOF_SCHEMA);
    const view = new DataView(buf.buffer);

    // schema name
    const name = cString(def.name);
    refs.push(name.buf);
    view.setBigUint64(
        SCHEMA_OFF_NAME,
        BigInt(Deno_.UnsafePointer.value(name.ptr)),
        true,
    );

    // flags
    view.setInt32(SCHEMA_OFF_FLAGS, def.flags, true);

    // attributes (max 31, terminated by {NULL, 0})
    const count = Math.min(def.attributes.length, 31);
    for (let i = 0; i < count; i++) {
        const attr = def.attributes[i];
        const attrName = cString(attr.name);
        refs.push(attrName.buf);

        const offset = SCHEMA_OFF_ATTRS + i * SIZEOF_SCHEMA_ATTR;
        view.setBigUint64(
            offset,
            BigInt(Deno_.UnsafePointer.value(attrName.ptr)),
            true,
        );
        view.setInt32(offset + 8, attr.type, true);
    }
    // sentinel {NULL, 0} is already zero from Uint8Array init

    const ptr = Deno_.UnsafePointer.of(buf);
    refs.push(buf);

    return { buf, ptr, refs };
}

/**
 * Build a GHashTable from a JS Record<string, string>.
 * Returns the hash table pointer and refs to keep alive.
 */
function buildHashTable(
    attrs: Record<string, string>,
): { ht: unknown; refs: unknown[] } {
    const refs: unknown[] = [];

    const ht = g.g_hash_table_new(gStrHashPtr, gStrEqualPtr);

    for (const [key, value] of Object.entries(attrs)) {
        const k = cString(key);
        const v = cString(value);
        refs.push(k.buf, v.buf);
        g.g_hash_table_insert(ht, k.ptr, v.ptr);
    }

    return { ht, refs };
}

/**
 * Read a GError** out-buffer. Throws if an error was set.
 */
function checkError(errorBuf: Uint8Array, operation: string): void {
    const errorView = new DataView(errorBuf.buffer, errorBuf.byteOffset, errorBuf.byteLength);
    const errorPtr = errorView.getBigUint64(0, true);
    if (errorPtr !== 0n) {
        // GError { GQuark domain; gint code; gchar *message; }
        // domain = offset 0 (4 bytes), code = offset 4 (4 bytes), message = offset 8 (pointer)
        const errObj = Deno_.UnsafePointer.create(errorPtr);
        const errView = new Deno_.UnsafePointerView(errObj);
        const msgPtr = Deno_.UnsafePointer.create(errView.getBigUint64(8));
        const msg = msgPtr ? Deno_.UnsafePointerView.getCString(msgPtr) : "Unknown error";
        // Free the GError
        g.g_free(errObj);
        throw new Error(`${operation} failed: ${msg}`);
    }
}

// ── GList layout (64-bit) ────────────────────────────────────────────────────
// struct GList { gpointer data; GList *next; GList *prev; }
// data = offset 0 (8), next = offset 8 (8), prev = offset 16 (8)

const GLIST_OFF_DATA = 0;
const GLIST_OFF_NEXT = 8;

/**
 * Walk a GList* and collect all `data` pointers into an array.
 */
function glistToPointers(listPtr: unknown): unknown[] {
    const ptrs: unknown[] = [];
    let current = listPtr;
    while (current !== null) {
        const view = new Deno_.UnsafePointerView(current);
        const dataPtr = Deno_.UnsafePointer.create(view.getBigUint64(GLIST_OFF_DATA));
        ptrs.push(dataPtr);
        const nextVal = view.getBigUint64(GLIST_OFF_NEXT);
        current = nextVal !== 0n ? Deno_.UnsafePointer.create(nextVal) : null;
    }
    return ptrs;
}

/**
 * Read a GHashTable of gchar*->gchar* into a JS Record.
 */
function readHashTableToRecord(htPtr: unknown): Record<string, string> {
    const result: Record<string, string> = {};
    const keysListPtr = g.g_hash_table_get_keys(htPtr);
    if (keysListPtr !== null) {
        const keyPtrs = glistToPointers(keysListPtr);
        for (const keyPtr of keyPtrs) {
            if (keyPtr === null) continue;
            const key = Deno_.UnsafePointerView.getCString(keyPtr);
            const valPtr = g.g_hash_table_lookup(htPtr, keyPtr);
            const val = valPtr !== null ? Deno_.UnsafePointerView.getCString(valPtr) : "";
            result[key] = val;
        }
        g.g_list_free(keysListPtr);
    }
    return result;
}

/**
 * Extract password text from a SecretRetrievable, loading it if
 * not already loaded.
 */
function extractPassword(
    itemPtr: unknown,
    errorBuf: Uint8Array,
): string | null {
    // Try retrieve_secret_sync to get the SecretValue
    const secretVal = s.secret_retrievable_retrieve_secret_sync(
        itemPtr,
        null,
        Deno_.UnsafePointer.of(errorBuf),
    );

    // Ignore retrieval errors (item may have no secret) — just check non-null
    if (secretVal === null) return null;

    const textPtr = s.secret_value_get_text(secretVal);
    const text = textPtr !== null ? Deno_.UnsafePointerView.getCString(textPtr) : null;
    s.secret_value_unref(secretVal);
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

        const errorBuf = new Uint8Array(8); // GError**

        if (collStr) sch.refs.push(collStr.buf);
        sch.refs.push(labelStr.buf, pwStr.buf);

        const ok = s.secret_password_storev_sync(
            sch.ptr,
            ht.ht,
            collStr?.ptr ?? null,
            labelStr.ptr,
            pwStr.ptr,
            null, // cancellable
            Deno_.UnsafePointer.of(errorBuf),
        );

        g.g_hash_table_destroy(ht.ht);

        // Keep refs alive past FFI call
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

        const resultPtr = s.secret_password_lookupv_sync(
            sch.ptr,
            ht.ht,
            null, // cancellable
            Deno_.UnsafePointer.of(errorBuf),
        );

        g.g_hash_table_destroy(ht.ht);

        void sch.refs;
        void ht.refs;

        checkError(errorBuf, "secret_password_lookupv_sync");

        if (resultPtr === null) {
            return null;
        }

        const password = readCString(resultPtr);
        s.secret_password_free(resultPtr);
        return password;
    },

    clear(
        schema: SecretSchemaDefinition,
        attributes: Record<string, string>,
    ): boolean {
        const sch = buildSchema(schema);
        const ht = buildHashTable(attributes);
        const errorBuf = new Uint8Array(8);

        const ok = s.secret_password_clearv_sync(
            sch.ptr,
            ht.ht,
            null, // cancellable
            Deno_.UnsafePointer.of(errorBuf),
        );

        g.g_hash_table_destroy(ht.ht);

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

        const listPtr = s.secret_password_searchv_sync(
            sch.ptr,
            ht.ht,
            flags,
            null, // cancellable
            Deno_.UnsafePointer.of(errorBuf),
        );

        g.g_hash_table_destroy(ht.ht);

        void sch.refs;
        void ht.refs;

        checkError(errorBuf, "secret_password_searchv_sync");

        if (listPtr === null) {
            return [];
        }

        const results: SearchResult[] = [];
        const itemPtrs = glistToPointers(listPtr);

        for (const itemPtr of itemPtrs) {
            if (itemPtr === null) continue;

            // label (caller-owned)
            const labelPtr = s.secret_retrievable_get_label(itemPtr);
            const label = labelPtr !== null ? Deno_.UnsafePointerView.getCString(labelPtr) : "";
            if (labelPtr !== null) g.g_free(labelPtr);

            // attributes (caller-owned hash table)
            const attrsHt = s.secret_retrievable_get_attributes(itemPtr);
            const itemAttrs = attrsHt !== null ? readHashTableToRecord(attrsHt) : {};
            if (attrsHt !== null) g.g_hash_table_unref(attrsHt);

            // timestamps
            const created = s.secret_retrievable_get_created(itemPtr);
            const modified = s.secret_retrievable_get_modified(itemPtr);

            // password
            const errBuf2 = new Uint8Array(8);
            const password = extractPassword(itemPtr, errBuf2);

            results.push({ label, attributes: itemAttrs, password, created, modified });
        }

        // Free the GList and unref each item
        for (const itemPtr of itemPtrs) {
            if (itemPtr !== null) go.g_object_unref(itemPtr);
        }
        g.g_list_free(listPtr);

        return results;
    },
};
