import { test } from "node:test";
import { equal, rejects, throws } from "@frostyeti/assert";
import { link, linkSync } from "./link.js";
import { join } from "@frostyeti/path";
import { exec, output } from "./_testutils.js";
import { writeTextFile, writeTextFileSync } from "./write_text_file.js";
const testData = join(import.meta.dirname, "test-data", "links");
test("fs::link creates a hard link to an existing file", async () => {
  await exec("mkdir", ["-p", testData]);
  const sourcePath = join(testData, "source1.txt");
  const linkPath = join(testData, "link1.txt");
  const content = "test content";
  try {
    await writeTextFile(sourcePath, content);
    await link(sourcePath, linkPath);
    const o = await output("cat", [linkPath]);
    const linkedContent = o.stdout.trim();
    equal(linkedContent, content);
  } finally {
    await exec("rm", ["-fr", testData]);
  }
});
test("fs::link throws when source file doesn't exist", async () => {
  await exec("mkdir", ["-p", testData]);
  const sourcePath = join(testData, "nonexistent.txt");
  const linkPath = join(testData, "link.txt");
  try {
    await rejects(async () => await link(sourcePath, linkPath), Error);
  } finally {
    await exec("rm", ["-fr", testData]);
  }
});
test("fs::linkSync creates a hard link to an existing file", async () => {
  await exec("mkdir", ["-p", testData]);
  const sourcePath = join(testData, "source2.txt");
  const linkPath = join(testData, "link2.txt");
  const content = "test content";
  try {
    writeTextFileSync(sourcePath, content);
    linkSync(sourcePath, linkPath);
    const o = await output("cat", [linkPath]);
    const linkedContent = o.stdout.trim();
    equal(linkedContent, content);
  } finally {
    await exec("rm", ["-fr", testData]);
  }
});
test("fs::linkSync throws when source file doesn't exist", async () => {
  await exec("mkdir", ["-p", testData]);
  const sourcePath = join(testData, "nonexistent2.txt");
  const linkPath = join(testData, "link2.txt");
  try {
    throws(() => linkSync(sourcePath, linkPath), Error);
  } finally {
    await exec("rm", ["-fr", testData]);
  }
});
