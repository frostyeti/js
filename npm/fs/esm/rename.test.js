import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { rename, renameSync } from "./rename.js";
import { join } from "@frostyeti/path";
import { makeDir } from "./make_dir.js";
import { writeTextFile } from "./write_text_file.js";
import { remove } from "./remove.js";
import { readTextFile } from "./read_text_file.js";
const testData = join(import.meta.dirname, "test-data", "rename-test");
test("fs::rename renames a file", async () => {
  await makeDir(testData, { recursive: true });
  const oldPath = join(testData, "old.txt");
  const newPath = join(testData, "new.txt");
  const content = "test content";
  try {
    await writeTextFile(oldPath, content);
    await rename(oldPath, newPath);
    const renamedContent = await readTextFile(newPath);
    equal(renamedContent, content);
  } finally {
    await remove(testData, { recursive: true });
  }
});
test("fs::renameSync renames a file", async () => {
  await makeDir(testData, { recursive: true });
  const oldPath = join(testData, "old-sync.txt");
  const newPath = join(testData, "new-sync.txt");
  const content = "test content sync";
  try {
    await writeTextFile(oldPath, content);
    renameSync(oldPath, newPath);
    const renamedContent = await readTextFile(newPath);
    equal(renamedContent, content);
  } finally {
    await remove(testData, { recursive: true });
  }
});
