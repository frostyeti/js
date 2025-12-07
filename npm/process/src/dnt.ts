// terrible hack to get all the internals to be included in the bundle
// when using dnt to transform ts to npm/js.
import { resolve } from "jsr:@std/path@1";
const dir = import.meta.dirname;
const dest = resolve(`${dir}/../../npm/process/esm`);

console.log(`copying ${dir}/internal/*.ts to ${dest}/internal/*.js`);

await Deno.mkdir(`${dest}/internal`, { recursive: true });
console.log(`copying ${dir}/internal/args.ts to ${dest}/internal/args.js`);
await Deno.copyFile(`${dir}/internal/args.ts`, `${dest}/internal/args.js`);
await Deno.copyFile(`${dir}/internal/exit_0.ts`, `${dest}/internal/exit_0.js`);
await Deno.copyFile(`${dir}/internal/exit_1.ts`, `${dest}/internal/exit_1.js`);
await Deno.copyFile(`${dir}/internal/read_stdin.ts`, `${dest}/internal/read_stdin.js`);
await Deno.copyFile(`${dir}/internal/write_stderr.ts`, `${dest}/internal/write_stderr.js`);
await Deno.copyFile(`${dir}/internal/write_stdout.ts`, `${dest}/internal/write_stdout.js`);
await Deno.copyFile(`${dir}/internal/read_stdin_async.ts`, `${dest}/internal/read_stdin_async.js`);

for await (const entry of Deno.readDir(`${dest}/internal`)) {
    console.log(entry);
    if (entry.isFile) {
        let content = await Deno.readTextFile(`${dest}/internal/${entry.name}`);
        content = content.replaceAll(/\.ts/g, ".js");
        await Deno.writeTextFile(`${dest}/internal/${entry.name}`, content);
    }
}
