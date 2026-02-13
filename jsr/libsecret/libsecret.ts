/**
 * High-level, runtime-agnostic libsecret facade.
 *
 * The `LibSecret` class provides static methods for storing, looking up,
 * and clearing passwords in the Linux Secret Service. It delegates to
 * the active {@link LibSecretBackend} which is injected via
 * {@link setBackend}.
 *
 * @module
 */
import type { LibSecretBackend, SearchResult, SecretSchemaDefinition } from "./types.ts";
import {
    SECRET_COLLECTION_DEFAULT,
    SecretSchemaAttributeType,
    SecretSchemaFlags,
    SecretSearchFlags,
} from "./types.ts";

let _backend: LibSecretBackend | null = null;

/**
 * Set the FFI backend used by `LibSecret`.
 * Called automatically by `mod.ts` after runtime detection.
 * @internal
 */
export function setBackend(b: LibSecretBackend): void {
    _backend = b;
}

function getBackend(): LibSecretBackend {
    if (!_backend) {
        throw new Error(
            "LibSecret backend not initialised. Import from " +
                "'@frostyeti/libsecret' (mod.ts) which auto-detects the runtime, " +
                "or call setBackend() manually.",
        );
    }
    return _backend;
}

// ── Default schema ──────────────────────────────────────────────────────────

/**
 * The default schema used when no custom schema is provided.
 * Uses `"service"` and `"account"` attributes which is the
 * conventional pattern for credential storage.
 */
export const DEFAULT_SCHEMA: SecretSchemaDefinition = {
    name: "org.freedesktop.Secret.Generic",
    flags: SecretSchemaFlags.NONE,
    attributes: [
        { name: "service", type: SecretSchemaAttributeType.STRING },
        { name: "account", type: SecretSchemaAttributeType.STRING },
    ],
};

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Options for storing a password.
 */
export interface StoreOptions {
    /** The service name. Used as the `"service"` attribute with the default schema. */
    service: string;
    /** The account name. Used as the `"account"` attribute with the default schema. */
    account: string;
    /** The secret string to store. */
    password: string;
    /** A human-readable label for the item. Defaults to `"<service>: <account>"`. */
    label?: string;
    /** The collection to store in. Defaults to `"default"`. */
    collection?: string | null;
    /** A custom schema. Defaults to {@link DEFAULT_SCHEMA}. */
    schema?: SecretSchemaDefinition;
    /** Custom attributes (overrides service/account when a custom schema is used). */
    attributes?: Record<string, string>;
}

/**
 * Options for looking up or clearing a password.
 */
export interface LookupOptions {
    /** The service name. */
    service: string;
    /** The account name. */
    account: string;
    /** A custom schema. Defaults to {@link DEFAULT_SCHEMA}. */
    schema?: SecretSchemaDefinition;
    /** Custom attributes (overrides service/account when a custom schema is used). */
    attributes?: Record<string, string>;
}

/**
 * Options for searching items.
 */
export interface SearchOptions {
    /** The service name. */
    service: string;
    /** The account name. */
    account: string;
    /** A custom schema. Defaults to {@link DEFAULT_SCHEMA}. */
    schema?: SecretSchemaDefinition;
    /** Custom attributes (overrides service/account when a custom schema is used). */
    attributes?: Record<string, string>;
    /**
     * Search flags controlling behaviour. Defaults to
     * `SecretSearchFlags.ALL | SecretSearchFlags.UNLOCK | SecretSearchFlags.LOAD_SECRETS`.
     */
    flags?: SecretSearchFlags;
}

/**
 * The static `LibSecret` class is the primary entry point for working with
 * the Linux Secret Service via libsecret.
 */
export class LibSecret {
    /**
     * Store a password in the secret service.
     *
     * @example
     * ```typescript
     * LibSecret.store({
     *     service: "myapp",
     *     account: "user@example.com",
     *     password: "s3cret",
     * });
     * ```
     */
    static store(options: StoreOptions): void {
        const schema = options.schema ?? DEFAULT_SCHEMA;
        const attrs = options.attributes ?? {
            service: options.service,
            account: options.account,
        };
        const label = options.label ?? `${options.service}: ${options.account}`;
        const collection = options.collection ?? SECRET_COLLECTION_DEFAULT;

        getBackend().store(schema, attrs, collection, label, options.password);
    }

    /**
     * Look up a password in the secret service.
     *
     * @returns The password string, or `null` if not found.
     *
     * @example
     * ```typescript
     * const pw = LibSecret.lookup({
     *     service: "myapp",
     *     account: "user@example.com",
     * });
     * if (pw) {
     *     console.log("Found:", pw);
     * }
     * ```
     */
    static lookup(options: LookupOptions): string | null {
        const schema = options.schema ?? DEFAULT_SCHEMA;
        const attrs = options.attributes ?? {
            service: options.service,
            account: options.account,
        };

        return getBackend().lookup(schema, attrs);
    }

    /**
     * Clear (delete) matching passwords from the secret service.
     *
     * @returns `true` if one or more items were removed.
     *
     * @example
     * ```typescript
     * const removed = LibSecret.clear({
     *     service: "myapp",
     *     account: "user@example.com",
     * });
     * ```
     */
    static clear(options: LookupOptions): boolean {
        const schema = options.schema ?? DEFAULT_SCHEMA;
        const attrs = options.attributes ?? {
            service: options.service,
            account: options.account,
        };

        return getBackend().clear(schema, attrs);
    }

    /**
     * Search for matching items in the secret service, returning
     * full details (label, attributes, password, timestamps) for each match.
     *
     * @returns An array of {@link SearchResult} objects.
     *
     * @example
     * ```typescript
     * const items = LibSecret.search({
     *     service: "myapp",
     *     account: "user@example.com",
     * });
     * for (const item of items) {
     *     console.log(item.label, item.attributes, item.password);
     * }
     * ```
     */
    static search(options: SearchOptions): SearchResult[] {
        const schema = options.schema ?? DEFAULT_SCHEMA;
        const attrs = options.attributes ?? {
            service: options.service,
            account: options.account,
        };
        const flags = options.flags ??
            (SecretSearchFlags.ALL | SecretSearchFlags.UNLOCK |
                SecretSearchFlags.LOAD_SECRETS);

        return getBackend().search(schema, attrs, flags);
    }
}
