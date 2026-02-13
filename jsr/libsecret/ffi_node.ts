/**
 * Node.js FFI backend for Linux libsecret using Koffi.
 *
 * Uses `koffi` (npm package) to bind to `libsecret-1.so` and `libglib-2.0.so`.
 * The `v` (hash-table) variants of the password functions are used
 * because variadic FFI calls are not possible.
 *
 * Koffi must be installed as a dependency: `npm install koffi`.
 *
 * @module
 * @internal
 */
import type { LibSecretBackend, SearchResult, SecretSchemaDefinition } from "./types.ts";

// ── Load koffi ──────────────────────────────────────────────────────────────

// deno-lint-ignore no-explicit-any
let koffi: any;
try {
    // deno-lint-ignore no-explicit-any
    const g = globalThis as any;
    const req = g.require ?? (g.process?.mainModule?.require);

    if (req) {
        koffi = req("koffi");
    } else {
        // ESM fallback
        // deno-lint-ignore no-explicit-any
        const nodeModule = await (Function('return import("node:module")')() as Promise<any>);
        const createRequire = nodeModule.createRequire ?? nodeModule.default?.createRequire;
        if (createRequire) {
            const require = createRequire(import.meta.url ?? "file:///");
            koffi = require("koffi");
        } else {
            // deno-lint-ignore no-explicit-any
            const mod = await (Function('return import("koffi")')() as Promise<any>);
            koffi = mod.default ?? mod;
        }
    }
} catch {
    throw new Error(
        "The 'koffi' package is required for Node.js libsecret support. " +
            "Install it with: npm install koffi",
    );
}

// ── Define types ────────────────────────────────────────────────────────────

// Opaque types — registered by name in koffi's type system and referenced
// by their string names in C-style function signatures below.
koffi.opaque("GHashTable");
koffi.opaque("GCancellable");
koffi.opaque("GError");
koffi.opaque("SecretRetrievable");
koffi.opaque("SecretValue");

// GList struct for walking linked lists
const GList = koffi.struct("GList", {
    data: "void *",
    next: "GList *",
    prev: "GList *",
});

// GError struct for reading error messages
const GErrorStruct = koffi.struct("GErrorStruct", {
    domain: "uint32",
    code: "int32",
    message: "const char *",
});

// SecretSchemaAttribute { const char *name; int type; }
const _SecretSchemaAttribute = koffi.struct("SecretSchemaAttribute", {
    name: "const char *",
    type: "int32",
});

// SecretSchema struct
// attributes is a fixed array of 32 SecretSchemaAttribute entries
koffi.struct("SecretSchema", {
    name: "const char *",
    flags: "int32",
    attributes: koffi.array(_SecretSchemaAttribute, 32),
    reserved: "int32",
    reserved1: "void *",
    reserved2: "void *",
    reserved3: "void *",
    reserved4: "void *",
    reserved5: "void *",
    reserved6: "void *",
    reserved7: "void *",
});

// ── Load libraries ──────────────────────────────────────────────────────────

const glibLib = koffi.load("libglib-2.0.so.0");
const secretLib = koffi.load("libsecret-1.so.0");

// GLib hash table functions
const g_str_hash = glibLib.func("unsigned int g_str_hash(const char *v)");
const g_str_equal = glibLib.func("int g_str_equal(const char *v1, const char *v2)");

// For g_hash_table_new we need function pointer types
koffi.pointer("GHashFunc", koffi.opaque());
koffi.pointer("GEqualFunc", koffi.opaque());

const g_hash_table_new = glibLib.func(
    "GHashTable *g_hash_table_new(GHashFunc hash_func, GEqualFunc key_equal_func)",
);
const g_hash_table_insert = glibLib.func(
    "int g_hash_table_insert(GHashTable *ht, const char *key, const char *value)",
);
const g_hash_table_destroy = glibLib.func(
    "void g_hash_table_destroy(GHashTable *ht)",
);
const g_free = glibLib.func("void g_free(void *mem)");
const g_hash_table_lookup = glibLib.func(
    "const char *g_hash_table_lookup(GHashTable *ht, const char *key)",
);
const g_hash_table_get_keys = glibLib.func(
    "GList *g_hash_table_get_keys(GHashTable *ht)",
);
const g_hash_table_size = glibLib.func(
    "unsigned int g_hash_table_size(GHashTable *ht)",
);
const g_hash_table_unref = glibLib.func(
    "void g_hash_table_unref(GHashTable *ht)",
);
const g_list_free = glibLib.func("void g_list_free(GList *list)");

const gobjectLib = koffi.load("libgobject-2.0.so.0");
const g_object_unref = gobjectLib.func("void g_object_unref(void *object)");

// Get function pointer addresses for g_str_hash and g_str_equal
const gStrHashAddr = koffi.address(g_str_hash);
const gStrEqualAddr = koffi.address(g_str_equal);

// libsecret password functions (v variants)
const secret_password_storev_sync = secretLib.func(
    "int secret_password_storev_sync(" +
        "const SecretSchema *schema, " +
        "GHashTable *attributes, " +
        "const char *collection, " +
        "const char *label, " +
        "const char *password, " +
        "GCancellable *cancellable, " +
        "_Out_ GError **error)",
);

const secret_password_lookupv_sync = secretLib.func(
    "char *secret_password_lookupv_sync(" +
        "const SecretSchema *schema, " +
        "GHashTable *attributes, " +
        "GCancellable *cancellable, " +
        "_Out_ GError **error)",
);

const secret_password_clearv_sync = secretLib.func(
    "int secret_password_clearv_sync(" +
        "const SecretSchema *schema, " +
        "GHashTable *attributes, " +
        "GCancellable *cancellable, " +
        "_Out_ GError **error)",
);

const secret_password_free = secretLib.func(
    "void secret_password_free(char *password)",
);

const secret_password_searchv_sync = secretLib.func(
    "GList *secret_password_searchv_sync(" +
        "const SecretSchema *schema, " +
        "GHashTable *attributes, " +
        "int flags, " +
        "GCancellable *cancellable, " +
        "_Out_ GError **error)",
);

const secret_retrievable_get_label = secretLib.func(
    "char *secret_retrievable_get_label(SecretRetrievable *self)",
);

const secret_retrievable_get_attributes = secretLib.func(
    "GHashTable *secret_retrievable_get_attributes(SecretRetrievable *self)",
);

const secret_retrievable_get_created = secretLib.func(
    "uint64_t secret_retrievable_get_created(SecretRetrievable *self)",
);

const secret_retrievable_get_modified = secretLib.func(
    "uint64_t secret_retrievable_get_modified(SecretRetrievable *self)",
);

const secret_retrievable_retrieve_secret_sync = secretLib.func(
    "SecretValue *secret_retrievable_retrieve_secret_sync(" +
        "SecretRetrievable *self, " +
        "GCancellable *cancellable, " +
        "_Out_ GError **error)",
);

const secret_value_get_text = secretLib.func(
    "const char *secret_value_get_text(SecretValue *value)",
);

const secret_value_unref = secretLib.func(
    "void secret_value_unref(SecretValue *value)",
);

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Build a koffi-compatible SecretSchema JS object from our definition.
 */
function buildSchema(def: SecretSchemaDefinition): Record<string, unknown> {
    const attrs = [];
    const count = Math.min(def.attributes.length, 31);

    for (let i = 0; i < count; i++) {
        attrs.push({
            name: def.attributes[i].name,
            type: def.attributes[i].type,
        });
    }

    // Fill remaining slots with sentinel {NULL, 0}
    for (let i = count; i < 32; i++) {
        attrs.push({ name: null, type: 0 });
    }

    return {
        name: def.name,
        flags: def.flags,
        attributes: attrs,
        reserved: 0,
        reserved1: null,
        reserved2: null,
        reserved3: null,
        reserved4: null,
        reserved5: null,
        reserved6: null,
        reserved7: null,
    };
}

/**
 * Build a GHashTable from a JS Record<string, string>.
 */
// deno-lint-ignore no-explicit-any
function buildHashTable(attrs: Record<string, string>): any {
    const ht = g_hash_table_new(gStrHashAddr, gStrEqualAddr);

    for (const [key, value] of Object.entries(attrs)) {
        g_hash_table_insert(ht, key, value);
    }

    return ht;
}

/**
 * Check a GError out-parameter. Throws if an error was set.
 */
// deno-lint-ignore no-explicit-any
function checkError(errorOut: any[], operation: string): void {
    if (errorOut[0] !== null && errorOut[0] !== undefined) {
        const errObj = koffi.decode(errorOut[0], GErrorStruct);
        const msg: string = errObj.message ?? "Unknown error";
        g_free(errorOut[0]);
        throw new Error(`${operation} failed: ${msg}`);
    }
}

// ── GList helpers ───────────────────────────────────────────────────────────

/**
 * Walk a GList and collect all `data` pointers.
 * Koffi decodes GList nodes into JS objects with { data, next, prev }.
 */
// deno-lint-ignore no-explicit-any
function glistToDataPointers(listObj: any): any[] {
    // deno-lint-ignore no-explicit-any
    const ptrs: any[] = [];
    let current = listObj;
    while (current !== null && current !== undefined) {
        if (current.data !== null && current.data !== undefined) {
            ptrs.push(current.data);
        }
        current = current.next;
    }
    return ptrs;
}

/**
 * Read a GHashTable of gchar*->gchar* into a JS Record using koffi.
 */
// deno-lint-ignore no-explicit-any
function readHashTableToRecord(htPtr: any): Record<string, string> {
    const result: Record<string, string> = {};
    const size: number = g_hash_table_size(htPtr);
    if (size === 0) return result;

    const keysListObj = g_hash_table_get_keys(htPtr);
    if (keysListObj !== null && keysListObj !== undefined) {
        const decoded = koffi.decode(keysListObj, GList);
        const keyPtrs = glistToDataPointers(decoded);
        for (const keyPtr of keyPtrs) {
            const key: string = koffi.decode(keyPtr, "const char *");
            const val = g_hash_table_lookup(htPtr, key);
            result[key] = val ?? "";
        }
        g_list_free(keysListObj);
    }
    return result;
}

/**
 * Extract password text from a SecretRetrievable.
 */
// deno-lint-ignore no-explicit-any
function extractPassword(itemPtr: any): string | null {
    const errorOut = [null];
    const secretVal = secret_retrievable_retrieve_secret_sync(
        itemPtr,
        null,
        errorOut,
    );

    if (secretVal === null || secretVal === undefined) return null;

    const text = secret_value_get_text(secretVal);
    secret_value_unref(secretVal);
    return typeof text === "string" ? text : null;
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
        const errorOut = [null];

        const ok = secret_password_storev_sync(
            sch,
            ht,
            collection,
            label,
            password,
            null, // cancellable
            errorOut,
        );

        g_hash_table_destroy(ht);
        checkError(errorOut, "secret_password_storev_sync");

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
        const errorOut = [null];

        const resultPtr = secret_password_lookupv_sync(
            sch,
            ht,
            null, // cancellable
            errorOut,
        );

        g_hash_table_destroy(ht);
        checkError(errorOut, "secret_password_lookupv_sync");

        if (resultPtr === null || resultPtr === undefined) {
            return null;
        }

        // koffi returns the string directly for char* return types
        const password: string = typeof resultPtr === "string"
            ? resultPtr
            : koffi.decode(resultPtr, "char *");

        // We still need to free the native memory if koffi gave us a pointer
        if (typeof resultPtr !== "string") {
            secret_password_free(resultPtr);
        }

        return password;
    },

    clear(
        schema: SecretSchemaDefinition,
        attributes: Record<string, string>,
    ): boolean {
        const sch = buildSchema(schema);
        const ht = buildHashTable(attributes);
        const errorOut = [null];

        const ok = secret_password_clearv_sync(
            sch,
            ht,
            null, // cancellable
            errorOut,
        );

        g_hash_table_destroy(ht);
        checkError(errorOut, "secret_password_clearv_sync");

        return !!ok;
    },

    search(
        schema: SecretSchemaDefinition,
        attributes: Record<string, string>,
        flags: number,
    ): SearchResult[] {
        const sch = buildSchema(schema);
        const ht = buildHashTable(attributes);
        const errorOut = [null];

        const listPtr = secret_password_searchv_sync(
            sch,
            ht,
            flags,
            null, // cancellable
            errorOut,
        );

        g_hash_table_destroy(ht);
        checkError(errorOut, "secret_password_searchv_sync");

        if (listPtr === null || listPtr === undefined) {
            return [];
        }

        const results: SearchResult[] = [];
        const decoded = koffi.decode(listPtr, GList);
        const itemPtrs = glistToDataPointers(decoded);

        for (const itemPtr of itemPtrs) {
            // label (caller-owned)
            const label: string = secret_retrievable_get_label(itemPtr) ?? "";

            // attributes (caller-owned hash table)
            const attrsHt = secret_retrievable_get_attributes(itemPtr);
            const itemAttrs = attrsHt !== null && attrsHt !== undefined
                ? readHashTableToRecord(attrsHt)
                : {};
            if (attrsHt !== null && attrsHt !== undefined) {
                g_hash_table_unref(attrsHt);
            }

            // timestamps
            const created: bigint = secret_retrievable_get_created(itemPtr);
            const modified: bigint = secret_retrievable_get_modified(itemPtr);

            // password
            const password = extractPassword(itemPtr);

            results.push({ label, attributes: itemAttrs, password, created, modified });
        }

        // Free the GList and unref each item
        for (const itemPtr of itemPtrs) {
            g_object_unref(itemPtr);
        }
        g_list_free(listPtr);

        return results;
    },
};
