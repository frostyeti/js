import { dirname, join, resolve } from "@std/path";
import { exists, expandGlob, copy } from "@std/fs";
import { DntConfig, getConfig, Project } from "./config.ts";
import { npmDir, projectRootDir } from "./paths.ts";
import { blue } from "@std/fmt/colors";
import { relative } from "node:path";

export async function runTsc(projectNames?: string[]): Promise<void> {
    const config = getConfig();
    const baseVersion = config.version ?? "0.0.0";
    const baseDnt = config.packageDefaults ?? {};

    const globalProjects = config.projects ?? [];
    let projects = config.projects ?? [];
    if (projectNames && projectNames.length > 0) {
        projects = projects.filter((project) => projectNames.includes(project.name));
    } else {
        const cmd = new Deno.Command("git", {
            args: ["status", "-s"],
            stdout: "piped",
            stderr: "piped",
        });

        const o = await cmd.output();
        if (o.code !== 0) {
            console.error("Error running git ls-files");
            console.error(new TextDecoder().decode(o.stderr));
        }

        const lines = new TextDecoder().decode(o.stdout).split(/\r?\n/g)
            .map((o) => {
                const t = o.trim();
                return t.substring(t.indexOf(" ") + 1).trim();
            })
            .filter((l) => l.startsWith("jsr/") || l.startsWith("npm/"));

        console.log(lines);

        const projectDirs = Array<string>();
        for (const line of lines) {
            const split = line.split("/");
            if (split.length < 2) {
                continue;
            }

            const idx = `${split[0]}/${split[1]}`;
            if (!projectDirs.includes(idx)) {
                projectDirs.push(idx);
            }
        }

        const set: Array<Project> = [];

        // ensure the projects are in order
        for (const proj of projects) {
            if (projectDirs.includes(proj.dir)) {
                set.push(proj);
            }
        }

        projects = set;
    }

    for (const project of projects) {
        Deno.chdir(projectRootDir);
        if (project.denoConfig) {
         
            const denoConfig = JSON.parse(Deno.readTextFileSync(project.denoConfig)) as Record<
                string,
                // deno-lint-ignore no-explicit-any
                any
            >;
            let dntConfig = baseDnt as DntConfig;
            let otherFilesToCopy: Record<string, string> = dntConfig.copy ?? {};
            const rm = dntConfig.rm ?? [];

            const entryPoints = {} as Record<string, unknown>;

            if (!project.dntConfig) {
                console.debug(`No dnt config found for project ${project.name}`);
                continue;
            }

            console.log("");
            console.log(project.name);

            if (project.dntConfig) {
                const denoProjectDntConfig = JSON.parse(
                    Deno.readTextFileSync(project.dntConfig),
                ) as DntConfig;

                console.log(denoProjectDntConfig);

                if (denoProjectDntConfig.copy) {
                    otherFilesToCopy = {
                        ...otherFilesToCopy,
                        ...denoProjectDntConfig.copy,
                    };

                    delete denoProjectDntConfig.copy;
                }

                if (denoProjectDntConfig.rm) {
                    for (const r of denoProjectDntConfig.rm) {
                        if (!rm.includes(r)) {
                            rm.push(r);
                        }
                    }
                    delete denoProjectDntConfig.rm;
                }

                if (!rm.includes("test_runner.js")) {
                    rm.push("test_runner.js");
                }

                dntConfig = {
                    ...baseDnt,
                    ...denoProjectDntConfig,
                };

                if (dntConfig.dependencies) {
                    for (const [key, _] of Object.entries(dntConfig.dependencies)) {
                        if (dntConfig.dependencies[key] !== '*') {
                            continue;
                        }
                        
                        const projectDep = globalProjects.find((p) =>
                            p.name === key || p.id === key
                        );
                        if (projectDep) {
                            const v = projectDep.version ?? baseVersion;
                            dntConfig.dependencies[key] = `^${v}`;
                        }
                    }
                }

                if (!dntConfig.devDependencies) {
                    dntConfig.devDependencies = {};
                }

                if (dntConfig.devDependencies) {
                    console.log("devDependencies", dntConfig.devDependencies);
                    for (const [key, _] of Object.entries(dntConfig.devDependencies)) {
                        if (dntConfig.devDependencies[key] !== '*') {
                            continue;
                        }

                        const projectDep = globalProjects.find((p) =>
                            p.name === key || p.id === key
                        );
                        if (projectDep) {
                            const v = projectDep.version ?? baseVersion;
                            dntConfig.devDependencies[key] = `^${v}`;
                        }
                    }
                }

                if (!dntConfig.devDependencies["typescript"]) {
                    dntConfig.devDependencies["typescript"] = "^5.9.3";
                }

                if (dntConfig.peerDependencies) {
                    for (const [key, _] of Object.entries(dntConfig.peerDependencies)) {
                        if (dntConfig.peerDependencies[key] !== '*') {
                            continue;
                        }
                        
                        const projectDep = globalProjects.find((p) =>
                            p.name === key || p.id === key
                        );
                        if (projectDep) {
                            const v = projectDep.version ?? baseVersion;
                            dntConfig.peerDependencies[key] = `^${v}`;
                        }
                    }
                }

                if (dntConfig.optionalDependencies) {
                    for (const [key, _] of Object.entries(dntConfig.optionalDependencies)) {
                        if (dntConfig.optionalDependencies[key] !== '*') {
                            continue;
                        }

                        const projectDep = globalProjects.find((p) =>
                            p.name === key || p.id === key
                        );
                        if (projectDep) {
                            const v = projectDep.version ?? baseVersion;
                            dntConfig.optionalDependencies[key] = `^${v}`;
                        }
                    }
                }

            }

            for (const [key, value] of Object.entries(denoConfig.exports)) {
                    entryPoints[key as string] = {
                        import: {
                            default: `./esm/${(value as string).substring(2).replaceAll(".ts", ".js")}`,
                            types: `./types/${(value as string).substring(2).replaceAll(".ts", ".d.ts")}`,
                        }
                    }
                }
            const npmProjectDir = project.packageJson !== undefined
                ? resolve(dirname(project.packageJson))
                : (join(npmDir, project.name));

            Deno.chdir(resolve(projectRootDir, project.dir));
            console.log(Deno.cwd());

            if (!dntConfig.scripts) {
                dntConfig.scripts = {
                    "test": "node --test",
                    "test:bun": "bun test",
                    "build": "tsc",
                };
            }

            if (!dntConfig.scripts["build"]) {
                dntConfig.scripts["build"] = "tsc";
            }

            if (!dntConfig.scripts["test"]) {
                dntConfig.scripts["test"] = "node --test";
            }

            if (!dntConfig.scripts["test:bun"]) {
                dntConfig.scripts["test:bun"] = "bun test";
            }

            if (!await exists(npmProjectDir)) {
                await Deno.mkdir(npmProjectDir, { recursive: true });
            }

            if (await exists(join(npmProjectDir, "esm"))) {
                await Deno.remove(join(npmProjectDir, "esm"), { recursive: true });
            }

            if (await exists(join(npmProjectDir, "src"))) {
                await Deno.remove(join(npmProjectDir, "src"), { recursive: true });
            }

            if (await exists(join(npmProjectDir, "types"))) {
                await Deno.remove(join(npmProjectDir, "types"), { recursive: true });
            }

            const packageJson: Record<string, unknown> = {
                name: dntConfig.name ?? denoConfig.name,
                version: dntConfig.version ?? denoConfig.version ?? baseVersion,
                type: "module",

                icon: dntConfig.icon ?? undefined,
                module: "./esm/" +
                    (denoConfig.exports["."] as string).substring(2).replaceAll(".ts", ".js"),
                types: "./types/" +
                    (denoConfig.exports["."] as string).substring(2).replaceAll(".ts", ".d.ts"),

                description: dntConfig.description,
                keywords: dntConfig.keywords,
                license: dntConfig.license,
                homepage: dntConfig.homepage,
                bugs: dntConfig.bugs,
                repository: dntConfig.repository,
                scripts: dntConfig.scripts,
                exports: entryPoints,
                engines: dntConfig.engines,
                dependencies: dntConfig.dependencies,
                devDependencies: dntConfig.devDependencies,
                peerDependencies: dntConfig.peerDependencies,
                optionalDependencies: dntConfig.optionalDependencies,
                author: dntConfig.author,
                contributors: dntConfig.contributors,
                funding: dntConfig.funding,
                main: dntConfig.main,
            };

            const tsConfig: Record<string, unknown> = {
                "$schema": "https://www.schemastore.org/tsconfig",
                "_version": "22.0.0",

                "compilerOptions": {
                    "lib": ["es2024", "ESNext.Array", "ESNext.Collection", "ESNext.Iterator"],
                    "module": "nodenext",
                    "target": "es2022",

                    "strict": true,
                    "esModuleInterop": true,
                    "skipLibCheck": true,
                    "moduleResolution": "node16",
                    "outDir": "./esm",
                    "declaration": true,
                    "declarationDir": "./types",
                    "rootDir": "./src",
                },

                "include": ["src/**/*.ts"],
            };

            await Deno.writeTextFile(
                join(npmProjectDir, "package.json"),
                JSON.stringify(packageJson, null, 2),
            );
            await Deno.writeTextFile(
                join(npmProjectDir, "tsconfig.json"),
                JSON.stringify(tsConfig, null, 2),
            );

            const npmIgnore = `
yarn.lock
pnpm-lock.yaml
vite.config.ts
.artifacts/**
node_modules/**
bun.lock
bun.lockb`;

            await Deno.writeTextFile(join(npmProjectDir, ".npmignore"), npmIgnore);

            const pd = resolve(projectRootDir, project.dir);

            const readME = join(pd, "README.md");
            const license = join(pd, "LICENSE.md");
            if (await exists(readME)) {
                await Deno.copyFile(readME, join(npmProjectDir, "README.md"));
            }

            if (await exists(license)) {
                await Deno.copyFile(license, join(npmProjectDir, "LICENSE.md"));
            }

            const tsFiles = await Array.fromAsync(
                expandGlob("**/*.ts", { root: pd }),
            );

            for (const tf of tsFiles) {
                const relPath = relative(pd, tf.path);
                const destPath = join(npmProjectDir, "src", relPath);
                const destDir = dirname(destPath);
                await Deno.mkdir(destDir, { recursive: true });
                const srcPath = join(pd, relPath);
                const content = await Deno.readTextFile(srcPath);
                // convert import .ts to .js
                const converted = content.replaceAll(/(from\s+['"].+?)\.ts(['"])/g, "$1.js$2")
                    .replaceAll(/(import\(['"].+?)\.ts(['"]\))/g, "$1.js$2");
                await Deno.writeTextFile(destPath, converted);
            }



            if (otherFilesToCopy) { 
                for (const [src, dest] of Object.entries(otherFilesToCopy)) {
                    const absSrc = resolve(projectRootDir, project.dir, src);
                    const absDest = resolve(npmProjectDir, dest);
                    await copy(absSrc, absDest, { overwrite: true });
                }
            }

            const bunInstallCmd = new Deno.Command("bun", {
                args: [
                    "install",
                ],
                stdout: "inherit",
                stderr: "inherit",
                cwd: npmProjectDir,
            });

            const installOutput = await bunInstallCmd.output();
            if (installOutput.code !== 0) {
                console.error(blue(`Error running bun install for project ${project.name}`));
                Deno.exit(installOutput.code);
            }

            const tscCmd = new Deno.Command("bun", {
                args: [
                    "run",
                    "build",
                ],
                stdout: "inherit",
                stderr: "inherit",
                cwd: npmProjectDir,
            });

            const tscOutput = await tscCmd.output();
            if (tscOutput.code !== 0) {
                console.error(blue(`Error running tsc for project ${project.name}`));
                Deno.exit(tscOutput.code);
            }

            const fmtCmd = new Deno.Command("deno", {
                args: [
                    "fmt",
                ],
                stdout: "inherit",
                stderr: "inherit",
                cwd: npmProjectDir,
            });

            const fmtOutput = await fmtCmd.output();
            if (fmtOutput.code !== 0) {
                console.error(blue(`Error running deno fmt for project ${project.name}`));
                Deno.exit(fmtOutput.code);
            }

            await Deno.remove(join(npmProjectDir, "src"), { recursive: true });

            const testCmd = new Deno.Command("bun", {
                args: [
                    "run",
                    "test",
                ],
                stdout: "inherit",
                stderr: "inherit",
                cwd: npmProjectDir,
            });

            const testOutput = await testCmd.output();
            if (testOutput.code !== 0) {
                console.error(blue(`Error running bun test for project ${project.name}`));
                Deno.exit(testOutput.code);
            }

            const bunTestCmd = new Deno.Command("bun", {
                args: [
                    "run",
                    "test:bun",
                ],
                stdout: "inherit",
                stderr: "inherit",
                cwd: npmProjectDir,
            });

            const bunTestOutput = await bunTestCmd.output();
            if (bunTestOutput.code !== 0) {
                console.error(blue(`Error running bun test for project ${project.name}`));
                Deno.exit(bunTestOutput.code);
            }

            console.log(blue(`Built project ${project.name}`));
        }
    }
}
