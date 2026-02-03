import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { isfile, isfileSync } from "./isfile.js";
import { join } from "@frostyeti/path";
import { mkdir, mkdirSync } from "./mkdir.js";
import { writeTextFile } from "./write_text_file.js";
import { rm } from "./rm.js";
const testData = join(import.meta.dirname, "test-data", "is_file");
test("fs::isFile returns true for existing file", async () => {
  await mkdir(testData, { recursive: true });
  const filePath = join(testData, "test.txt");
  try {
    await writeTextFile(filePath, "test content");
    const result = await isfile(filePath);
    equal(result, true);
  } finally {
    await rm(testData, { recursive: true });
  }
});
test("fs::isFile returns false for directory", async () => {
  await mkdir(testData, { recursive: true });
  try {
    const result = await isfile(testData);
    equal(result, false);
  } finally {
    await rm(testData, { recursive: true });
  }
});
test("fs::isFile returns false for non-existent path", async () => {
  const result = await isfile("non-existent-file.txt");
  equal(result, false);
});
test("fs::isFileSync returns true for existing file", async () => {
  await mkdirSync(testData, { recursive: true });
  const filePath = join(testData, "test.txt");
  try {
    await writeTextFile(filePath, "test content");
    const result = isfileSync(filePath);
    equal(result, true);
  } finally {
    await rm(testData, { recursive: true });
  }
});
test("fs::isFileSync returns false for directory", async () => {
  mkdirSync(testData, { recursive: true });
  try {
    const result = isfileSync(testData);
    equal(result, false);
  } finally {
    await rm(testData, { recursive: true });
  }
});
test("fs::isFileSync returns false for non-existent path", () => {
  const result = isfileSync("non-existent-file.txt");
  equal(result, false);
});
