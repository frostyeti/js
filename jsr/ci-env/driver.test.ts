import { test } from "node:test";
import { nope, ok } from "@frostyeti/assert";
import { CI, CI_DRIVER, isInteractive, prependPath, setInteractive, setVar } from "./driver.ts";
import {
    command,
    debug,
    endGroup,
    error,
    info,
    isDebugEnabled,
    ok as logOk,
    progress,
    registerSecret,
    setDebug,
    startGroup,
    success,
    warn,
    write,
    writeError,
    writeErrorLine,
    writeLine,
} from "./log.ts";

test("ci-env::CI_DRIVER and CI is set", () => {
    ok(CI_DRIVER !== undefined, "CI_DRIVER is undefined");
    ok(CI !== undefined, "CI is undefined");
});

test("ci-env::CI_DRIVER is a valid value", () => {
    const validDrivers = [
        "local",
        "github",
        "gitlab",
        "bitbucket",
        "azdo",
        "jenkins",
        "travisci",
        "appveyor",
        "circleci",
        "codeship",
        "drone",
        "gitea",
    ];
    ok(validDrivers.includes(CI_DRIVER), `CI_DRIVER "${CI_DRIVER}" is not a valid driver`);
});

test("ci-env::CI is boolean", () => {
    ok(typeof CI === "boolean", "CI should be a boolean");
});

test("ci-env::isInteractive returns boolean", () => {
    const result = isInteractive();
    ok(typeof result === "boolean", "isInteractive should return a boolean");
});

test("ci-env::setInteractive changes interactive state", () => {
    const original = isInteractive();

    setInteractive(false);
    nope(isInteractive(), "Should be non-interactive after setInteractive(false)");

    setInteractive(true);
    ok(isInteractive(), "Should be interactive after setInteractive(true)");

    // Restore original
    setInteractive(original);
});

test("ci-env::registerSecret and logging", () => {
    const myValue = "test-secret-value";

    registerSecret(myValue);

    startGroup("Test Group");

    writeLine("This is a test log message with a secret: " + myValue);

    logOk(`This is an ok message with a secret: ${myValue}`);

    command("my-command", [" test ", "example", "two", "my test value"]);

    endGroup();
});

test("ci-env::writeLine writes to stdout", () => {
    // Just verify it doesn't throw
    writeLine("Test message");
    writeLine("Formatted: %s %d", "test", 42);
});

test("ci-env::write writes without newline", () => {
    write("No newline");
    writeLine(""); // Add newline after
});

test("ci-env::writeError writes to stderr", () => {
    writeError("Error message");
});

test("ci-env::writeErrorLine writes to stderr with newline", () => {
    writeErrorLine("Error line");
    writeErrorLine("Formatted error: %s", "details");
});

test("ci-env::progress shows progress", () => {
    progress("Download", 50);
});

test("ci-env::error logs error message", () => {
    error("Test error message");
    error("Error with %s", "formatting");
});

test("ci-env::error logs Error object", () => {
    const err = new Error("Test error");
    error(err);
    error(err, "Custom message");
});

test("ci-env::warn logs warning message", () => {
    warn("Test warning message");
    warn("Warning with %s", "formatting");
});

test("ci-env::info logs info message", () => {
    info("Test info message");
    info("Info with %d items", 5);
});

test("ci-env::debug respects debug flag", () => {
    const wasEnabled = isDebugEnabled();

    setDebug(false);
    nope(isDebugEnabled(), "Debug should be disabled");
    debug("This should not show");

    setDebug(true);
    ok(isDebugEnabled(), "Debug should be enabled");
    debug("This should show");

    setDebug(wasEnabled);
});

test("ci-env::ok logs success message", () => {
    logOk("Test ok message");
    logOk("OK with %s", "details");
});

test("ci-env::success logs success message", () => {
    success("Test success message");
    success("Success: %s completed", "operation");
});

test("ci-env::command formats command output", () => {
    command("git", ["status"]);
    command("npm", ["install", "--save", "lodash"]);
    command("echo", ["hello world", "with spaces"]);
    command("test", ["--flag", "/path", "normal"]);
});

test("ci-env::startGroup and endGroup", () => {
    startGroup("Test Group");
    writeLine("Inside group");
    endGroup();
});

test("ci-env::setDebug and isDebugEnabled", () => {
    const original = isDebugEnabled();

    setDebug(true);
    ok(isDebugEnabled(), "Should be true after setDebug(true)");

    setDebug(false);
    nope(isDebugEnabled(), "Should be false after setDebug(false)");

    setDebug(original);
});

test("ci-env::setVar sets environment variable", () => {
    // This test just verifies it doesn't throw
    // Actual env var setting depends on CI environment
    setVar("TEST_VAR_CI_ENV", "test-value");
});

test("ci-env::prependPath adds to PATH", () => {
    // This test just verifies it doesn't throw
    prependPath("./test-bin");
});
