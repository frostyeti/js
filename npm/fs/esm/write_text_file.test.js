import { test } from "node:test";
import { equal, rejects, throws } from "@frostyeti/assert";
import { writeTextFile, writeTextFileSync } from "./write_text_file.js";
import { join } from "@frostyeti/path";
import { makeDir } from "./make_dir.js";
import { remove } from "./remove.js";
import { readTextFile } from "./read_text_file.js";
const testData = join(import.meta.dirname, "test-data", "write_text_file");
test("fs::writeTextFile writes text content to a file", async () => {
  await makeDir(testData, { recursive: true });
  const filePath = join(testData, "test1.txt");
  const content = "Hello World!";
  try {
    await writeTextFile(filePath, content);
    const o = await readTextFile(filePath);
    equal(o, content);
  } finally {
    await remove(testData, { recursive: true });
  }
});
test("fs::writeTextFile appends text when append option is true", async () => {
  await makeDir(testData, { recursive: true });
  const filePath = join(testData, "test2.txt");
  const content1 = "First line\n";
  const content2 = "Second line";
  try {
    await writeTextFile(filePath, content1);
    await writeTextFile(filePath, content2, { append: true });
    const o = await readTextFile(filePath);
    equal(o, `${content1}${content2}`);
  } finally {
    await remove(testData, { recursive: true });
  }
});
test("fs::writeTextFile handles aborted signal", async () => {
  const controller = new AbortController();
  controller.abort();
  await rejects(
    () => writeTextFile("test.txt", "content", { signal: controller.signal }),
    Error,
  );
});
test("fs::writeTextFileSync writes text content to a file", async () => {
  await makeDir(testData, { recursive: true });
  const filePath = join(testData, "test3.txt");
  const content = "Sync content";
  try {
    writeTextFileSync(filePath, content);
    const o = await readTextFile(filePath);
    equal(o, content);
  } finally {
    await remove(testData, { recursive: true });
  }
});
test("fs::writeTextFileSync handles aborted signal", () => {
  const controller = new AbortController();
  controller.abort();
  throws(
    () => writeTextFileSync("test.txt", "content", { signal: controller.signal }),
    Error,
  );
});
