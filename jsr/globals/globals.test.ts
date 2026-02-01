import { test } from "node:test";
import { equal, ok, strictEquals } from "@frostyeti/assert";
import { getGlobal, globals, hasGlobal, setGlobal } from "./globals.ts";

test("globals::globals is globalThis", () => {
    strictEquals(globals, globalThis);
});

test("globals::hasGlobal returns true for existing global", () => {
    ok(hasGlobal("globalThis"));
    ok(hasGlobal("Object"));
    ok(hasGlobal("Array"));
});

test("globals::hasGlobal returns false for non-existing global", () => {
    equal(hasGlobal("nonExistentGlobal12345"), false);
    equal(hasGlobal("anotherFakeGlobal"), false);
});

test("globals::hasGlobal with symbol", () => {
    const testSymbol = Symbol("testSymbol");
    equal(hasGlobal(testSymbol), false);

    // Set a global with symbol and verify
    globals[testSymbol] = "test value";
    ok(hasGlobal(testSymbol));

    // Cleanup
    delete globals[testSymbol];
});

test("globals::hasGlobal with dot notation for nested properties", () => {
    // Test existing nested property
    ok(hasGlobal("Object.prototype"));
    ok(hasGlobal("Array.isArray"));

    // Test non-existing nested property
    equal(hasGlobal("Object.nonExistent.property"), false);
    equal(hasGlobal("nonExistent.nested.path"), false);
});

test("globals::getGlobal returns existing global value", () => {
    strictEquals(getGlobal("Object"), Object);
    strictEquals(getGlobal("Array"), Array);
    strictEquals(getGlobal("Math"), Math);
});

test("globals::getGlobal returns undefined for non-existing global", () => {
    strictEquals(getGlobal("nonExistentGlobal12345"), undefined);
});

test("globals::getGlobal with symbol", () => {
    const testSymbol = Symbol("testGetSymbol");
    strictEquals(getGlobal(testSymbol), undefined);

    globals[testSymbol] = { value: 42 };
    const result = getGlobal<{ value: number }>(testSymbol);
    equal(result?.value, 42);

    // Cleanup
    delete globals[testSymbol];
});

test("globals::getGlobal with dot notation for nested properties", () => {
    strictEquals(getGlobal("Object.prototype"), Object.prototype);
    strictEquals(getGlobal("Array.isArray"), Array.isArray);
    strictEquals(getGlobal("Math.PI"), Math.PI);

    // Non-existing nested path
    strictEquals(getGlobal("Object.nonExistent.property"), undefined);
    strictEquals(getGlobal("nonExistent.nested.path"), undefined);
});

test("globals::setGlobal sets a simple global", () => {
    const testKey = "__testSetGlobal__";
    setGlobal(testKey, "test value");

    ok(hasGlobal(testKey));
    equal(getGlobal(testKey), "test value");

    // Cleanup
    delete globals[testKey];
});

test("globals::setGlobal with symbol", () => {
    const testSymbol = Symbol("testSetSymbol");
    setGlobal(testSymbol, { nested: { value: 123 } });

    ok(hasGlobal(testSymbol));
    const result = getGlobal<{ nested: { value: number } }>(testSymbol);
    equal(result?.nested.value, 123);

    // Cleanup
    delete globals[testSymbol];
});

test("globals::setGlobal with dot notation creates nested objects", () => {
    const basePath = "__testNested__";

    setGlobal(`${basePath}.level1.level2.value`, 42);

    ok(hasGlobal(basePath));
    ok(hasGlobal(`${basePath}.level1`));
    ok(hasGlobal(`${basePath}.level1.level2`));
    ok(hasGlobal(`${basePath}.level1.level2.value`));
    equal(getGlobal(`${basePath}.level1.level2.value`), 42);

    // Cleanup
    delete globals[basePath];
});

test("globals::setGlobal with dot notation overwrites existing nested value", () => {
    const basePath = "__testOverwrite__";

    setGlobal(`${basePath}.key`, "initial");
    equal(getGlobal(`${basePath}.key`), "initial");

    setGlobal(`${basePath}.key`, "updated");
    equal(getGlobal(`${basePath}.key`), "updated");

    // Cleanup
    delete globals[basePath];
});

test("globals::setGlobal with dot notation adds to existing object", () => {
    const basePath = "__testAddToExisting__";

    setGlobal(`${basePath}.first`, 1);
    setGlobal(`${basePath}.second`, 2);

    equal(getGlobal(`${basePath}.first`), 1);
    equal(getGlobal(`${basePath}.second`), 2);

    // Cleanup
    delete globals[basePath];
});
