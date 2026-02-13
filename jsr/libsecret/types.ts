/**
 * Shared types, enums, constants and backend interface for the
 * Linux libsecret module.
 *
 * All constants are sourced from `libsecret/secret-schema.h` and
 * `libsecret/secret-password.h`.
 * @module
 */

// ── Schema attribute types ──────────────────────────────────────────────────

/**
 * The type of a schema attribute.
 * Maps to `SecretSchemaAttributeType` from libsecret.
 */
export enum SecretSchemaAttributeType {
    /** A UTF-8 string attribute. */
    STRING = 0,
    /** An integer attribute (stored as a decimal string). */
    INTEGER = 1,
    /** A boolean attribute (stored as `"true"` or `"false"`). */
    BOOLEAN = 2,
}

// ── Schema flags ────────────────────────────────────────────────────────────

/**
 * Flags controlling schema matching behaviour.
 * Maps to `SecretSchemaFlags` from libsecret.
 */
export enum SecretSchemaFlags {
    /** Match both the schema name and attributes during lookup/clear. */
    NONE = 0,
    /**
     * Only match attributes, ignoring the schema name.
     * Useful for interoperability with items stored by other libraries.
     */
    DONT_MATCH_NAME = 1 << 1,
}

// ── Search flags ────────────────────────────────────────────────────────────

/**
 * Flags controlling search behaviour.
 * Maps to `SecretSearchFlags` from libsecret.
 * These are bit flags and can be combined with `|`.
 */
export enum SecretSearchFlags {
    /** Return only the single best match (most recently stored). */
    NONE = 0,
    /** Return all matching items, not just the best one. */
    ALL = 1 << 1,
    /** Automatically unlock any locked items before returning. */
    UNLOCK = 1 << 2,
    /** Pre-load the secret values so they are available without a separate retrieve call. */
    LOAD_SECRETS = 1 << 3,
}

// ── Search result ───────────────────────────────────────────────────────────

/**
 * A single search result returned by the `search` method.
 * Contains the item's metadata, attributes, and optionally its secret.
 */
export interface SearchResult {
    /** The human-readable label of the item. */
    label: string;
    /** The key/value attributes stored on the item. */
    attributes: Record<string, string>;
    /**
     * The secret password, or `null` if the secret was not loaded.
     * Only populated when {@link SecretSearchFlags.LOAD_SECRETS} is included
     * in the search flags.
     */
    password: string | null;
    /** UNIX timestamp (seconds since epoch) of when the item was created. */
    created: bigint;
    /** UNIX timestamp (seconds since epoch) of when the item was last modified. */
    modified: bigint;
}

// ── Collection constants ────────────────────────────────────────────────────

/**
 * Well-known collection aliases recognised by the Secret Service.
 */
export const SECRET_COLLECTION_DEFAULT = "default";

/**
 * A session-only collection that is cleared on logout.
 */
export const SECRET_COLLECTION_SESSION = "session";

// ── Schema definition ───────────────────────────────────────────────────────

/**
 * Describes a single attribute in a {@link SecretSchemaDefinition}.
 */
export interface SecretSchemaAttribute {
    /** The attribute name (e.g. `"service"`, `"account"`). */
    name: string;
    /** The attribute type. */
    type: SecretSchemaAttributeType;
}

/**
 * A high-level schema definition that mirrors `SecretSchema` from the
 * libsecret C API. Used to define the "type" of secret being stored.
 *
 * @example
 * ```typescript
 * const schema: SecretSchemaDefinition = {
 *     name: "org.example.Password",
 *     flags: SecretSchemaFlags.NONE,
 *     attributes: [
 *         { name: "service", type: SecretSchemaAttributeType.STRING },
 *         { name: "account", type: SecretSchemaAttributeType.STRING },
 *     ],
 * };
 * ```
 */
export interface SecretSchemaDefinition {
    /**
     * Dotted name identifying the schema, e.g. `"org.example.Password"`.
     * This is stored as a hidden attribute (`xdg:schema`) on the item.
     */
    name: string;
    /** Flags controlling matching behaviour. */
    flags: SecretSchemaFlags;
    /** The list of attribute definitions (max 31). */
    attributes: SecretSchemaAttribute[];
}

// ── Backend interface ───────────────────────────────────────────────────────

/**
 * The interface that each FFI backend must implement.
 * @internal
 */
export interface LibSecretBackend {
    /**
     * Store a password in the secret service.
     *
     * @param schema The schema defining the secret type.
     * @param attributes Key/value pairs identifying the secret.
     * @param collection The collection alias (`"default"`, `"session"`, or `null` for default).
     * @param label A human-readable label for the item.
     * @param password The secret string to store.
     */
    store(
        schema: SecretSchemaDefinition,
        attributes: Record<string, string>,
        collection: string | null,
        label: string,
        password: string,
    ): void;

    /**
     * Look up a password in the secret service.
     *
     * @param schema The schema defining the secret type.
     * @param attributes Key/value pairs identifying the secret.
     * @returns The password string, or `null` if not found.
     */
    lookup(
        schema: SecretSchemaDefinition,
        attributes: Record<string, string>,
    ): string | null;

    /**
     * Clear (delete) matching passwords from the secret service.
     *
     * @param schema The schema defining the secret type.
     * @param attributes Key/value pairs identifying the secrets to clear.
     * @returns `true` if one or more items were removed.
     */
    clear(
        schema: SecretSchemaDefinition,
        attributes: Record<string, string>,
    ): boolean;

    /**
     * Search for matching items in the secret service, returning
     * full details for each match.
     *
     * @param schema The schema defining the secret type.
     * @param attributes Key/value pairs to match against.
     * @param flags Search flags controlling behaviour.
     * @returns An array of search results.
     */
    search(
        schema: SecretSchemaDefinition,
        attributes: Record<string, string>,
        flags: number,
    ): SearchResult[];
}
