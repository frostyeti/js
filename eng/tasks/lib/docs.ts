import { join } from "@std/path";
import { exists} from "@std/fs";
import { getConfig } from "./config.ts";
import { projectRootDir } from "./paths.ts";

export async function updateModDocumentation(targets : string | string[]) {
    

    if (typeof targets === "string") {
        targets = [targets];
    }

    targets = targets.filter(t => t.length > 0 && !t.includes(":"));

    const projects = getConfig().projects

    for (const target of targets) {
        const project = projects.find(p => p.name === target || p.id === target);
        if (!project) {
            console.warn(`Project ${target} not found in config`);
            continue;
        }

        const projectDir = join(projectRootDir, project.dir);
        const modPath = join(projectDir, "mod.ts");
        const readMe = join(projectDir, "README.md");
    
        if (!await exists(modPath)) {
            console.warn(`Module file not found for project ${target} at ${modPath}`);
            continue;
        }

        if (!await exists(readMe)) {
            console.warn(`README file not found for project ${target} at ${readMe}`);
            continue;
        }

            let readmeContent = await Deno.readTextFile(readMe);
            const modContent = await Deno.readTextFile(modPath);

            const overviewIndex = readmeContent.indexOf("## Overview");
            const modCommentEndIndex = modContent.indexOf("*/");

            /*
             * If the readme contains *\/ we need to escape it
             */
            if (readmeContent.match(/\*\//gm)) {
                console.log("Found */ in readme");
                readmeContent = readmeContent.replaceAll(/\*\//gm, "*\\/");
                console.log(readmeContent);
            }

            if (readmeContent.indexOf("## Overview") > -1) {
                if (modCommentEndIndex > -1) {
                    const modContentWithoutComment = modContent.slice(modCommentEndIndex + 2);
                    const newModContent = `/**
 * ${readmeContent.slice(overviewIndex).replaceAll("\n", "\n * ")}
 * @module
 */`;

                    await Deno.writeTextFile(modPath, newModContent + modContentWithoutComment);
                } else {
                    const newModContent = `/**
 * ${readmeContent.slice(overviewIndex).replaceAll("\n", "\n * ")}
 * @module
 */
${modContent}`;
                    await Deno.writeTextFile(modPath, newModContent);
                }
            }

           // Update the documentation for each target
    }
}