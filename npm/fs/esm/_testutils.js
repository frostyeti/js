import { spawn, spawnSync } from "node:child_process";
import { globals, WIN } from "./globals.js";
import { mkdtempSync } from "./mkdtemp.js";
import { rm } from "./rm.js";
import { rmSync } from "@frostyeti/fs";
if (WIN) {
  const path = globals.process.env["Path"] ?? "";
  if (!path.toLowerCase().includes("c:\\program files\\git\\usr\\bin")) {
    globals.process.env["Path"] = `C:\\Program Files\\Git\\usr\\bin;${path}`;
  }
}
export function output(command, args, options) {
  options ??= {
    stdin: "pipe",
    stdout: "pipe",
    stderr: "pipe",
  };
  let stdout = "";
  let stderr = "";
  if (WIN && !command.includes(".")) {
    command = `${command}.exe`;
  }
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "pipe",
      ...options,
    });
    child.stdout?.on("data", (data) => {
      stdout += data.toString();
    });
    child.stderr?.on("data", (data) => {
      stderr += data.toString();
    });
    child.on("error", (err) => {
      reject(err);
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve({
          stdout,
          stderr,
          code,
        });
      } else {
        reject(new Error(`Command failed with exit code ${code}: ${stderr}`));
      }
    });
  });
}
export function outputSync(command, args, options) {
  options ??= {
    stdin: "pipe",
    stdout: "pipe",
    stderr: "pipe",
  };
  let stdout = "";
  let stderr = "";
  if (WIN && !command.includes(".")) {
    command = `${command}.exe`;
  }
  const child = spawnSync(command, args, {
    stdio: "pipe",
    ...options,
  });
  if (child.error) {
    throw child.error;
  }
  if (child.status !== 0) {
    throw new Error(`Command failed with exit code ${child.status}: ${stderr}`);
  }
  stdout = child.stdout?.toString() ?? "";
  stderr = child.stderr?.toString() ?? "";
  return {
    stdout,
    stderr,
    code: child.status ?? 0,
  };
}
export function exec(command, args, options) {
  options ??= {
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  };
  if (WIN && !command.includes(".")) {
    command = `${command}.exe`;
  }
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      ...options,
    });
    child.on("error", (error) => {
      reject(error);
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}
export function execSync(command, args, options) {
  options ??= {
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  };
  const code = spawnSync(command, args, {
    stdio: "inherit",
    ...options,
  }).status ?? 0;
  if (code !== 0) {
    throw new Error(`Command failed with exit code ${code}`);
  }
  return code;
}
export class DisposableTempDir {
  #path;
  constructor() {
    this.#path = mkdtempSync();
  }
  get path() {
    return this.#path;
  }
  [Symbol.dispose]() {
    try {
      rmSync(this.path, { recursive: true });
    } catch (e) {
      console.error(`Failed to remove temp dir at ${this.path}:`, e);
    }
  }
  async [Symbol.asyncDispose]() {
    try {
      await rm(this.path, { recursive: true });
    } catch (e) {
      console.error(`Failed to remove temp dir at ${this.path}:`, e);
    }
  }
}
