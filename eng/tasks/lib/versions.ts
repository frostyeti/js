import { getConfig } from "./config.ts";
import { join } from "@std/path";
import { projectRootDir } from "./paths.ts";
import { exists } from "@std/fs";

export async function updateVersions(targets : string | string[]) {
    if (typeof targets === "string") {
        targets = [targets];
    }

    const projects = getConfig().projects;
    const version = getConfig().version;

    targets = targets.filter(t => t.length > 0 && !t.includes(":"));

    for (const target of targets) {
        const project = projects.find(p => p.name === target || p.id === target);
        if (!project) {
            console.warn(`Project ${target} not found in config`);
            continue;
        }

        const projectDir = join(projectRootDir, project.dir);
        const denoConfig = join(projectDir, "deno.json");

        if (!await exists(denoConfig)) {
            console.warn(`Deno config file not found for project ${target} at ${denoConfig}`);
            continue;
        }

        const cfg = JSON.parse(await Deno.readTextFile(denoConfig));
        if (cfg.version && cfg.version !== version) {
            cfg.version = version;
            await Deno.writeTextFile(denoConfig, JSON.stringify(cfg, null, 2));
            console.log(`Updated version for project ${target} to ${version}`);
        } else {
            console.log(`Project ${target} already has version ${version}`);
        }
    }
}