import { test } from "node:test";
import { DefaultSecretGenerator, generateSecret, secretGenerator, validate } from "./generator.js";
import { equal, nope, ok, throws } from "@frostyeti/assert";
// =============================================================================
// validate function tests
// =============================================================================
test("secrets::validate returns true for valid password", () => {
  const data = new TextEncoder().encode("aB1!");
  ok(validate(data));
});
test("secrets::validate returns false without digit", () => {
  const data = new TextEncoder().encode("aBc!");
  nope(validate(data));
});
test("secrets::validate returns false without uppercase", () => {
  const data = new TextEncoder().encode("ab1!");
  nope(validate(data));
});
test("secrets::validate returns false without lowercase", () => {
  const data = new TextEncoder().encode("AB1!");
  nope(validate(data));
});
test("secrets::validate returns false without special character", () => {
  const data = new TextEncoder().encode("aB1c");
  nope(validate(data));
});
test("secrets::validate handles empty array", () => {
  const data = new Uint8Array(0);
  nope(validate(data));
});
// =============================================================================
// DefaultSecretGenerator tests
// =============================================================================
test("secrets::DefaultSecretGenerator basic generation", () => {
  const generator = new DefaultSecretGenerator();
  generator.add("abc");
  generator.add("def");
  generator.add("ghi");
  generator.add("1234567890");
  generator.add("ABCDEFGHI");
  generator.add("#_-!@");
  const secret = generator.generate(10);
  equal(secret.length, 10);
  nope(secret.includes("j"));
  nope(secret.includes("k"));
  nope(secret.includes("l"));
});
test("secrets::DefaultSecretGenerator addDefaults includes expected characters", () => {
  const generator = new DefaultSecretGenerator();
  generator.addDefaults();
  const secret = generator.generate(50);
  equal(secret.length, 50);
});
test("secrets::DefaultSecretGenerator addDigits", () => {
  const generator = new DefaultSecretGenerator();
  generator.addDigits();
  generator.add("Aa!"); // Need these to pass validation
  const secret = generator.generate(20);
  equal(secret.length, 20);
});
test("secrets::DefaultSecretGenerator addLower", () => {
  const generator = new DefaultSecretGenerator();
  generator.addLower();
  generator.add("A1!"); // Need these to pass validation
  const secret = generator.generate(20);
  equal(secret.length, 20);
});
test("secrets::DefaultSecretGenerator addUpper", () => {
  const generator = new DefaultSecretGenerator();
  generator.addUpper();
  generator.add("a1!"); // Need these to pass validation
  const secret = generator.generate(20);
  equal(secret.length, 20);
});
test("secrets::DefaultSecretGenerator addSpecial", () => {
  const generator = new DefaultSecretGenerator();
  generator.addSpecial();
  generator.add("aA1"); // Need these to pass validation
  const secret = generator.generate(20);
  equal(secret.length, 20);
});
test("secrets::DefaultSecretGenerator addSpecialSafe", () => {
  const generator = new DefaultSecretGenerator();
  generator.addSpecialSafe();
  generator.add("aA1"); // Need these to pass validation
  const secret = generator.generate(20);
  equal(secret.length, 20);
});
test("secrets::DefaultSecretGenerator chaining methods", () => {
  const generator = new DefaultSecretGenerator()
    .addLower()
    .addUpper()
    .addDigits()
    .addSpecialSafe();
  const secret = generator.generate(16);
  equal(secret.length, 16);
});
test("secrets::DefaultSecretGenerator setValidator with custom validator", () => {
  const generator = new DefaultSecretGenerator();
  generator.addDefaults();
  generator.setValidator(() => true); // Always valid
  const secret = generator.generate(5);
  equal(secret.length, 5);
});
test("secrets::DefaultSecretGenerator generateAsUint8Array", () => {
  const generator = new DefaultSecretGenerator();
  generator.addDefaults();
  const result = generator.generateAsUint8Array(16);
  ok(result instanceof Uint8Array);
  equal(result.length, 16);
});
test("secrets::DefaultSecretGenerator generates unique secrets", () => {
  const generator = new DefaultSecretGenerator();
  generator.addDefaults();
  const secrets = new Set();
  for (let i = 0; i < 100; i++) {
    secrets.add(generator.generate(16));
  }
  // All 100 secrets should be unique
  equal(secrets.size, 100);
});
test("secrets::DefaultSecretGenerator add ignores duplicates", () => {
  const generator = new DefaultSecretGenerator();
  generator.add("abc");
  generator.add("abc"); // Should be ignored
  generator.add("ABC1!"); // Add required chars
  const secret = generator.generate(20);
  equal(secret.length, 20);
});
test("secrets::DefaultSecretGenerator respects default validator", () => {
  const generator = new DefaultSecretGenerator();
  generator.addDefaults();
  // Generate many secrets and verify they all pass validation
  for (let i = 0; i < 10; i++) {
    const secret = generator.generate(16);
    const data = new TextEncoder().encode(secret);
    ok(validate(data));
  }
});
test("secrets::DefaultSecretGenerator throws when validation impossible", () => {
  const generator = new DefaultSecretGenerator();
  generator.add("aaa"); // Only lowercase, can never pass default validation
  generator.setValidator(() => false); // Always fail
  throws(() => {
    generator.generate(10);
  }, "Failed to generate secret");
});
// =============================================================================
// generateSecret function tests
// =============================================================================
test("secrets::generateSecret with default characters", () => {
  const secret = generateSecret(16);
  equal(secret.length, 16);
  const data = new TextEncoder().encode(secret);
  ok(validate(data));
});
test("secrets::generateSecret with custom characters", () => {
  const secret = generateSecret(16, "ABCabc123!@#");
  equal(secret.length, 16);
});
test("secrets::generateSecret different lengths", () => {
  equal(generateSecret(8).length, 8);
  equal(generateSecret(16).length, 16);
  equal(generateSecret(32).length, 32);
  equal(generateSecret(64).length, 64);
});
// =============================================================================
// secretGenerator (global instance) tests
// =============================================================================
test("secrets::secretGenerator is pre-configured", () => {
  const secret = secretGenerator.generate(16);
  equal(secret.length, 16);
  const data = new TextEncoder().encode(secret);
  ok(validate(data));
});
test("secrets::secretGenerator generates valid secrets repeatedly", () => {
  for (let i = 0; i < 10; i++) {
    const secret = secretGenerator.generate(20);
    equal(secret.length, 20);
  }
});
