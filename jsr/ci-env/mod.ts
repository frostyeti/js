/**
 * ## Overview
 *
 * The `ci-env` module enables determining if you are within a CI pipeline and provides
 * utilities for logging, setting environment variables, and handling secrets across
 * different CI tools (GitHub Actions, GitLab CI, Azure DevOps, Bitbucket, Jenkins, etc.).
 *
 * ![logo](https://raw.githubusercontent.com/frostyeti/js/refs/heads/master/eng/assets/logo.png)
 *
 * [![JSR](https://jsr.io/badges/@frostyeti/ci-env)](https://jsr.io/@frostyeti/ci-env)
 * [![npm version](https://badge.fury.io/js/@frostyeti%2Fci-env.svg)](https://badge.fury.io/js/@frostyeti%2Fci-env)
 * [![GitHub version](https://badge.fury.io/gh/frostyeti%2Fjs.svg)](https://badge.fury.io/gh/frostyeti%2Fjs)
 *
 * ## Documentation
 *
 * Documentation is available on [jsr.io](https://jsr.io/@frostyeti/ci-env/doc)
 *
 * A list of other modules can be found at [github.com/frostyeti/js](https://github.com/frostyeti/js)
 *
 * ## Installation
 *
 * ```bash
 * # Deno
 * deno add jsr:@frostyeti/ci-env
 *
 * # npm from jsr
 * npx jsr add @frostyeti/ci-env
 *
 * # from npmjs.org
 * npm install @frostyeti/ci-env
 * ```
 *
 * ## Quick Start
 *
 * ```typescript
 * import { CI, CI_DRIVER, error, info, warn, startGroup, endGroup } from "@frostyeti/ci-env";
 *
 * // Check if running in CI
 * if (CI) {
 *     info(`Running in ${CI_DRIVER} CI environment`);
 * }
 *
 * // Log messages with appropriate formatting for your CI
 * info("Starting build process...");
 * warn("Cache is stale, rebuilding...");
 * error("Build failed!");
 *
 * // Group related log output
 * startGroup("Install Dependencies");
 * info("Installing packages...");
 * endGroup();
 * ```
 *
 * ## API Reference
 *
 * ### Constants
 *
 * | Constant | Type | Description |
 * |----------|------|-------------|
 * | `CI` | `boolean` | `true` if running in a CI environment |
 * | `CI_DRIVER` | `CiDriver` | The detected CI provider (e.g., "github", "gitlab", "azdo") |
 *
 * ### Types
 *
 * | Type | Description |
 * |------|-------------|
 * | `CiDriver` | Union type of supported CI providers: `"local"` \| `"github"` \| `"gitlab"` \| `"bitbucket"` \| `"azdo"` \| `"jenkins"` \| `"travisci"` \| `"appveyor"` \| `"circleci"` \| `"codeship"` \| `"drone"` \| `"gitea"` |
 *
 * ### Environment Functions
 *
 * | Function | Description |
 * |----------|-------------|
 * | `setVar(name, value, secret?, output?)` | Sets an environment variable, optionally marking it as secret or output |
 * | `prependPath(path)` | Prepends a directory to the PATH environment variable |
 * | `setInteractive(value)` | Sets whether the environment should behave interactively |
 * | `isInteractive()` | Returns whether the environment is interactive (false in CI) |
 *
 * ### Logging Functions
 *
 * | Function | Description |
 * |----------|-------------|
 * | `write(message, ...args)` | Writes formatted text to stdout (no newline) |
 * | `writeLine(message?, ...args)` | Writes formatted text to stdout with newline |
 * | `writeError(message, ...args)` | Writes formatted text to stderr (no newline) |
 * | `writeErrorLine(message?, ...args)` | Writes formatted text to stderr with newline |
 * | `progress(activity, percent)` | Displays a progress indicator (0-100) |
 * | `error(message, ...args)` | Logs an error message or Error object |
 * | `warn(message, ...args)` | Logs a warning message |
 * | `info(message, ...args)` | Logs an informational message |
 * | `debug(message, ...args)` | Logs a debug message (only when debug is enabled) |
 * | `ok(message, ...args)` | Logs a success/OK message |
 * | `success(message, ...args)` | Logs a success message with checkmark |
 * | `command(name, args)` | Logs a command that is being executed |
 * | `startGroup(name)` | Starts a collapsible log group |
 * | `endGroup()` | Ends the current log group |
 *
 * ### Debug Functions
 *
 * | Function | Description |
 * |----------|-------------|
 * | `setDebug(enabled)` | Enables or disables debug logging |
 * | `isDebugEnabled()` | Returns whether debug logging is enabled |
 *
 * ### Secret Functions
 *
 * | Function | Description |
 * |----------|-------------|
 * | `registerSecret(value)` | Registers a value as a secret to be masked in logs |
 *
 * ## Examples
 *
 * ### Detecting CI Environment
 *
 * ```typescript
 * import { CI, CI_DRIVER } from "@frostyeti/ci-env";
 *
 * if (CI) {
 *     console.log(`Running in CI: ${CI_DRIVER}`);
 *
 *     switch (CI_DRIVER) {
 *         case "github":
 *             console.log("GitHub Actions detected");
 *             break;
 *         case "gitlab":
 *             console.log("GitLab CI detected");
 *             break;
 *         case "azdo":
 *             console.log("Azure DevOps detected");
 *             break;
 *         default:
 *             console.log(`Other CI: ${CI_DRIVER}`);
 *     }
 * } else {
 *     console.log("Running locally");
 * }
 * ```
 *
 * ### Setting Environment Variables
 *
 * ```typescript
 * import { setVar, prependPath } from "@frostyeti/ci-env";
 *
 * // Set a regular environment variable
 * setVar("BUILD_VERSION", "1.0.0");
 *
 * // Set a secret variable (will be masked in logs)
 * setVar("API_KEY", "secret-key-123", true);
 *
 * // Set an output variable for downstream jobs
 * setVar("ARTIFACT_PATH", "./dist/app.zip", false, true);
 *
 * // Add a directory to PATH
 * prependPath("./node_modules/.bin");
 * ```
 *
 * ### Structured Logging
 *
 * ```typescript
 * import {
 *     startGroup, endGroup,
 *     info, warn, error, debug,
 *     ok, success, command
 * } from "@frostyeti/ci-env";
 *
 * startGroup("Build Phase");
 *
 * info("Compiling TypeScript...");
 * command("tsc", ["--project", "tsconfig.json"]);
 *
 * warn("Found deprecated API usage");
 * ok("Compilation complete");
 *
 * endGroup();
 *
 * startGroup("Test Phase");
 *
 * info("Running tests...");
 * command("deno", ["test", "-A"]);
 * success("All tests passed!");
 *
 * endGroup();
 * ```
 *
 * ### Handling Secrets
 *
 * ```typescript
 * import { registerSecret, info, error } from "@frostyeti/ci-env";
 *
 * const apiKey = Deno.env.get("API_KEY") ?? "";
 * const dbPassword = Deno.env.get("DB_PASSWORD") ?? "";
 *
 * // Register secrets to be masked in logs
 * registerSecret(apiKey);
 * registerSecret(dbPassword);
 *
 * // These will have secrets masked in output
 * info(`Connecting with key: ${apiKey}`);
 * error(`Database connection failed for password: ${dbPassword}`);
 * ```
 *
 * ### Debug Logging
 *
 * ```typescript
 * import { setDebug, isDebugEnabled, debug, info } from "@frostyeti/ci-env";
 *
 * // Enable debug logging
 * setDebug(true);
 *
 * info("Starting process...");
 * debug("Detailed: loading configuration from ./config.json");
 * debug("Detailed: parsed 42 entries");
 *
 * if (isDebugEnabled()) {
 *     // Expensive debug operations
 *     debug("Memory usage: " + JSON.stringify(Deno.memoryUsage()));
 * }
 *
 * // Disable debug logging
 * setDebug(false);
 * debug("This won't be shown");
 * ```
 *
 * ### Interactive Mode
 *
 * ```typescript
 * import { isInteractive, setInteractive, info } from "@frostyeti/ci-env";
 *
 * if (isInteractive()) {
 *     // Show prompts, spinners, etc.
 *     info("Interactive mode: waiting for user input...");
 * } else {
 *     // CI mode: use defaults, skip prompts
 *     info("Non-interactive mode: using default values");
 * }
 *
 * // Force non-interactive for scripted execution
 * setInteractive(false);
 * ```
 *
 * ## Supported CI Providers
 *
 * | Provider | Driver Value | Detection |
 * |----------|-------------|-----------|
 * | GitHub Actions | `"github"` | `GITHUB_ACTIONS` env var |
 * | GitLab CI | `"gitlab"` | `GITLAB_CI` env var |
 * | Azure DevOps | `"azdo"` | `TF_BUILD` env var |
 * | Bitbucket Pipelines | `"bitbucket"` | `BITBUCKET_BUILD_NUMBER` env var |
 * | Jenkins | `"jenkins"` | `JENKINS_URL` env var |
 * | Travis CI | `"travisci"` | `TRAVIS` env var |
 * | AppVeyor | `"appveyor"` | `APPVEYOR` env var |
 * | CircleCI | `"circleci"` | `CIRCLECI` env var |
 * | Codeship | `"codeship"` | `CI_NAME=codeship` |
 * | Drone | `"drone"` | `DRONE` env var |
 * | Gitea Actions | `"gitea"` | `GITEA_ACTIONS` env var |
 * | Local (not CI) | `"local"` | No CI detected |
 *
 * ## License
 *
 * [MIT License](./LICENSE.md)
 *
 * @module
 */
export * from "./driver.ts";
export * from "./log.ts";
