// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import { equal, rejects, throws } from "@frostyeti/assert";
import { chown, chownSync } from "./chown.js";
import { NotFound } from "./unstable_errors.js";
import { platform, tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { mkdtemp, open, rm } from "node:fs/promises";
import { closeSync, mkdtempSync, openSync, rmSync } from "node:fs";
import { spawn } from "node:child_process";
import { globals } from "./globals.js";
const isBun = typeof globals.Bun !== "undefined";
function runId(option) {
  return new Promise((resolve, reject) => {
    let id;
    if (option === "user") {
      id = spawn("id", ["-u"]);
    } else if (option === "group") {
      id = spawn("id", ["-g"]);
    } else {
      return reject(new Error("Invalid option."));
    }
    id.stderr.on("error", (err) => {
      return reject(err);
    });
    let data = "";
    const result = {};
    id.stdout.on("data", (chunk) => {
      data += chunk;
    });
    id.stdout.on("end", () => {
      result.id = data;
    });
    id.on("close", (code) => {
      result.code = code;
      resolve(result);
    });
  });
}
async function getUidAndGid() {
  const uidProc = await runId("user");
  const gidProc = await runId("group");
  equal(uidProc.code, 0);
  equal(gidProc.code, 0);
  return {
    uid: parseInt(uidProc.id),
    gid: parseInt(gidProc.id),
  };
}
test(
  "chown() changes user and group ids",
  { skip: platform() === "win32" },
  async () => {
    const { uid, gid } = await getUidAndGid();
    const tempDirPath = await mkdtemp(resolve(tmpdir(), "chown_"));
    const testFile = join(tempDirPath, "chown_file.txt");
    const tempFh = await open(testFile, "w");
    // `chown` needs elevated privileges to change to different UIDs and GIDs.
    // Instead, pass the same IDs back to invoke `chown` and avoid erroring.
    await chown(testFile, uid, gid);
    await tempFh.close();
    await rm(tempDirPath, { recursive: true, force: true });
  },
);
test("chown() handles `null` id arguments", {
  skip: platform() === "win32" || isBun,
}, async () => {
  if (isBun) {
    console.warn(
      "Skipping test in Bun: Bun's fs.chown does not support null arguments.",
    );
    return;
  }
  const { uid, gid } = await getUidAndGid();
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "chown_"));
  const testFile = join(tempDirPath, "chown_file.txt");
  const tempFh = await open(testFile, "w");
  await chown(testFile, uid, null);
  await chown(testFile, null, gid);
  await tempFh.close();
  await rm(tempDirPath, { recursive: true, force: true });
});
test("chown() rejects with NotFound for a non-existent file", {
  skip: platform() === "win32",
}, async () => {
  await rejects(async () => {
    await chown("non-existent-file.txt", null, null);
  }, NotFound);
});
test("chown() rejects with Error when called without elevated privileges", {
  skip: platform() === "win32",
}, async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "chown_"));
  const testFile = join(tempDirPath, "chown_file.txt");
  const tempFh = await open(testFile, "w");
  await rejects(async () => {
    await chown(testFile, 0, 0);
  }, Error);
  await tempFh.close();
  await rm(tempDirPath, { recursive: true, force: true });
});
test(
  "chownSync() changes user and group ids",
  { skip: platform() === "win32" },
  async () => {
    const { uid, gid } = await getUidAndGid();
    const tempDirPath = mkdtempSync(resolve(tmpdir(), "chownSync_"));
    const testFile = join(tempDirPath, "chown_file.txt");
    const tempFd = openSync(testFile, "w");
    // `chownSync` needs elevated privileges to change to different UIDs and
    // GIDs. Instead, pass the same IDs back to invoke `chownSync` and avoid
    // erroring.
    chownSync(testFile, uid, gid);
    closeSync(tempFd);
    rmSync(tempDirPath, { recursive: true, force: true });
  },
);
test("chownSync() handles `null` id arguments", {
  skip: platform() === "win32" || isBun,
}, async () => {
  if (isBun) {
    console.warn(
      "Skipping test in Bun: Bun's fs.chown does not support null arguments.",
    );
    return;
  }
  const { uid, gid } = await getUidAndGid();
  const tempDirPath = mkdtempSync(resolve(tmpdir(), "chownSync_"));
  const testFile = join(tempDirPath, "chown_file.txt");
  const tempFd = openSync(testFile, "w");
  chownSync(testFile, uid, null);
  chownSync(testFile, null, gid);
  closeSync(tempFd);
  rmSync(tempDirPath, { recursive: true, force: true });
});
test("chownSync() throws with NotFound for a non-existent file", {
  skip: platform() === "win32",
}, () => {
  throws(() => {
    chownSync("non-existent-file.txt", null, null);
  }, NotFound);
});
test("chownSync() throws with Error when called without elevated privileges", {
  skip: platform() === "win32",
}, () => {
  const tempDirPath = mkdtempSync(resolve(tmpdir(), "chownSync_"));
  const testFile = join(tempDirPath, "chown_file.txt");
  const tempFd = openSync(testFile, "w");
  throws(() => {
    chownSync(testFile, 0, 0);
  }, Error);
  closeSync(tempFd);
  rmSync(tempDirPath, { recursive: true, force: true });
});
