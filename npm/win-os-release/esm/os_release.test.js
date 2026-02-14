import { test } from "node:test";
import { equal, ok } from "@frostyeti/assert";
import { WINDOWS } from "@frostyeti/globals/os";
import { WinOsRelease } from "./mod.js";
function parseOsRelease(text) {
  const out = {};
  for (const line of text.split("\n")) {
    const idx = line.indexOf("=");
    if (idx === -1) {
      continue;
    }
    const key = line.slice(0, idx);
    const raw = line.slice(idx + 1);
    const value = raw.startsWith('"') && raw.endsWith('"')
      ? raw.slice(1, -1)
      : raw;
    out[key] = value;
  }
  return out;
}
// =============================================================================
// Os release format
// =============================================================================
test("win-os-release::getOsReleaseText returns os-release fields", {
  skip: !WINDOWS,
}, () => {
  const text = WinOsRelease.getOsReleaseText();
  const parsed = parseOsRelease(text);
  equal(parsed.ID, "windows");
  equal(parsed.NAME, "Windows");
  ok(parsed.PRETTY_NAME.length > 0);
  ok(parsed.VARIANT.length > 0);
  ok(parsed.VERSION_CODENAME.length > 0);
});
test("win-os-release::getOsReleaseJson matches os-release text", {
  skip: !WINDOWS,
}, () => {
  const text = WinOsRelease.getOsReleaseText();
  const json = WinOsRelease.getOsReleaseJson();
  const parsed = parseOsRelease(text);
  equal(json.id, parsed.ID);
  equal(json.name, parsed.NAME);
  equal(json.prettyName, parsed.PRETTY_NAME);
  equal(json.variant, parsed.VARIANT);
  equal(json.codeName, parsed.VERSION_CODENAME);
});
test(
  "win-os-release::getOsReleaseJson variant is valid",
  { skip: !WINDOWS },
  () => {
    const json = WinOsRelease.getOsReleaseJson();
    ok(["Workstation", "Server", "Domain Controller"].includes(json.variant));
  },
);
