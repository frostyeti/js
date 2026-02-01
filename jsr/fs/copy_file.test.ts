import { test } from "node:test";
import { equal, rejects, throws } from "@frostyeti/assert";
import { copyFile, copyFileSync } from "./copy_file.ts";
import { join } from "@frostyeti/path";
import { mkdir } from "./mkdir.ts";
import { writeTextFile } from "./write_text_file.ts";
import { readTextFile } from "./read_text_file.ts";
import { rm } from "./rm.ts";

const testDir = join(import.meta.dirname!, "test-data", "cp");
const sourceFile1 = join(testDir, "source1.txt");
const destFile1 = join(testDir, "dest1.txt");
const sourceFile2 = join(testDir, "source2.txt");
const destFile2 = join(testDir, "dest2.txt");
const content = "test content";

test("fs::copyFile copies file asynchronously", async () => {
    try {
        await mkdir(testDir, { recursive: true });
        await writeTextFile(sourceFile1, content);
        await copyFile(sourceFile1, destFile1);

        const copied = await readTextFile(destFile1);
        equal(copied, content);
    } finally {
        await rm(testDir, { recursive: true });
    }
});

test("fs::copyFile throws when source doesn't exist", () => {
    rejects(async () => await copyFile("nonexistent.txt", destFile1));
});

test("fs::copyFileSync copies file synchronously", async () => {
    try {
        await mkdir(testDir, { recursive: true });
        await writeTextFile(sourceFile2, content);
        copyFileSync(sourceFile2, destFile2);

        const copied = await readTextFile(destFile2);
        equal(copied, content);
    } finally {
        await rm(testDir, { recursive: true });
    }
});

test("fs::copyFileSync throws when source doesn't exist", () => {
    throws(
        () => copyFileSync("nonexistent.txt", destFile2),
        Error,
    );
});
