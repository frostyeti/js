import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { isdir, isdirSync } from "./isdir.ts";
import { join } from "@frostyeti/path";
import { mkdir } from "./mkdir.ts";
import { ensureFile } from "./ensure_file.ts";
import { rm } from "./rm.ts";

const testData = join(import.meta.dirname!, "test-data", "is_dir");

test("fs::isDir returns true for existing directory", async () => {
    await mkdir(testData, { recursive: true });
    try {
        const result = await isdir(testData);
        equal(result, true);
    } finally {
        await rm(testData, { recursive: true });
    }
});

test("fs::isDir returns false for non-existent path", async () => {
    const nonExistentPath = join(testData, "non-existent");
    const result = await isdir(nonExistentPath);
    equal(result, false);
});

test("fs::isDir returns false for file", async () => {
    await mkdir(testData, { recursive: true });
    const filePath = join(testData, "test.txt");

    try {
        await ensureFile(filePath);
        const result = await isdir(filePath);
        equal(result, false);
    } finally {
        await rm(testData, { recursive: true });
    }
});

test("fs::isDirSync returns true for existing directory", async () => {
    await mkdir(testData, { recursive: true });
    try {
        const result = isdirSync(testData);
        equal(result, true);
    } finally {
        await rm(testData, { recursive: true });
    }
});

test("fs::isDirSync returns false for non-existent path", () => {
    const nonExistentPath = join(testData, "non-existent");
    const result = isdirSync(nonExistentPath);
    equal(result, false);
});

test("fs::isDirSync returns false for file", async () => {
    await mkdir(testData, { recursive: true });
    const filePath = join(testData, "test.txt");

    try {
        await ensureFile(filePath);
        const result = isdirSync(filePath);
        equal(result, false);
    } finally {
        await rm(testData, { recursive: true });
    }
});
