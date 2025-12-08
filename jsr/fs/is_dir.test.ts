import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { isDir, isDirSync } from "./is_dir.ts";
import { join } from "@frostyeti/path";
import { makeDir } from "./make_dir.ts";
import { ensureFile } from "./ensure_file.ts";
import { remove } from "./remove.ts";

const testData = join(import.meta.dirname!, "test-data", "is_dir");

test("fs::isDir returns true for existing directory", async () => {
    await makeDir(testData, { recursive: true });
    try {
        const result = await isDir(testData);
        equal(result, true);
    } finally {
        await remove(testData, { recursive: true });
    }
});

test("fs::isDir returns false for non-existent path", async () => {
    const nonExistentPath = join(testData, "non-existent");
    const result = await isDir(nonExistentPath);
    equal(result, false);
});

test("fs::isDir returns false for file", async () => {
    await makeDir(testData, { recursive: true });
    const filePath = join(testData, "test.txt");

    try {
        await ensureFile(filePath);
        const result = await isDir(filePath);
        equal(result, false);
    } finally {
        await remove(testData, { recursive: true });
    }
});

test("fs::isDirSync returns true for existing directory", async () => {
    await makeDir(testData, { recursive: true });
    try {
        const result = isDirSync(testData);
        equal(result, true);
    } finally {
        await remove(testData, { recursive: true });
    }
});

test("fs::isDirSync returns false for non-existent path", () => {
    const nonExistentPath = join(testData, "non-existent");
    const result = isDirSync(nonExistentPath);
    equal(result, false);
});

test("fs::isDirSync returns false for file", async () => {
    await makeDir(testData, { recursive: true });
    const filePath = join(testData, "test.txt");

    try {
        await ensureFile(filePath);
        const result = isDirSync(filePath);
        equal(result, false);
    } finally {
        await remove(testData, { recursive: true });
    }
});
