import { spawn, spawnSync } from "node:child_process";
import { globals, WIN } from "./globals.ts";
import { mkdtempSync } from "./mkdtemp.ts";
import { rm } from "./rm.ts";
import { rmSync } from "@frostyeti/fs";

export type stdio = "inherit" | "pipe" | "null";

export interface ExecOptions {
    stdin?: stdio;
    stdout?: stdio;
    stderr?: stdio;
    env?: { [key: string]: string | undefined };
    cwd?: string;
}

if (WIN) {
    const path = globals.process.env["Path"] ?? "";
    if (!path.toLowerCase().includes("c:\\program files\\git\\usr\\bin")) {
        globals.process.env["Path"] = `C:\\Program Files\\Git\\usr\\bin;${path}`;
    }
}

export interface output {
    stdout: string;
    stderr: string;
    code: number;
}

export function output(command: string, args: string[], options?: ExecOptions): Promise<output> {
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

    return new Promise<output>((resolve, reject) => {
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
                } as output);
            } else {
                reject(new Error(`Command failed with exit code ${code}: ${stderr}`));
            }
        });
    });
}

export function outputSync(command: string, args: string[], options?: ExecOptions): output {
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
    } as output;
}

export function exec(command: string, args: string[], options?: ExecOptions): Promise<number> {
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

export function execSync(command: string, args: string[], options?: ExecOptions): number {
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
    #path: string;

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
