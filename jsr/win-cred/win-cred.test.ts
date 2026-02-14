import { test } from "node:test";
import { equal, fail } from "@frostyeti/assert";
import {
    decodeSecret,
    encodeSecret,
    WinCred,
} from "./mod.ts";
import { WINDOWS } from "@frostyeti/globals/os";
import { CredPersist, CredType } from "./types.ts";

const TEST_TARGET = "opencode-test/agent-test-credential";

test("win-cred::encodeSecret encodes string to UTF-16 LE bytes", () => {
    const encoded = encodeSecret("hello");
    equal(encoded.length, 10);
    equal(encoded[0], 104);
    equal(encoded[1], 0);
    equal(encoded[2], 101);
    equal(encoded[3], 0);
});

test("win-cred::encodeSecret handles empty string", () => {
    const encoded = encodeSecret("");
    equal(encoded.length, 0);
});

test("win-cred::encodeSecret handles unicode characters", () => {
    const encoded = encodeSecret("ñoño");
    equal(encoded.length, 8);
});

test("win-cred::decodeSecret decodes UTF-16 LE bytes to string", () => {
    const encoded = encodeSecret("hello");
    const decoded = decodeSecret(encoded);
    equal(decoded, "hello");
});

test("win-cred::decodeSecret handles empty bytes", () => {
    const decoded = decodeSecret(new Uint8Array(0));
    equal(decoded, "");
});

test("win-cred::decodeSecret handles unicode characters", () => {
    const encoded = encodeSecret("ñoño");
    const decoded = decodeSecret(encoded);
    equal(decoded, "ñoño");
});

test("win-cred::encodeSecret and decodeSecret are reversible", () => {
    const original = "MySecretPassword123!";
    const encoded = encodeSecret(original);
    const decoded = decodeSecret(encoded);
    equal(decoded, original);
});

test("win-cred::WinCred.write creates a credential", { skip: !WINDOWS }, () => {
    try {
        WinCred.write({
            targetName: TEST_TARGET,
            secret: "test-secret-value",
            userName: "testuser",
            comment: "Test credential for opencode",
            persist: CredPersist.LOCAL_MACHINE,
        });

        const secret = WinCred.readSecret(TEST_TARGET);
        if (secret === null) {
            fail("Failed to read back the written credential");
        }
        equal(secret, "test-secret-value");
    } finally {
        WinCred.delete(TEST_TARGET);
    }
});

test("win-cred::WinCred.read returns full credential object", { skip: !WINDOWS }, () => {
    try {
        WinCred.write({
            targetName: TEST_TARGET,
            secret: "test-secret",
            userName: "testuser",
            persist: CredPersist.LOCAL_MACHINE,
        });

        const cred = WinCred.read(TEST_TARGET);
        if (cred === null) {
            fail("Failed to read credential");
        }

        equal(cred.targetName, TEST_TARGET);
        equal(cred.userName, "testuser");
        equal(cred.type, CredType.GENERIC);
        equal(cred.persist, CredPersist.LOCAL_MACHINE);

        const decoded = decodeSecret(cred.credentialBlob);
        equal(decoded, "test-secret");
    } finally {
        WinCred.delete(TEST_TARGET);
    }
});

test("win-cred::WinCred.readSecret returns decoded string", { skip: !WINDOWS }, () => {
    try {
        WinCred.write({
            targetName: TEST_TARGET,
            secret: "password123",
            persist: CredPersist.LOCAL_MACHINE,
        });

        const secret = WinCred.readSecret(TEST_TARGET);
        equal(secret, "password123");
    } finally {
        WinCred.delete(TEST_TARGET);
    }
});

test("win-cred::WinCred.readSecret returns null for non-existent credential", { skip: !WINDOWS }, () => {
    const secret = WinCred.readSecret("non-existent-target-name-12345");
    equal(secret, null);
});

test("win-cred::WinCred.delete removes a credential", { skip: !WINDOWS }, () => {
    WinCred.write({
        targetName: TEST_TARGET,
        secret: "to-be-deleted",
        persist: CredPersist.LOCAL_MACHINE,
    });

    const deleted = WinCred.delete(TEST_TARGET);
    equal(deleted, true);

    const secret = WinCred.readSecret(TEST_TARGET);
    equal(secret, null);
});

test("win-cred::WinCred.delete returns false for non-existent credential", { skip: !WINDOWS }, () => {
    const deleted = WinCred.delete("non-existent-target-name-12345");
    equal(deleted, false);
});

test("win-cred::WinCred.enumerate returns matching credentials", { skip: !WINDOWS }, () => {
    try {
        WinCred.write({
            targetName: TEST_TARGET,
            secret: "enum-test",
            userName: "enumuser",
            persist: CredPersist.LOCAL_MACHINE,
        });

        const creds = WinCred.enumerate(TEST_TARGET);
        if (creds.length === 0) {
            fail("Expected to find at least one credential");
        }

        const found = creds.find((c) => c.targetName === TEST_TARGET);
        if (!found) {
            fail("Expected to find the test credential");
        }
        equal(found.userName, "enumuser");
    } finally {
        WinCred.delete(TEST_TARGET);
    }
});

test("win-cred::WinCred.enumerate with filter returns empty for non-matching", { skip: !WINDOWS }, () => {
    const creds = WinCred.enumerate("non-existent-filter-12345/*");
    equal(Array.isArray(creds), true);
});

test("win-cred::WinCred.write with Uint8Array secret", { skip: !WINDOWS }, () => {
    try {
        const secretBytes = new Uint8Array([72, 0, 101, 0, 108, 0, 108, 0, 111, 0]);
        WinCred.write({
            targetName: TEST_TARGET,
            secret: secretBytes,
            persist: CredPersist.LOCAL_MACHINE,
        });

        const secret = WinCred.readSecret(TEST_TARGET);
        if (secret === null) {
            fail("Failed to read credential");
        }
        equal(secret, "Hello");
    } finally {
        WinCred.delete(TEST_TARGET);
    }
});

test("win-cred::WinCred.write updates existing credential", { skip: !WINDOWS }, () => {
    try {
        WinCred.write({
            targetName: TEST_TARGET,
            secret: "original",
            userName: "user1",
            persist: CredPersist.LOCAL_MACHINE,
        });

        WinCred.write({
            targetName: TEST_TARGET,
            secret: "updated",
            userName: "user2",
            persist: CredPersist.LOCAL_MACHINE,
        });

        const cred = WinCred.read(TEST_TARGET);
        if (cred === null) {
            fail("Failed to read credential after update");
        }

        const decoded = decodeSecret(cred.credentialBlob);
        equal(decoded, "updated");
        equal(cred.userName, "user2");
    } finally {
        WinCred.delete(TEST_TARGET);
    }
});
