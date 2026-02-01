import { test } from "node:test";
import { DefaultSecretMasker } from "./masker.ts";
import { equal, ok } from "@frostyeti/assert";

// =============================================================================
// DefaultSecretMasker basic tests
// =============================================================================

test("secrets::DefaultSecretMasker masks added secret", () => {
    const masker = new DefaultSecretMasker();
    masker.add("mysecret");

    equal(masker.mask("mysecret"), "*******");
    equal(masker.mask("The mysecret is here"), "The ******* is here");
});

test("secrets::DefaultSecretMasker leaves unregistered text unchanged", () => {
    const masker = new DefaultSecretMasker();
    masker.add("secret1");

    equal(masker.mask("other text"), "other text");
    equal(masker.mask("secret2"), "secret2");
});

test("secrets::DefaultSecretMasker handles null input", () => {
    const masker = new DefaultSecretMasker();
    masker.add("secret");

    equal(masker.mask(null), null);
});

test("secrets::DefaultSecretMasker handles empty string", () => {
    const masker = new DefaultSecretMasker();
    masker.add("secret");

    equal(masker.mask(""), "");
});

test("secrets::DefaultSecretMasker ignores null/undefined secrets", () => {
    const masker = new DefaultSecretMasker();
    // @ts-ignore - testing edge case
    masker.add(null);
    // @ts-ignore - testing edge case
    masker.add(undefined);
    masker.add("valid");

    equal(masker.mask("valid"), "*******");
});

test("secrets::DefaultSecretMasker ignores whitespace-only secrets", () => {
    const masker = new DefaultSecretMasker();
    masker.add("   ");
    masker.add("\t\n");
    masker.add("valid");

    equal(masker.mask("valid"), "*******");
    equal(masker.mask("   "), "   ");
});

test("secrets::DefaultSecretMasker trims string secrets", () => {
    const masker = new DefaultSecretMasker();
    masker.add("  secret  ");

    equal(masker.mask("secret"), "*******");
});

test("secrets::DefaultSecretMasker prevents duplicate secrets", () => {
    const masker = new DefaultSecretMasker();
    masker.add("secret");
    masker.add("secret");

    // Should work without issues
    equal(masker.mask("secret secret"), "******* *******");
});

// =============================================================================
// Regex pattern tests
// =============================================================================

test("secrets::DefaultSecretMasker with regex pattern", () => {
    const masker = new DefaultSecretMasker();
    masker.add(/password=\w+/gi);

    equal(masker.mask("password=abc123"), "*******");
    equal(masker.mask("PASSWORD=XYZ789"), "*******");
});

test("secrets::DefaultSecretMasker with multiple regex patterns", () => {
    const masker = new DefaultSecretMasker();
    masker.add(/api[_-]?key[=:]\w+/gi);
    masker.add(/token[=:]\w+/gi);

    equal(masker.mask("api_key=abc123"), "*******");
    equal(masker.mask("TOKEN:xyz789"), "*******");
});

// =============================================================================
// Generator tests
// =============================================================================

test("secrets::DefaultSecretMasker with generator for variants", () => {
    const masker = new DefaultSecretMasker();
    masker.addGenerator((secret) => secret.toUpperCase());
    masker.add("secret");

    equal(masker.mask("secret"), "*******");
    equal(masker.mask("SECRET"), "*******");
});

test("secrets::DefaultSecretMasker with multiple generators", () => {
    const masker = new DefaultSecretMasker();
    masker.addGenerator((secret) => secret.toUpperCase());
    masker.addGenerator((secret) => secret.toLowerCase());
    masker.add("Secret");

    equal(masker.mask("Secret"), "*******");
    equal(masker.mask("SECRET"), "*******");
    equal(masker.mask("secret"), "*******");
});

test("secrets::DefaultSecretMasker generator applied to new secrets", () => {
    const masker = new DefaultSecretMasker();
    masker.addGenerator((secret) => secret.split("").reverse().join(""));
    masker.add("hello");

    equal(masker.mask("hello"), "*******");
    equal(masker.mask("olleh"), "*******"); // reversed
});

// =============================================================================
// Method chaining tests
// =============================================================================

test("secrets::DefaultSecretMasker supports method chaining", () => {
    const masker = new DefaultSecretMasker()
        .addGenerator((s) => s.toUpperCase()) // Generator must be added BEFORE secrets
        .add("secret1")
        .add("secret2");

    equal(masker.mask("secret1 and secret2"), "******* and *******");
    equal(masker.mask("SECRET1 and SECRET2"), "******* and *******");
});

// =============================================================================
// Multiple occurrences tests
// =============================================================================

test("secrets::DefaultSecretMasker masks all occurrences", () => {
    const masker = new DefaultSecretMasker();
    masker.add("key");

    equal(masker.mask("key key key"), "******* ******* *******");
});

test("secrets::DefaultSecretMasker masks overlapping secrets", () => {
    const masker = new DefaultSecretMasker();
    masker.add("secret");
    masker.add("supersecret");

    const result = masker.mask("supersecret")!;
    ok(result.includes("*******"));
});

// =============================================================================
// Real-world scenarios
// =============================================================================

test("secrets::DefaultSecretMasker masks connection strings", () => {
    const masker = new DefaultSecretMasker();
    masker.add("mypassword123");
    masker.add("myapikey456");

    const connStr = "postgres://user:mypassword123@localhost/db?apikey=myapikey456";
    const masked = masker.mask(connStr)!;

    ok(!masked.includes("mypassword123"));
    ok(!masked.includes("myapikey456"));
    ok(masked.includes("*******"));
});

test("secrets::DefaultSecretMasker masks JSON output", () => {
    const masker = new DefaultSecretMasker();
    masker.add("secret-token-value");

    const json = '{"token": "secret-token-value", "user": "john"}';
    const masked = masker.mask(json)!;

    ok(!masked.includes("secret-token-value"));
    ok(masked.includes('"user": "john"'));
});

test("secrets::DefaultSecretMasker masks log output", () => {
    const masker = new DefaultSecretMasker();
    masker.addGenerator((s) => s.toUpperCase()); // Generator before secrets
    masker.add("supersecret123");

    const log = "[INFO] Connecting with password: supersecret123\n[DEBUG] Auth: SUPERSECRET123";
    const masked = masker.mask(log)!;

    ok(!masked.includes("supersecret123"));
    ok(!masked.includes("SUPERSECRET123"));
});
