/**
 * The `driver` module provides functionality to determine the current CI provider
 * and whether the code is running in a CI environment.
 *
 * @module
 * @example
 * ```ts
 * import { CI, CI_DRIVER, setVar, prependPath } from "@frostyeti/ci-env";
 *
 * // Check if running in CI
 * if (CI) {
 *   console.log("Running in CI environment");
 *   console.log("Provider:", CI_DRIVER); // "github", "azdo", "gitlab", etc.
 * }
 *
 * // Set environment variable (persists across steps in CI)
 * setVar("MY_VAR", "value", true, false);
 *
 * // Add to PATH
 * prependPath("./node_modules/.bin");
 * ```
 */
import { get, prependPath as prependEnvPath, set } from "@frostyeti/env";
import { writeTextFileSync } from "@frostyeti/fs";
import { secretMasker } from "@frostyeti/secrets";
import { args, stdout } from "@frostyeti/process";
let provider = "local";
if (get("GITEA_WORK_DIR") !== undefined) {
  provider = "gitea";
} else if (
  get("GITHUB_ACTIONS") === "true" || get("GITHUB_WORKFLOW") !== undefined
) {
  provider = "github";
} else if (get("GITLAB_CI") === "true") {
  provider = "gitlab";
} else if (
  get("TF_BUILD") === "True" ||
  get("SYSTEM_TEAMFOUNDATIONCOLLECTIONURI") !== undefined
) {
  provider = "azdo";
} else if (get("BITBUCKET_BUILD_NUMBER") !== undefined) {
  provider = "bitbucket";
} else if (get("JENKINS_URL") !== undefined) {
  provider = "jenkins";
} else if (get("TRAVIS") === "true") {
  provider = "travisci";
} else if (get("APPVEYOR") === "True") {
  provider = "appveyor";
} else if (get("CIRCLECI") === "true") {
  provider = "circleci";
} else if (get("CI_NAME") === "codeship") {
  provider = "codeship";
} else if (get("DRONE") === "true") {
  provider = "drone";
}
/**
 * The detected CI provider.
 *
 * @example
 * ```ts
 * import { CI_DRIVER } from "@frostyeti/ci-env";
 *
 * switch (CI_DRIVER) {
 *   case "github":
 *     console.log("Running in GitHub Actions");
 *     break;
 *   case "azdo":
 *     console.log("Running in Azure DevOps");
 *     break;
 *   case "local":
 *     console.log("Running locally");
 *     break;
 *   default:
 *     console.log("Running in CI:", CI_DRIVER);
 * }
 * ```
 */
export const CI_DRIVER = provider;
/**
 * Determines if the current environment is a CI environment.
 *
 * @example
 * ```ts
 * import { CI } from "@frostyeti/ci-env";
 *
 * if (CI) {
 *   console.log("Running in a CI pipeline");
 * } else {
 *   console.log("Running locally");
 * }
 * ```
 */
export const CI = CI_DRIVER !== "local" || get("CI") === "true";
/**
 * Prepends a path to the PATH environment variable.
 *
 * In CI environments, this also updates the CI-specific path configuration:
 * - **GitHub Actions**: Writes to `GITHUB_PATH` file
 * - **Azure DevOps**: Emits `##vso[task.prependpath]` command
 *
 * @param path The path to prepend.
 * @example
 * ```ts
 * import { prependPath } from "@frostyeti/ci-env";
 *
 * // Add local bin directory to PATH
 * prependPath("./node_modules/.bin");
 *
 * // Add custom tools directory
 * prependPath("/opt/my-tools/bin");
 * ```
 */
export function prependPath(path) {
  prependEnvPath(path);
  switch (CI_DRIVER) {
    case "github":
      writeTextFileSync(get("GITHUB_PATH") || "", `${path}\n`, {
        append: true,
      });
      break;
    case "azdo":
      console.log(`##vso[task.prependpath]${path}`);
      break;
  }
}
/**
 * Sets an environment variable, optionally marking it as an output or secret.
 *
 * In CI environments, this also updates the CI-specific variable configuration:
 * - **GitHub Actions**: Writes to `GITHUB_ENV` file and emits output commands
 * - **Azure DevOps**: Emits `##vso[task.setvariable]` command
 *
 * @param key The environment variable name.
 * @param value The value to set.
 * @param output If true, marks as a step output (available to subsequent steps).
 * @param secret If true, masks the value in logs.
 * @example
 * ```ts
 * import { setVar } from "@frostyeti/ci-env";
 *
 * // Set a simple environment variable
 * setVar("MY_VAR", "some-value");
 *
 * // Set an output variable (available to other steps)
 * setVar("BUILD_VERSION", "1.2.3", true);
 *
 * // Set a secret (masked in logs)
 * setVar("API_KEY", "secret-key-here", false, true);
 *
 * // Set both output and secret
 * setVar("TOKEN", "secret-token", true, true);
 * ```
 */
export function setVar(key, value, output = false, secret = false) {
  set(key, value);
  if (secret) {
    secretMasker.add(value);
  }
  switch (CI_DRIVER) {
    case "github":
      if (output) {
        if (value.match(/\r?\n/)) {
          console.log(`${key}<<EOF\n${value}\nEOF`);
        } else {
          console.log(`::set-output name=${key}::${value}`);
        }
      }
      if (value.match(/\r?\n/)) {
        writeTextFileSync(
          get("GITHUB_ENV") || "",
          `${key}<<EOF\n${value}\nEOF\n`,
          {
            append: true,
          },
        );
      } else {
        writeTextFileSync(get("GITHUB_ENV") || "", `${key}=${value}\n`, {
          append: true,
        });
      }
      if (secret) {
        console.log(`::add-mask::${value}`);
      }
      break;
    case "azdo":
      {
        let attr = "";
        if (secret) {
          attr = "secret=true;";
        }
        if (output) {
          attr += "isOutput=true;";
        }
        console.log(`##vso[task.setvariable variable=${key};${attr}]${value}`);
      }
      break;
  }
}
let interactive = true;
if (CI) {
  interactive = false;
}
if (stdout.isTerm() && !CI) {
  interactive = true;
}
if (get("DEBIAN_FRONTEND") === "noninteractive") {
  interactive = false;
}
if (args.includes("--non-interactive") || args.includes("-NonInteractive")) {
  interactive = false;
}
/**
 * Sets whether the environment is interactive.
 *
 * @param enable Whether to enable interactive mode.
 * @example
 * ```ts
 * import { setInteractive, isInteractive } from "@frostyeti/ci-env";
 *
 * // Force non-interactive mode
 * setInteractive(false);
 *
 * if (!isInteractive()) {
 *   console.log("Running in non-interactive mode");
 * }
 * ```
 */
export function setInteractive(enable) {
  interactive = enable;
}
/**
 * Returns whether the environment is interactive.
 *
 * Interactive mode is automatically disabled in CI environments
 * or when certain flags are present (e.g., `--non-interactive`).
 *
 * @returns `true` if the environment is interactive, `false` otherwise.
 * @example
 * ```ts
 * import { isInteractive } from "@frostyeti/ci-env";
 *
 * if (isInteractive()) {
 *   // Prompt user for input
 *   const answer = await prompt("Continue? (y/n)");
 * } else {
 *   // Use default values
 *   console.log("Using default settings");
 * }
 * ```
 */
export function isInteractive() {
  return interactive;
}
