import { buildConfigPath } from "./paths.ts";
import { type EntryPoint } from "@deno/dnt";
import { existsSync } from "@std/fs";

export interface Project extends Record<string, unknown> {
    name: string;
    id?: string;
    version?: string;
    dir: string;
    denoConfig?: string;
    dntConfig?: string;
    packageJson?: string;
    nodeOnly?: boolean
}

export interface Contributor extends Record<string, unknown> {
    name: string;
    email?: string;
    url?: string;
}

export interface Funding extends Record<string, unknown> {
    type: string;
    url: string;
}

export type OverridePair = Record<string, string>;
export type Override = Record<string, string | OverridePair>;
export type OverrideValue = string | OverridePair | Override;

export interface DntConfig extends Record<string, unknown> {
    name?: string;
    version?: string;
    description?: string;
    keywords?: string[];
    license?: string;
    homepage?: string;
    bugs?: string | { url: string; email: string };
    repository?: string | { type: string; url: string; directory?: string };
    author: string | Contributor;
    contributors?: Array<string | Contributor>;
    funding?: Array<string | Funding>;
    main?: string;
    bin?: string | Record<string, string>;
    directories?: {
        bin?: string;
        man?: string;
    },
    entryPoints?: Array<EntryPoint>;
    scripts?: Record<string, string>;
    files?: string[];
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
    bundledDependencies?: string[];
    overrides?: OverrideValue
    engines?: Record<string, string>;
    os?: string[];
    cpu?: string[];

    copy?: Record<string, string>;
    rm?: string[];
}

export interface Config extends Record<string, unknown> {
    version?: string;
    projects: Project[];
    packageDefaults?: DntConfig
    exclude?: string[];
    jsrToNpm?: Record<string, string>;
}

export function getConfig(): Config {
    if (!existsSync(buildConfigPath)) {
        return { projects: [] };
    }


    const config = JSON.parse(Deno.readTextFileSync(buildConfigPath)) as Config;
    return config;
}

export function setConfig(config: Config) {
    Deno.writeTextFileSync(buildConfigPath, JSON.stringify(config, null, 2));
}