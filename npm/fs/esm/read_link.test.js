import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { readLink, readLinkSync } from "./read_link.js";
import { join } from "@frostyeti/path";
import { makeDir } from "./make_dir.js";
import { WIN } from "./globals.js";
import { writeTextFile } from "./write_text_file.js";
import { remove } from "./remove.js";
import { symlink } from "./symlink.js";
const testData = join(import.meta.dirname, "test-data", "read_link");
test("fs::readLink reads target of symbolic link", { skip: WIN }, async () => {
  await makeDir(testData, { recursive: true });
  const sourcePath = join(testData, "source2.txt");
  const linkPath = join(testData, "link2.txt");
  const content = "test content";
  try {
    await writeTextFile(sourcePath, content);
    await symlink(sourcePath, linkPath);
    const target = await readLink(linkPath);
    equal(target, sourcePath);
  } finally {
    await remove(testData, { recursive: true });
  }
});
test("fs::readLinkSync reads target of symbolic link", async () => {
  await makeDir(testData, { recursive: true });
  const sourcePath = join(testData, "source3.txt");
  const linkPath = join(testData, "link3.txt");
  const content = "test content";
  try {
    await writeTextFile(sourcePath, content);
    await symlink(sourcePath, linkPath);
    const target = readLinkSync(linkPath);
    equal(target, sourcePath);
  } finally {
    await remove(testData, { recursive: true });
  }
});
