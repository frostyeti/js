/**
 * The CI provider type.
 *
 * Supported providers:
 * - `local` - Not running in CI (local development)
 * - `github` - GitHub Actions
 * - `gitlab` - GitLab CI
 * - `bitbucket` - Bitbucket Pipelines
 * - `azdo` - Azure DevOps Pipelines
 * - `jenkins` - Jenkins
 * - `travisci` - Travis CI
 * - `appveyor` - AppVeyor
 * - `circleci` - CircleCI
 * - `codeship` - Codeship
 * - `drone` - Drone CI
 * - `gitea` - Gitea Actions
 */
export type CiDriver =
  | "local"
  | "github"
  | "gitlab"
  | "bitbucket"
  | "azdo"
  | "jenkins"
  | "travisci"
  | "appveyor"
  | "circleci"
  | "codeship"
  | "drone"
  | "gitea";
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
export declare const CI_DRIVER: CiDriver;
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
export declare const CI: boolean;
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
export declare function prependPath(path: string): void;
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
export declare function setVar(
  key: string,
  value: string,
  output?: boolean,
  secret?: boolean,
): void;
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
export declare function setInteractive(enable: boolean): void;
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
export declare function isInteractive(): boolean;
