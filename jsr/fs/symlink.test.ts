import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { symlink, symlinkSync } from "./symlink.ts";
import { join } from "@frostyeti/path";
import { writeTextFile } from "./write_text_file.ts";
import { rm } from "./rm.ts";
import { mkdir } from "./mkdir.ts";
import { readTextFile } from "./read_text_file.ts";

const testData = join(import.meta.dirname!, "test-data", "symlink");

test("fs::symlink creates a symbolic link to a file", async () => {
    await mkdir(testData, { recursive: true });

    const sourcePath = join(testData, "source1.txt");
    const linkPath = join(testData, "link1.txt");
    const content = "test content";

    try {
        await writeTextFile(sourcePath, content);
        await symlink(sourcePath, linkPath);

        const linkedContent = await readTextFile(linkPath);
        equal(linkedContent, content);
    } finally {
        await rm(testData, { recursive: true });
    }
});

test("fs::symlinkSync creates a symbolic link to a file", async () => {
    await mkdir(testData, { recursive: true });

    const sourcePath = join(testData, "source2.txt");
    const linkPath = join(testData, "link2.txt");
    const content = "test content sync";

    try {
        await writeTextFile(sourcePath, content);
        symlinkSync(sourcePath, linkPath);

        const linkedContent = await readTextFile(linkPath);
        equal(linkedContent, content);
    } finally {
        await rm(testData, { recursive: true });
    }
});
