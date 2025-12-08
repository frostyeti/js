import { test } from "node:test";
import { equal, ok, rejects, throws } from "@frostyeti/assert";
import { ext, open, openSync } from "./open.ts";
import { join } from "@frostyeti/path";
import { makeDir, makeDirSync } from "./make_dir.ts";
import { writeTextFile, writeTextFileSync } from "./write_text_file.ts";
import { remove, removeSync } from "./remove.ts";
import { readTextFile, readTextFileSync } from "./read_text_file.ts";

const testData = join(import.meta.dirname!, "test-data", "open");
const g: Record<string, unknown> = globalThis as Record<string, unknown>;

test("fs::open opens file with read access", async () => {
    await makeDir(testData, { recursive: true });
    const filePath = join(testData, "read1.txt");
    const content = "test content";

    try {
        await writeTextFile(filePath, content);
        using file = await open(filePath, { read: true });
        ok(file.supports.includes("read"));

        const buffer = new Uint8Array(100);
        const bytesRead = await file.read(buffer);
        ok(bytesRead !== null);
        const text = new TextDecoder().decode(buffer.subarray(0, bytesRead!));
        equal(text.trim(), content);
    } finally {
        await remove(filePath);
    }
});

test("fs::open opens file with write access", async () => {
    await makeDir(testData, { recursive: true });
    const filePath = join(testData, "write.txt");
    const content = "test write content";

    try {
        using file = await open(filePath, { write: true, create: true });
        ok(file.supports.includes("write"));

        const buffer = new TextEncoder().encode(content);
        const bytesWritten = await file.write(buffer);
        equal(bytesWritten, buffer.length);

        const fileContent = await readTextFile(filePath);
        equal(fileContent, content);
    } finally {
        await remove(filePath);
    }
});

test("fs::openSync opens file with read access", () => {
    makeDirSync(testData, { recursive: true });
    const filePath = join(testData, "read-sync.txt");
    const content = "test sync content";

    try {
        writeTextFileSync(filePath, content);
        using file = openSync(filePath, { read: true });
        ok(file.supports.includes("read"));

        const buffer = new Uint8Array(100);
        const bytesRead = file.readSync(buffer);
        ok(bytesRead !== null);
        const text = new TextDecoder().decode(buffer.subarray(0, bytesRead!));
        equal(text.trim(), content);
    } finally {
        removeSync(filePath);
    }
});

test("fs::openSync opens file with write access", () => {
    makeDirSync(testData, { recursive: true });
    const filePath = join(testData, "write-sync.txt");
    const content = "test sync write content";

    try {
        using file = openSync(filePath, { write: true, create: true });
        ok(file.supports.includes("write"));

        const buffer = new TextEncoder().encode(content);
        const bytesWritten = file.writeSync(buffer);
        equal(bytesWritten, buffer.length);

        const fileContent = readTextFileSync(filePath);
        equal(fileContent.trim(), content);
    } finally {
        removeSync(filePath);
    }
});

test("fs::open throws error when file doesn't exist", async () => {
    const nonExistentPath = join(testData, "non-existent.txt");
    await rejects(() => open(nonExistentPath, { read: true }));
});

test("fs::openSync throws error when file doesn't exist", () => {
    const nonExistentPath = join(testData, "non-existent.txt");
    throws(() => openSync(nonExistentPath, { read: true }));
});


test("fs::open file supports lock operations", async (t) => {

    if (g.Deno === undefined && !ext.lockSupported) {
        if (g.Bun) {
            ok(true, "Skipping test: Bun does not support lock operations or skipping tests using node:test");
            return;
        }
        t.skip("Skipping test: Lock operations are not supported in this environment");
    }


    await makeDir(testData, { recursive: true });
    const filePath = join(testData, "lock.txt");

    try {
        using file = await open(filePath, { write: true, create: true });
        ok(file.supports.includes("lock"));

        await file.lock();
        await file.unlock();
    } finally {
        await remove(filePath);
    }
});


test("fs::open file supports seek operations", async (t) => {
     if (g.Deno === undefined && !ext.seekSupported) { 
        if (g.Bun) {
            ok(true, "Skipping test: Bun does not support lock operations or skipping tests using node:test");
            return;
        }
        t.skip("Skipping test: Lock operations are not supported in this environment");
    }

    await makeDir(testData, { recursive: true });
    const filePath = join(testData, "seek.txt");
    const content = "test seek content";

    try {
        await writeTextFile(filePath, content);
        using file = await open(filePath, { read: true });
        ok(file.supports.includes("seek"));

        await file.seek(5, "start");
        const buffer = new Uint8Array(100);
        const bytesRead = await file.read(buffer);
        ok(bytesRead !== null);
        const text = new TextDecoder().decode(buffer.subarray(0, bytesRead!));
        equal(text.trim(), content.slice(5));
    } finally {
        await remove(filePath);
    }
});

test("fs::open file supports stat operations", async () => {
    await makeDir(testData, { recursive: true });
    const filePath = join(testData, "stat.txt");
    const content = "test stat content";

    try {
        await writeTextFile(filePath, content);
        using file = await open(filePath, { read: true });
        const stat = await file.stat();

        ok(stat.isFile);
        equal(stat.size, content.length);
        ok(stat.mtime instanceof Date);
        ok(stat.atime instanceof Date);
    } finally {
        await remove(filePath);
    }
});
