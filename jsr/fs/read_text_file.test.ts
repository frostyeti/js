import { test } from "node:test";
import { equal, rejects } from "@frostyeti/assert";
import { readTextFile, readTextFileSync } from "./read_text_file.ts";
import { join } from "@frostyeti/path";
import { makeDir } from "./make_dir.ts";
import { writeTextFile } from "./write_text_file.ts";
import { remove } from "./remove.ts";

const testData = join(import.meta.dirname!, "test-data", "read_text_file");

test("fs::readTextFile reads file contents as text", async () => {
    await makeDir(testData, { recursive: true });
    const filePath = join(testData, "test1.txt");
    const content = "Hello World";

    try {
        await writeTextFile(filePath, content);
        const text = await readTextFile(filePath);
        equal(text.trim(), content);
    } finally {
        await remove(testData, { recursive: true });
    }
});

test("fs::readTextFile with signal aborts when requested", async () => {
    const controller = new AbortController();
    const filePath = join(testData, "test3.txt");
    controller.abort();

    await rejects(
        () => readTextFile(filePath, { signal: controller.signal }),
        Error,
    );
});

test("fs::readTextFileSync reads file contents as text", async () => {
    await makeDir(testData, { recursive: true });
    const filePath = join(testData, "test4.txt");
    const content = "Hello Sync";

    try {
        await writeTextFile(filePath, content);
        const text = readTextFileSync(filePath);
        equal(text.trim(), content);
    } finally {
        await remove(testData, { recursive: true });
    }
});
