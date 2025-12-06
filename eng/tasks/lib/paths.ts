import { join, dirname, fromFileUrl } from '@std/path'
import { resolve } from 'node:path';

const dir = import.meta.dirname ?? (dirname(fromFileUrl(import.meta.url)));
export const projectRootDir = resolve(dir, '..', '..', "..");
export const tasksDir = join(projectRootDir, "eng", "tasks"); 
export const jsrDir = join(projectRootDir, 'jsr');
export const npmDir = join(projectRootDir, 'npm');
export const rexDir = join(projectRootDir, 'eng');
export const buildConfigPath = join(rexDir, 'config.json');
export const gitDir = join(projectRootDir, '.git');
