import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { rename, renameSync } from "./rename.ts";
import { join } from "@frostyeti/path";
import { mkdir } from "./mkdir.ts";
import { writeTextFile } from "./write_text_file.ts";
import { rm } from "./rm.ts";
import { readTextFile } from "./read_text_file.ts";

const testData = join(import.meta.dirname!, "test-data", "rename-test");

test("fs::rename renames a file", async () => {
    await mkdir(testData, { recursive: true });
    const oldPath = join(testData, "old.txt");
    const newPath = join(testData, "new.txt");
    const content = "test content";

    try {
        await writeTextFile(oldPath, content);
        await rename(oldPath, newPath);

        const renamedContent = await readTextFile(newPath);
        equal(renamedContent, content);
    } finally {
        await rm(testData, { recursive: true });
    }
});

test("fs::renameSync renames a file", async () => {
    await mkdir(testData, { recursive: true });
    const oldPath = join(testData, "old-sync.txt");
    const newPath = join(testData, "new-sync.txt");
    const content = "test content sync";

    try {
        await writeTextFile(oldPath, content);
        renameSync(oldPath, newPath);

        const renamedContent = await readTextFile(newPath);
        equal(renamedContent, content);
    } finally {
        await rm(testData, { recursive: true });
    }
});
