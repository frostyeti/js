import { test } from "node:test";
import { equal, ok } from "@frostyeti/assert";
import { join } from "@frostyeti/path";
import { lstat, lstatSync } from "./lstat.js";
import { makeDir } from "./make_dir.js";
import { remove } from "./remove.js";
import { writeTextFile } from "./write_text_file.js";
const testData = join(import.meta.dirname, "test-data", "lstat");
test("fs::lstat returns file info for a file", async () => {
  await makeDir(testData, { recursive: true });
  const filePath = join(testData, "test.txt");
  const content = "test content";
  try {
    await writeTextFile(filePath, content);
    const info = await lstat(filePath);
    ok(info.isFile);
    equal(info.name, "test.txt");
    equal(info.path, filePath);
    ok(info.size > 0);
  } finally {
    await remove(filePath);
  }
});
test("fs::lstat returns file info for a directory", async () => {
  await makeDir(testData, { recursive: true });
  try {
    const info = await lstat(testData);
    ok(info.isDirectory);
    ok(!info.isFile);
  } finally {
    await remove(testData, { recursive: true });
  }
});
test("fs::lstatSync returns file info for a file", async () => {
  await makeDir(testData, { recursive: true });
  const filePath = join(testData, "test-sync.txt");
  const content = "test content";
  try {
    await writeTextFile(filePath, content);
    const info = lstatSync(filePath);
    ok(info.isFile);
    equal(info.name, "test-sync.txt");
    equal(info.path, filePath);
    ok(info.size > 0);
  } finally {
    await remove(filePath);
  }
});
test("fs::lstat handles URL paths", async () => {
  await makeDir(testData, { recursive: true });
  const filePath = join(testData, "url-test.txt");
  const fileUrl = new URL(`file://${filePath}`);
  const content = "url test content";
  try {
    await writeTextFile(filePath, content);
    const info = await lstat(fileUrl);
    ok(info.isFile);
    equal(info.name, "url-test.txt");
    equal(info.path, fileUrl.toString());
  } finally {
    await remove(filePath);
  }
});
test("fs::lstat throws error for non-existent path", async () => {
  const nonExistentPath = join(testData, "non-existent.txt");
  try {
    await lstat(nonExistentPath);
    ok(false, "Should have thrown error");
  } catch (error) {
    ok(error instanceof Error);
  }
});
