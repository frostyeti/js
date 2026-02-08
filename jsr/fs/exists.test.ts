// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
import { test } from "node:test";
import { equal, instanceOf, stringIncludes } from "@frostyeti/assert";
import * as path from "@frostyeti/path";
import { exists, existsSync } from "./exists.ts";
import { chmod, chmodSync } from "./chmod.ts";
import { mkdtemp, mkdtempSync } from "./mkdtemp.ts";
import { writeFile, writeFileSync } from "./write_file.ts";
import { rm, rmSync } from "./rm.ts";
import { symlink, symlinkSync } from "./symlink.ts";
import { WIN } from "./globals.ts";

test("fs::exists() returns false for a non-existent path", async function () {
    const tempDirPath = await mkdtemp();
    try {
        equal(await exists(path.join(tempDirPath, "not_exists")), false);
    } finally {
        await rm(tempDirPath, { recursive: true });
    }
});

test("fs::existsSync() returns false for a non-existent path", function () {
    const tempDirPath = mkdtempSync();
    try {
        const p = path.join(tempDirPath, "not_exists");
        const v = existsSync(p);
        equal(v, false);
    } finally {
        rmSync(tempDirPath, { recursive: true });
    }
});

test("fs::exists() returns true for an existing file", async function () {
    const tempDirPath = await mkdtemp();
    const tempFilePath = path.join(tempDirPath, "0.ts");
    await writeFile(tempFilePath, new Uint8Array([0]));
    try {
        equal(await exists(tempFilePath), true);
        equal(await exists(tempFilePath, {}), true);
        equal(
            await exists(tempFilePath, {
                isDirectory: true,
            }),
            false,
        );
        equal(
            await exists(tempFilePath, {
                isFile: true,
            }),
            true,
        );
        if (!WIN) {
            // TODO(martin-braun): include mode check for Windows tests when chmod is ported to NT
            await chmod(tempFilePath, 0o000);
            equal(
                await exists(tempFilePath, {
                    isReadable: true,
                }),
                false,
            );
        }
    } finally {
        if (!WIN) {
            await chmod(tempFilePath, 0o644);
        }
        await rm(tempDirPath, { recursive: true });
    }
});

test("fs::exists() returns true for an existing file symlink", async function () {
    const tempDirPath = await mkdtemp();
    const tempFilePath = path.join(tempDirPath, "0.ts");
    const tempLinkFilePath = path.join(tempDirPath, "0-link.ts");
    await writeFile(tempFilePath, new Uint8Array());
    try {
        await symlink(tempFilePath, tempLinkFilePath);
        equal(await exists(tempLinkFilePath), true);
        equal(await exists(tempLinkFilePath, {}), true);
        equal(
            await exists(tempLinkFilePath, {
                isDirectory: true,
            }),
            false,
        );
        equal(
            await exists(tempLinkFilePath, {
                isFile: true,
            }),
            true,
        );
        if (!WIN) {
            // TODO(martin-braun): include mode check for Windows tests when chmod is ported to NT
            await chmod(tempFilePath, 0o000);
            equal(
                await exists(tempLinkFilePath, {
                    isReadable: true,
                }),
                false,
            );
            // TODO(martin-braun): test unreadable link when Rust's nix::sys::stat::fchmodat has been implemented
        }
    } finally {
        if (!WIN) {
            await chmod(tempFilePath, 0o644);
        }
        await rm(tempDirPath, { recursive: true });
    }
});

test("fs::existsSync() returns true for an existing file", function () {
    const tempDirPath = mkdtempSync();
    const tempFilePath = path.join(tempDirPath, "0.ts");
    writeFileSync(tempFilePath, new Uint8Array());
    try {
        equal(existsSync(tempFilePath), true);
        equal(existsSync(tempFilePath, {}), true);
        equal(
            existsSync(tempFilePath, {
                isDirectory: true,
            }),
            false,
        );
        equal(
            existsSync(tempFilePath, {
                isFile: true,
            }),
            true,
        );
        if (!WIN) {
            // TODO(martin-braun): include mode check for Windows tests when chmod is ported to NT
            chmodSync(tempFilePath, 0o000);
            equal(
                existsSync(tempFilePath, {
                    isReadable: true,
                }),
                false,
            );
        }
    } finally {
        if (!WIN) {
            chmodSync(tempFilePath, 0o644);
        }
        rmSync(tempDirPath, { recursive: true });
    }
});

test("fs::existsSync() returns true for an existing file symlink", function () {
    const tempDirPath = mkdtempSync();
    const tempFilePath = path.join(tempDirPath, "0.ts");
    const tempLinkFilePath = path.join(tempDirPath, "0-link.ts");
    writeFileSync(tempFilePath, new Uint8Array());
    try {
        symlinkSync(tempFilePath, tempLinkFilePath);
        equal(existsSync(tempLinkFilePath), true);
        equal(existsSync(tempLinkFilePath, {}), true);
        equal(
            existsSync(tempLinkFilePath, {
                isDirectory: true,
            }),
            false,
        );
        equal(
            existsSync(tempLinkFilePath, {
                isFile: true,
            }),
            true,
        );
        if (!WIN) {
            // TODO(martin-braun): include mode check for Windows tests when chmod is ported to NT
            chmodSync(tempFilePath, 0o000);
            equal(
                existsSync(tempLinkFilePath, {
                    isReadable: true,
                }),
                false,
            );
            // TODO(martin-braun): test unreadable link when Rust's nix::sys::stat::fchmodat has been implemented
        }
    } finally {
        if (!WIN) {
            chmodSync(tempFilePath, 0o644);
        }
        rmSync(tempDirPath, { recursive: true });
    }
});

test("fs::exists() returns true for an existing dir", async function () {
    const tempDirPath = await mkdtemp();
    try {
        equal(await exists(tempDirPath), true);
        equal(await exists(tempDirPath, {}), true);
        equal(
            await exists(tempDirPath, {
                isDirectory: true,
            }),
            true,
        );
        equal(
            await exists(tempDirPath, {
                isFile: true,
            }),
            false,
        );
        if (!WIN) {
            // TODO(martin-braun): include mode check for Windows tests when chmod is ported to NT
            await chmod(tempDirPath, 0o000);
            equal(
                await exists(tempDirPath, {
                    isReadable: true,
                }),
                false,
            );
        }
    } finally {
        if (!WIN) {
            await chmod(tempDirPath, 0o755);
        }
        await rm(tempDirPath, { recursive: true });
    }
});

test("fs::exists() returns true for an existing dir symlink", async function () {
    const tempDirPath = await mkdtemp();
    const tempLinkDirPath = path.join(tempDirPath, "temp-link");
    try {
        await symlink(tempDirPath, tempLinkDirPath);
        equal(await exists(tempLinkDirPath), true);
        equal(await exists(tempLinkDirPath, {}), true);
        equal(
            await exists(tempLinkDirPath, {
                isDirectory: true,
            }),
            true,
        );
        equal(
            await exists(tempLinkDirPath, {
                isFile: true,
            }),
            false,
        );
        if (!WIN) {
            // TODO(martin-braun): include mode check for Windows tests when chmod is ported to NT
            await chmod(tempDirPath, 0o000);
            equal(
                await exists(tempLinkDirPath, {
                    isReadable: true,
                }),
                false,
            );
            // TODO(martin-braun): test unreadable link when Rust's nix::sys::stat::fchmodat has been implemented
        }
    } finally {
        if (!WIN) {
            await chmod(tempDirPath, 0o755);
        }
        await rm(tempDirPath, { recursive: true });
    }
});

test("fs::existsSync() returns true for an existing dir", function () {
    const tempDirPath = mkdtempSync();
    try {
        equal(existsSync(tempDirPath), true);
        equal(existsSync(tempDirPath, {}), true);
        equal(
            existsSync(tempDirPath, {
                isDirectory: true,
            }),
            true,
        );
        equal(
            existsSync(tempDirPath, {
                isFile: true,
            }),
            false,
        );
        if (!WIN) {
            // TODO(martin-braun): include mode check for Windows tests when chmod is ported to NT
            chmodSync(tempDirPath, 0o000);
            equal(
                existsSync(tempDirPath, {
                    isReadable: true,
                }),
                false,
            );
        }
    } finally {
        if (!WIN) {
            chmodSync(tempDirPath, 0o755);
        }
        rmSync(tempDirPath, { recursive: true });
    }
});

test("fs::existsSync() returns true for an existing dir symlink", function () {
    const tempDirPath = mkdtempSync();
    const tempLinkDirPath = path.join(tempDirPath, "temp-link");
    try {
        symlinkSync(tempDirPath, tempLinkDirPath);
        equal(existsSync(tempLinkDirPath), true);
        equal(existsSync(tempLinkDirPath, {}), true);
        equal(
            existsSync(tempLinkDirPath, {
                isDirectory: true,
            }),
            true,
        );
        equal(
            existsSync(tempLinkDirPath, {
                isFile: true,
            }),
            false,
        );
        if (!WIN) {
            // TODO(martin-braun): include mode check for Windows tests when chmod is ported to NT
            chmodSync(tempDirPath, 0o000);
            equal(
                existsSync(tempLinkDirPath, {
                    isReadable: true,
                }),
                false,
            );
            // TODO(martin-braun): test unreadable link when Rust's nix::sys::stat::fchmodat has been implemented
        }
    } finally {
        if (!WIN) {
            chmodSync(tempDirPath, 0o755);
        }
        rmSync(tempDirPath, { recursive: true });
    }
});

test("fs::exists() returns false when both isDirectory and isFile sets true", async function () {
    const tempDirPath = await mkdtemp();
    try {
        equal(
            await exists(tempDirPath, {
                isDirectory: true,
                isFile: true,
            }),
            true,
        );
    } catch (error) {
        instanceOf(error, TypeError);
        stringIncludes(
            error.message,
            "ExistsOptions.options.isDirectory and ExistsOptions.options.isFile must not be true together.",
        );
    } finally {
        await rm(tempDirPath, { recursive: true });
    }
});

test("fs::existsSync() returns false when both isDirectory and isFile sets true", async function () {
    const tempDirPath = await mkdtemp();
    try {
        equal(
            await existsSync(tempDirPath, {
                isDirectory: true,
                isFile: true,
            }),
            true,
        );
    } catch (error) {
        instanceOf(error, TypeError);
        stringIncludes(
            error.message,
            "ExistsOptions.options.isDirectory and ExistsOptions.options.isFile must not be true together.",
        );
    } finally {
        await rm(tempDirPath, { recursive: true });
    }
});
