import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { split } from "./split.ts";

// Basic Splitting Tests

test("args::split with simple space-separated args", () => {
    const args = split("deno run --allow-read mod.ts");
    equal(args.length, 4);
    equal(args[0], "deno");
    equal(args[1], "run");
    equal(args[2], "--allow-read");
    equal(args[3], "mod.ts");
});

test("args::split with single word", () => {
    const args = split("hello");
    equal(args.length, 1);
    equal(args[0], "hello");
});

test("args::split with multiple spaces between args", () => {
    const args = split("hello    world");
    equal(args.length, 2);
    equal(args[0], "hello");
    equal(args[1], "world");
});

test("args::split with empty string", () => {
    const args = split("");
    equal(args.length, 0);
});

test("args::split with only spaces", () => {
    const args = split("     ");
    equal(args.length, 0);
});

// Double Quote Tests

test("args::split with double quotes", () => {
    const args = split('deno run --allow-read "mod.ts"');
    equal(args.length, 4);
    equal(args[0], "deno");
    equal(args[1], "run");
    equal(args[2], "--allow-read");
    equal(args[3], "mod.ts");
});

test("args::split with double quotes containing spaces", () => {
    const args = split('ls -la "my documents"');
    equal(args.length, 3);
    equal(args[0], "ls");
    equal(args[1], "-la");
    equal(args[2], "my documents");
});

test("args::split with multiple double quoted args", () => {
    const args = split('"hello world" "foo bar"');
    equal(args.length, 2);
    equal(args[0], "hello world");
    equal(args[1], "foo bar");
});

test("args::split with empty double quotes", () => {
    const args = split('echo "" test');
    equal(args.length, 2);
    equal(args[0], "echo");
    equal(args[1], "test");
});

// Single Quote Tests

test("args::split with single quotes", () => {
    const args = split("deno run --allow-read 'mod.ts'");
    equal(args.length, 4);
    equal(args[0], "deno");
    equal(args[1], "run");
    equal(args[2], "--allow-read");
    equal(args[3], "mod.ts");
});

test("args::split with single quotes containing spaces", () => {
    const args = split("grep 'hello world' file.txt");
    equal(args.length, 3);
    equal(args[0], "grep");
    equal(args[1], "hello world");
    equal(args[2], "file.txt");
});

test("args::split with single quotes preserving internal spaces", () => {
    const args = split("deno run --allow-read ' whatever i want '");
    equal(args.length, 4);
    equal(args[0], "deno");
    equal(args[1], "run");
    equal(args[2], "--allow-read");
    equal(args[3], " whatever i want ");
});

// Escaped Quote Tests

test("args::split with escaped double quotes", () => {
    const args = split('deno run --allow-read \\"mod.ts\\"');
    equal(args.length, 4);
    equal(args[0], "deno");
    equal(args[1], "run");
    equal(args[2], "--allow-read");
    equal(args[3], '\\"mod.ts\\"');
});

test("args::split with escaped quotes inside double quotes", () => {
    const args = split('echo "say \\"hello\\""');
    equal(args.length, 2);
    equal(args[0], "echo");
    equal(args[1], 'say "hello"');
});

test("args::split with path containing spaces and escaped quotes", () => {
    const args = split('deno run --allow-read "path\\next folder\\mod.ts"');
    equal(args.length, 4);
    equal(args[0], "deno");
    equal(args[1], "run");
    equal(args[2], "--allow-read");
    equal(args[3], "path\\next folder\\mod.ts");
});

test("args::split with complex escaped quotes", () => {
    const args = split('deno run --allow-read "path\\next folder\\\\"mod.ts\\"');
    equal(args[0], "deno");
    equal(args[1], "run");
    equal(args[2], "--allow-read");
    equal(args[3], `path\\next folder\\"mod.ts"`);
});

// Mixed Quote Tests

test("args::split with mixed single and double quotes", () => {
    const args = split(`echo "hello" 'world'`);
    equal(args.length, 3);
    equal(args[0], "echo");
    equal(args[1], "hello");
    equal(args[2], "world");
});

test("args::split with single quote inside double quotes", () => {
    const args = split(`echo "it's a test"`);
    equal(args.length, 2);
    equal(args[0], "echo");
    equal(args[1], "it's a test");
});

test("args::split with double quote inside single quotes", () => {
    const args = split(`echo 'say "hello"'`);
    equal(args.length, 2);
    equal(args[0], "echo");
    equal(args[1], 'say "hello"');
});

// Command Line Option Tests

test("args::split with long options", () => {
    const args = split("--verbose --output=file.txt --config config.json");
    equal(args.length, 4);
    equal(args[0], "--verbose");
    equal(args[1], "--output=file.txt");
    equal(args[2], "--config");
    equal(args[3], "config.json");
});

test("args::split with short options", () => {
    const args = split("-v -o file.txt -c config.json");
    equal(args.length, 5);
    equal(args[0], "-v");
    equal(args[1], "-o");
    equal(args[2], "file.txt");
    equal(args[3], "-c");
    equal(args[4], "config.json");
});

test("args::split with combined short options", () => {
    const args = split("-abc -def");
    equal(args.length, 2);
    equal(args[0], "-abc");
    equal(args[1], "-def");
});

// Special Characters Tests

test("args::split with equals sign", () => {
    const args = split("--foo=bar --baz=qux");
    equal(args.length, 2);
    equal(args[0], "--foo=bar");
    equal(args[1], "--baz=qux");
});

test("args::split with URLs", () => {
    const args = split("curl https://example.com/path?query=value");
    equal(args.length, 2);
    equal(args[0], "curl");
    equal(args[1], "https://example.com/path?query=value");
});

test("args::split with file paths containing backslashes", () => {
    const args = split("cat C:\\Users\\test\\file.txt");
    equal(args.length, 2);
    equal(args[0], "cat");
    equal(args[1], "C:\\Users\\test\\file.txt");
});

// Unicode Tests

test("args::split with accented characters", () => {
    const args = split("echo café résumé");
    equal(args.length, 3);
    equal(args[0], "echo");
    equal(args[1], "café");
    equal(args[2], "résumé");
});

test("args::split with German umlauts", () => {
    const args = split("echo Größe Übung");
    equal(args.length, 3);
    equal(args[0], "echo");
    equal(args[1], "Größe");
    equal(args[2], "Übung");
});

test("args::split with Greek letters", () => {
    const args = split("echo αβγ δεζ");
    equal(args.length, 3);
    equal(args[0], "echo");
    equal(args[1], "αβγ");
    equal(args[2], "δεζ");
});

test("args::split with Cyrillic letters", () => {
    const args = split("echo привет мир");
    equal(args.length, 3);
    equal(args[0], "echo");
    equal(args[1], "привет");
    equal(args[2], "мир");
});

test("args::split with emoji", () => {
    const args = split("echo 🎉 🚀 🌟");
    equal(args.length, 4);
    equal(args[0], "echo");
    equal(args[1], "🎉");
    equal(args[2], "🚀");
    equal(args[3], "🌟");
});

test("args::split with CJK characters", () => {
    const args = split("echo 你好 世界");
    equal(args.length, 3);
    equal(args[0], "echo");
    equal(args[1], "你好");
    equal(args[2], "世界");
});

test("args::split with quoted Unicode", () => {
    const args = split(`echo "café latte" '日本語'`);
    equal(args.length, 3);
    equal(args[0], "echo");
    equal(args[1], "café latte");
    equal(args[2], "日本語");
});

// Edge Cases

test("args::split with leading spaces", () => {
    const args = split("   hello world");
    equal(args.length, 2);
    equal(args[0], "hello");
    equal(args[1], "world");
});

test("args::split with trailing spaces", () => {
    const args = split("hello world   ");
    equal(args.length, 2);
    equal(args[0], "hello");
    equal(args[1], "world");
});

test("args::split with tabs", () => {
    const args = split("hello\tworld");
    equal(args.length, 1);
    equal(args[0], "hello\tworld");
});

test("args::split with newlines in quotes", () => {
    const args = split(`echo "line1\nline2"`);
    equal(args.length, 2);
    equal(args[0], "echo");
    equal(args[1], "line1\nline2");
});

// Real-world Command Tests

test("args::split with git command", () => {
    const args = split('git commit -m "Initial commit"');
    equal(args.length, 4);
    equal(args[0], "git");
    equal(args[1], "commit");
    equal(args[2], "-m");
    equal(args[3], "Initial commit");
});

test("args::split with docker command", () => {
    const args = split("docker run -d -p 8080:80 --name myapp nginx:latest");
    equal(args.length, 8);
    equal(args[0], "docker");
    equal(args[1], "run");
    equal(args[2], "-d");
    equal(args[3], "-p");
    equal(args[4], "8080:80");
    equal(args[5], "--name");
    equal(args[6], "myapp");
    equal(args[7], "nginx:latest");
});

test("args::split with npm command", () => {
    const args = split("npm install --save-dev typescript @types/node");
    equal(args.length, 5);
    equal(args[0], "npm");
    equal(args[1], "install");
    equal(args[2], "--save-dev");
    equal(args[3], "typescript");
    equal(args[4], "@types/node");
});

test("args::split with complex curl command", () => {
    const args = split(`curl -X POST -H "Content-Type: application/json" -d '{"key": "value"}' https://api.example.com`);
    equal(args.length, 8);
    equal(args[0], "curl");
    equal(args[1], "-X");
    equal(args[2], "POST");
    equal(args[3], "-H");
    equal(args[4], "Content-Type: application/json");
    equal(args[5], "-d");
    equal(args[6], '{"key": "value"}');
    equal(args[7], "https://api.example.com");
});
