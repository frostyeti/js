import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { readlink, readlinkSync } from "./readlink.ts";
import { join } from "@frostyeti/path";
import { mkdir } from "./mkdir.ts";
import { WIN } from "./globals.ts";
import { writeTextFile } from "./write_text_file.ts";
import { rm } from "./rm.ts";
import { symlink } from "./symlink.ts";

const testData = join(import.meta.dirname!, "test-data", "read_link");
const g: Record<string, unknown> = globalThis as Record<string, unknown>;

test("fs::readLink reads target of symbolic link", async (t) => {
    if (WIN) {
        if (g.Bun) {
            equal(
                true,
                true,
                "Skipping test: Bun on Windows does not support nested tests using node:test, including the skip",
            );
            return;
        }
        t.skip("Skipping test: readLink is not supported on Windows");
        return;
    }

    await mkdir(testData, { recursive: true });
    const sourcePath = join(testData, "source2.txt");
    const linkPath = join(testData, "link2.txt");
    const content = "test content";

    try {
        await writeTextFile(sourcePath, content);
        await symlink(sourcePath, linkPath);

        const target = await readlink(linkPath);
        equal(target, sourcePath);
    } finally {
        await rm(testData, { recursive: true });
    }
});

test("fs::readLinkSync reads target of symbolic link", async () => {
    await mkdir(testData, { recursive: true });
    const sourcePath = join(testData, "source3.txt");
    const linkPath = join(testData, "link3.txt");
    const content = "test content";

    try {
        await writeTextFile(sourcePath, content);
        await symlink(sourcePath, linkPath);

        const target = readlinkSync(linkPath);
        equal(target, sourcePath);
    } finally {
        await rm(testData, { recursive: true });
    }
});
