// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
import { AssertionError } from "./assertion-error.js";
import { isError } from "./is-error.js";
export async function rejects(fn, errorClassOrMsg, msgIncludesOrMsg, msg) {
  // deno-lint-ignore no-explicit-any
  let ErrorClass;
  let msgIncludes;
  let err;
  if (typeof errorClassOrMsg !== "string") {
    if (
      errorClassOrMsg === undefined ||
      errorClassOrMsg.prototype instanceof Error ||
      errorClassOrMsg.prototype === Error.prototype
    ) {
      ErrorClass = errorClassOrMsg;
      msgIncludes = msgIncludesOrMsg;
    }
  } else {
    msg = errorClassOrMsg;
  }
  let doesThrow = false;
  let isPromiseReturned = false;
  const msgSuffix = msg ? `: ${msg}` : ".";
  try {
    const possiblePromise = fn();
    if (
      possiblePromise &&
      typeof possiblePromise === "object" &&
      typeof possiblePromise.then === "function"
    ) {
      isPromiseReturned = true;
      await possiblePromise;
    } else {
      throw new Error();
    }
  } catch (error) {
    if (!isPromiseReturned) {
      throw new AssertionError(`Function throws when expected to reject${msgSuffix}`);
    }
    if (ErrorClass) {
      if (!(error instanceof Error)) {
        throw new AssertionError(`A non-Error object was rejected${msgSuffix}`);
      }
      isError(error, ErrorClass, msgIncludes, msg);
    }
    err = error;
    doesThrow = true;
  }
  if (!doesThrow) {
    throw new AssertionError(`Expected function to reject${msgSuffix}`);
  }
  return err;
}
