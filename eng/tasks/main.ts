import { filter, listProjects, syncProjects } from "./lib/projects.ts";
import { runDnt } from "./lib/dnt.ts";
import { jsrDir, npmDir, projectRootDir } from "./lib/paths.ts";
import { parseArgs } from "@std/cli";
import { getConfig, Project } from "./lib/config.ts";
import { basename, dirname, join } from "@std/path";
import { expandGlob } from "@std/fs";
import { blue } from "@std/fmt/colors";
import { updateModDocumentation } from "./lib/docs.ts";
import { updateVersions } from "./lib/versions.ts";

const args = Deno.args;
if (args.length === 0) {
    console.error("No task specified. Usage: deno run -A eng/tasks/tasks.ts <task> [args...]");
    Deno.exit(1);
}

const task = args[0];
const taskArgs = args.slice(1);

switch (task) {
    case "projects": {
        const sub = taskArgs.shift();
        switch (sub) {
            case "sync":
                {
                    await syncProjects();
                }
                break;

            case "list":
                {
                    listProjects();
                }
                break;

            case "projects:update": {
                const parsed = parseArgs(taskArgs ?? [], {
                    boolean: ["all"],
                });

                const projects = getConfig().projects;
                let projectNames: Array<string> | undefined = undefined;

                if (parsed.all || (taskArgs && (taskArgs.includes("--all")))) {
                    projectNames = projects.map((p) => p.name);
                } else {
                    projectNames = [];
                    for (const arg of taskArgs!) {
                        const project = projects.find((p) => p.name === arg);
                        if (project) {
                            projectNames.push(project.name);
                        }
                    }
                }

                console.log("");
                console.log("### UPDATE MOD DOCS ###");
                await updateModDocumentation(projectNames);

                console.log("");
                console.log("### DENO NPM TRANSPILER ###");
                await runDnt(projectNames);

                let deno = true;
                let node = true;
                if (taskArgs && taskArgs.includes("--jsr") || taskArgs?.includes("--deno")) {
                    node = false;
                }

                if (taskArgs && taskArgs.includes("--node")) {
                    deno = false;
                }

                console.log("deno", deno, "node", node);

                if (deno) {
                    console.log("");
                    console.log(blue("### FMT JSR ###"));
                    for (const project of projectNames) {
                        const cmd = new Deno.Command("deno", {
                            args: ["fmt"],
                            stdout: "inherit",
                            stderr: "inherit",
                            cwd: join(jsrDir, project),
                        });
                        const o = await cmd.output();
                        if (o.code !== 0) {
                            throw new Error("Failed to format the jsr code");
                        }
                    }
                }

                if (node) {
                    console.log("");
                    console.log(blue("### FMT NPM ###"));

                    for (const project of projectNames) {
                        const cmd = new Deno.Command("deno", {
                            args: [
                                "fmt",
                                ".",
                                "--line-width",
                                "100",
                                "indent-width",
                                "4",
                                "--ignore=node_modules,**/*.md",
                            ],
                            stdout: "inherit",
                            stderr: "inherit",
                            cwd: join(npmDir, project),
                        });

                        const o = await cmd.output();
                        if (o.code !== 0) {
                            throw new Error("Failed to format the npm code");
                        }
                    }
                }
            }
        }

        break;
    }

    case "docs":
        {
            const sub = taskArgs.shift();
            switch (sub) {
                case "update":
                    {
                        let targets: string | string[] = taskArgs ?? [];
                        if (taskArgs && taskArgs.includes("--all") || taskArgs?.includes("-a")) {
                            const projects = getConfig().projects.map((p) => p.name);
                            targets = projects;
                        }

                        await updateModDocumentation(targets);
                    }
                    break;
            }
        }
        break;

    case "dnt":
        {
            const parsed = parseArgs(taskArgs ?? [], {
                boolean: ["all"],
            });

            const projects = getConfig().projects;
            let projectNames: Array<string> | undefined = undefined;

            if (parsed.all || (taskArgs && (taskArgs.includes("--all")))) {
                projectNames = projects.map((p) => p.name);
            } else {
                projectNames = [];
                for (const arg of taskArgs!) {
                    const project = projects.find((p) => p.name === arg);
                    if (project) {
                        projectNames.push(project.name);
                    }
                }
            }

            console.log(projects);
            console.log(projectNames);

            await runDnt(projectNames);
        }

        break;

    case "fmt":
        {
            let deno = true;
            let node = true;
            if (taskArgs && taskArgs.includes("--jsr") || taskArgs?.includes("--deno")) {
                node = false;
            }

            if (taskArgs && taskArgs.includes("--node")) {
                deno = false;
            }

            console.log("deno", deno, "node", node);

            if (deno) {
                console.log("");
                console.log(blue("### FMT JSR ###"));
                const cmd = new Deno.Command("deno", {
                    args: ["fmt"],
                    stdout: "inherit",
                    stderr: "inherit",
                    cwd: jsrDir,
                });
                const o = await cmd.output();
                if (o.code !== 0) {
                    throw new Error("Failed to format the jsr code");
                }
            }

            if (node) {
                console.log("");
                console.log(blue("### FMT NPM ###"));

                const cmd = new Deno.Command("deno", {
                    args: [
                        "fmt",
                        ".",
                        "--line-width",
                        "100",
                        "indent-width",
                        "4",
                        "--ignore=node_modules,**/*.md",
                    ],
                    stdout: "inherit",
                    stderr: "inherit",
                    cwd: npmDir,
                });

                const o = await cmd.output();
                if (o.code !== 0) {
                    throw new Error("Failed to format the npm code");
                }
            }
        }
        break;

    case "lint":
        {
            let deno = true;
            let node = true;
            if (taskArgs && taskArgs.includes("--jsr") || taskArgs?.includes("--deno")) {
                node = false;
            }

            if (taskArgs && taskArgs.includes("--node")) {
                deno = false;
            }

            console.log("deno", deno, "node", node);

            if (deno) {
                const cmd = new Deno.Command("deno", {
                    args: ["lint"],
                    stdout: "inherit",
                    stderr: "inherit",
                    cwd: jsrDir,
                });
                const o = await cmd.output();
                if (o.code !== 0) {
                    throw new Error("Failed to lint the jsr code");
                }
            }
        }
        break;

    case "jsr":
        {
            const sub = taskArgs.shift();
            switch (sub) {
                case "publish":
                    {
                        const dry = taskArgs.includes("--dry") || taskArgs.includes("--dry-run") || taskArgs.includes("-d");
                        const isWindows = Deno.build.os === "windows";
                        const deno = isWindows ? "deno.exe" : "deno";

                        const publishArgs = ["publish"];
                        if (dry) {
                            publishArgs.push("--dry-run", "--allow-dirty");
                        }

                        const cmd = new Deno.Command(deno, {
                            args: publishArgs,
                            stdout: "inherit",
                            stderr: "inherit",
                            cwd: jsrDir,
                        });
                        const o = await cmd.output();
                        if (o.code !== 0) {
                            throw new Error(`Failed to publish to jsr.io`);
                        }
                    }
                    break;
                default:
                    console.error(`Unknown jsr subtask: ${sub}`);
                    Deno.exit(1);
                    break;
            }
        }
        break;

    case "npm":
        {
            const sub = taskArgs.shift();
            switch (sub) {
                case "publish":
                    {
                        const isWindows = Deno.build.os === "windows";
                        const npm = isWindows ? "npm.cmd" : "npm";
                        const publishArgs = ["publish"];
                        if (taskArgs.includes("--dry") || taskArgs.includes("--dry-run") || taskArgs.includes("-d")) {
                            publishArgs.push("--dry-run");
                        } else {
                            publishArgs.push("--provenance", "--access", "public");
                        }

                        const config = getConfig();
                        for (const project of config.projects) {
                            if (project.packageJson) {

                                const id = project.id;

                                const cmd0 = new Deno.Command("npm", {
                                    args: ["view", id!, "version"],
                                    stdout: "piped",
                                    stderr: "inherit",
                                });
                                const o0 = await cmd0.output();
                                if (o0.code === 0) {
                                    const version = new TextDecoder().decode(o0.stdout).trim();
                                    const pkgJsonText = await Deno.readTextFile(join(projectRootDir, project.packageJson));
                                    const pkgJson = JSON.parse(pkgJsonText);
                                    if (pkgJson.version === version) {
                                        console.log("");
                                        console.log(blue(`### SKIPPING ${project.name.toUpperCase()} - VERSION ${version} ALREADY PUBLISHED ###`));
                                        continue;
                                    }
                                }

                                const baseDir = dirname(project.packageJson);
                                const dir = join(projectRootDir, baseDir);
                                console.log("");
                                console.log(blue(`### PUBLISHING ${project.name.toUpperCase()} ###`));
                                const cmd = new Deno.Command(npm, {
                                    args: publishArgs,
                                    stdout: "inherit",
                                    stderr: "inherit",
                                    cwd: dir,
                                });
                                const o = await cmd.output();
                                if (o.code !== 0) {
                                    throw new Error(`Failed to publish ${project.name} to npm`);
                                }
                            }
                        }
                    }
                    break;

                case "audit":
                    {
                        const isWindows = Deno.build.os === "windows";
                        const npm = isWindows ? "npm.cmd" : "npm";

                        // create npm package lock file
                        {
                            const cmd = new Deno.Command(npm, {
                                args: ["install", "--package-lock-only", "--no-audit"],
                                stdout: "inherit",
                                stderr: "inherit",
                                cwd: npmDir,
                            });
                            const o = await cmd.output();
                            if (o.code !== 0) {
                                throw new Error(`Failed to create npm package lock file`);
                            }
                        }

                        const cmd = new Deno.Command(npm, {
                            args: ["audit"],
                            stdout: "inherit",
                            stderr: "inherit",
                            cwd: npmDir,
                        });
                        const o = await cmd.output();
                        if (o.code !== 0) {
                            throw new Error(`Failed to run npm audit`);
                        }
                    }
                    break;
                default:
                    console.error(`Unknown npm subtask: ${sub}`);
                    Deno.exit(1);
                    break;
            }
        }
        break;

    case "test":
        {
            let deno = true;
            let node = true;
            let bun = true;
            let args: string[] = taskArgs ?? [];
            const config = getConfig();
            const parsed = parseArgs(args, {
                boolean: ["deno", "jsr", "node", "all"],
                collect: ["project", "glob"],
                string: ["project", "glob"],
                alias: {
                    p: "project",
                    g: "glob",
                },
            });

            console.log("Parsed arguments:", parsed);

            args = parsed._ as string[];

            if (args.includes("--jsr") || args.includes("--deno")) {
                args = args.filter((a) => a !== "--jsr" && a !== "--deno");
                node = false;
                bun = false;
            }

            if (taskArgs && taskArgs.includes("--node")) {
                args = args.filter((a) => a !== "--node");
                deno = false;
                bun = false;
            }

            const globs = parsed.glob ?? [];
            const denoGlobs: string[] = [];
            const nodeGlobs: string[] = [];
            const projectsNames = parsed.project ?? [];

            for (const arg of parsed.project ?? []) {
                denoGlobs.push(`${arg}/**/*.test.ts`);
                nodeGlobs.push(`${arg}/**/*.test.js`);
            }

            for (const arg of globs) {
                denoGlobs.push(arg);
                nodeGlobs.push(arg);
            }

            let projects: Array<Project> = getConfig().projects ?? [];
            if (projectsNames.length > 0) {
                projects = await filter(config.projects, projectsNames, false);
            }

            if (projects.length === 0) {
                projects = config.projects;
            }

            if (deno) {
                console.log("### DENO TESTS ###");

                if (denoGlobs.length === 0) {
                    for (const project of projects) {
                        if (project.denoConfig) {
                            const dir = dirname(project.denoConfig);
                            const base = basename(dir);
                            denoGlobs.push(`${base}/**/*.test.ts`);
                        }
                    }
                }

                console.log("denoGlobs", denoGlobs);

                const cmd = new Deno.Command("deno", {
                    args: ["test", "-A", ...denoGlobs],
                    stdout: "inherit",
                    stderr: "inherit",
                    cwd: jsrDir,
                });
                const o = await cmd.output();
                if (o.code !== 0) {
                    throw new Error("Failed to run the tests");
                }
            }

            if (node) {
                console.log("");
                console.log("### NODE TESTS ###");
                globs.length = 0;
                if (nodeGlobs.length === 0) {
                    for (const project of projects) {
                        if (project.packageJson) {
                            const dir = join(projectRootDir, dirname(project.packageJson));
                            globs.push(`${dir}/**/*.test.js`);
                        }
                    }
                }

                console.log("nodeGlobs", nodeGlobs);

                const cmd = new Deno.Command("node", {
                    args: ["--test", ...nodeGlobs],
                    stdout: "inherit",
                    stderr: "inherit",
                    cwd: npmDir,
                });
                const o = await cmd.output();
                if (o.code !== 0) {
                    throw new Error("Failed to run the tests");
                }
            }

            if (bun) {
                console.log("");
                console.log("");
                console.log("### BUN TESTS ###");
                console.log("nodeGlobs", nodeGlobs);
                if (nodeGlobs.length === 0) {
                    for (const project of projects) {
                        if (project.packageJson) {
                            const dir = join(projectRootDir, dirname(project.packageJson));
                            nodeGlobs.push(`${dir}/**/*.test.js`);
                        }
                    }
                }

                let failed = false;
                const promises: Array<Promise<void>> = [];

                if (Deno.build.os === "windows") {
                    for (const glob of nodeGlobs) {
                        for await (
                            const fi of expandGlob(glob, { includeDirs: false, root: npmDir })
                        ) {
                            const cmd = new Deno.Command("bun", {
                                args: ["test", fi.path],
                                stdout: "inherit",
                                stderr: "inherit",
                                cwd: npmDir,
                            });

                            // bun crashes on windows if too many commands are run at once
                            const o = await cmd.output();
                            if (o.code !== 0) {
                                console.error("Bun test failed for", fi.path);
                                failed = true;
                            }
                        }
                    }
                } else {
                    for (const glob of nodeGlobs) {
                        for await (
                            const fi of expandGlob(glob, { includeDirs: false, root: npmDir })
                        ) {
                            const cmd = new Deno.Command("bun", {
                                args: ["test", fi.path],
                                stdout: "inherit",
                                stderr: "inherit",
                                cwd: npmDir,
                            });
                            promises.push(
                                cmd.output().then((o) => {
                                    if (o.code !== 0) {
                                        console.error("Bun test failed for", fi.path);
                                        failed = true;
                                    }
                                }),
                            );
                        }

                        if (promises.length === 30) {
                            await Promise.all(promises);
                            promises.length = 0;
                        }
                    }

                    if (promises.length === 30) {
                        await Promise.all(promises);
                        promises.length = 0;
                    }
                }

                if (failed) {
                    console.error("Bun tests failed");
                    Deno.exit(1);
                }
            }
        }

        break;

    case "versions":
        {
            const sub = taskArgs.shift();
            switch (sub) {
                case "update": {
                    let targets: string | string[] = taskArgs ?? [];
                    if (taskArgs && taskArgs.includes("--all") || taskArgs?.includes("-a")) {
                        const projects = getConfig().projects.map((p) => p.name);
                        targets = projects;
                    }

                    await updateVersions(targets);
                }
            }
        }
        break;

    default:
        console.error(`Unknown task: ${task}`);
        Deno.exit(1);
        break;
}
