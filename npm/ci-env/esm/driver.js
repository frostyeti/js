/**
 * The `driver` module provides functionality to determine the current CI provider
 * and whether the code is running in a CI environment.
 *
 * @module
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
 * The CI provider.
 */
export const CI_DRIVER = provider;
/**
 * Determines if the current environment is a CI environment.
 */
export const CI = CI_DRIVER !== "local" || get("CI") === "true";
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
export function setInteractive(enable) {
  interactive = enable;
}
export function isInteractive() {
  return interactive;
}
