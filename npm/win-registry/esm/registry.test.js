import { test } from "node:test";
import { equal, ok, throws } from "@frostyeti/assert";
import {
  HKEY_CURRENT_USER,
  HKEY_LOCAL_MACHINE,
  multiStringToWide,
  parseRegistryPath,
  stringToWide,
  wideToMultiString,
  wideToString,
} from "./types.js";
import { Registry } from "./registry.js";
import { WINDOWS } from "@frostyeti/globals/os";
// -----------------------------------------------------------------------------
// Helper function tests (cross-platform)
// -----------------------------------------------------------------------------
test("win-registry::stringToWide and wideToString roundtrip", () => {
  const s = "hello";
  const wide = stringToWide(s);
  // should include null terminator (length * 2 bytes)
  equal(wide.length, (s.length + 1) * 2);
  equal(wide[0], 0x68);
  equal(wide[1], 0x00);
  const out = wideToString(wide);
  equal(out, s);
});
test("win-registry::wideToString stops at null terminator", () => {
  const buf = new Uint8Array([0x61, 0x00, 0x00, 0x00, 0x62, 0x00]); // "a\0b"
  equal(wideToString(buf), "a");
});
test("win-registry::multiStringToWide and wideToMultiString roundtrip", () => {
  const arr = ["one", "two", "three"];
  const wide = multiStringToWide(arr);
  // final buffer must end with double-null
  equal(wide[wide.length - 1], 0);
  const decoded = wideToMultiString(wide);
  equal(decoded.length, arr.length);
  equal(decoded[0], "one");
});
test("win-registry::multiStringToWide handles empty array", () => {
  const wide = multiStringToWide([]);
  // should be two zero characters (4 bytes)
  equal(wide.length, 4);
  equal(wide[0], 0);
  equal(wide[1], 0);
  equal(wide[2], 0);
  equal(wide[3], 0);
  const decoded = wideToMultiString(wide);
  equal(decoded.length, 0);
});
// parseRegistryPath
test("win-registry::parseRegistryPath recognizes common roots", () => {
  const p1 = parseRegistryPath("HKLM\\SOFTWARE\\Foo");
  equal(p1.hkey, HKEY_LOCAL_MACHINE);
  equal(p1.subKey, "SOFTWARE\\Foo");
  const p2 = parseRegistryPath("HKEY_CURRENT_USER\\Console");
  equal(p2.hkey, HKEY_CURRENT_USER);
  equal(p2.subKey, "Console");
});
test("win-registry::parseRegistryPath throws on unknown root", () => {
  throws(() => parseRegistryPath("UNKNOWN\\Path"));
});
// -----------------------------------------------------------------------------
// Integration tests that exercise the real Windows registry (Windows only)
// -----------------------------------------------------------------------------
const TEST_KEY = "HKCU\\Software\\frostyeti-js-test-registry";
test("win-registry::Registry create/open/set/get/delete (Windows)", {
  skip: !WINDOWS,
}, () => {
  // create key
  const k = Registry.createKey(TEST_KEY);
  try {
    // set string
    k.setString("TestString", "hello-registry");
    equal(k.getString("TestString"), "hello-registry");
    // set dword
    k.setInt32("TestDword", 0x11223344);
    equal(k.getInt32("TestDword"), 0x11223344);
    // set qword
    k.setInt64("TestQword", 0x1122334455667788n);
    equal(k.getInt64("TestQword"), 0x1122334455667788n);
    // set multi string
    k.setMultiString("TestMulti", ["a", "b"]);
    const ms = k.getMultiString("TestMulti");
    equal(ms.length, 2);
    equal(ms[0], "a");
    // set binary
    const bin = new Uint8Array([1, 2, 3, 4]);
    k.setBinary("TestBin", bin);
    const gotBin = k.getBinary("TestBin");
    equal(gotBin.length, 4);
    // value names
    const names = k.getValueNames();
    ok(names.includes("TestString"));
    // delete value
    k.deleteValue("TestString");
    // attempting to read now should throw
    try {
      k.getString("TestString");
      throw new Error("expected to throw when reading deleted value");
    } catch (_) {
      // expected
    }
  } finally {
    // cleanup
    Registry.deleteKey(TEST_KEY);
  }
});
test(
  "win-registry::openKey relative operations (Windows)",
  { skip: !WINDOWS },
  () => {
    const root = Registry.HKCU;
    const created = root.createKey(
      "Software\\frostyeti-js-test-registry-relative",
    );
    try {
      created.setString("Relative", "value");
      const child = root.openKey(
        "Software\\frostyeti-js-test-registry-relative",
      );
      equal(child.getString("Relative"), "value");
    } finally {
      Registry.deleteKey("HKCU\\Software\\frostyeti-js-test-registry-relative");
    }
  },
);
