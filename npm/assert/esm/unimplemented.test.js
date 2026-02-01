import { describe, test } from "node:test";
import { equal } from "./equal.js";
import { unimplemented } from "./unimplemented.js";
import { AssertionError } from "./assertion-error.js";
describe("assert::unimplemented", () => {
  describe("basic behavior", () => {
    test("always throws AssertionError", () => {
      let threw = false;
      let errorType = "";
      try {
        unimplemented();
      } catch (e) {
        threw = true;
        if (e instanceof AssertionError) {
          errorType = "AssertionError";
        }
      }
      equal(threw, true);
      equal(errorType, "AssertionError");
    });
    test("throws with default message", () => {
      let message = "";
      try {
        unimplemented();
      } catch (e) {
        message = e.message;
      }
      equal(message.includes("Unimplemented"), true);
    });
    test("throws with custom message", () => {
      let message = "";
      try {
        unimplemented("TODO: implement OAuth support");
      } catch (e) {
        message = e.message;
      }
      equal(message.includes("TODO: implement OAuth support"), true);
    });
  });
  describe("use cases", () => {
    test("can be used as placeholder in interface methods", () => {
      class InMemoryRepository {
        save(_item) {
          // Implemented
        }
        delete(_id) {
          unimplemented("delete operation not yet implemented");
        }
      }
      const repo = new InMemoryRepository();
      repo.save({}); // Works
      let threw = false;
      try {
        repo.delete("123");
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("can be used in abstract-like patterns", () => {
      class BaseHandler {
        handle() {
          unimplemented("Subclasses must implement handle()");
          throw new Error("unreachable"); // TypeScript needs this
        }
      }
      class ConcreteHandler extends BaseHandler {
        handle() {
          return "handled";
        }
      }
      const concrete = new ConcreteHandler();
      equal(concrete.handle(), "handled");
      const base = new BaseHandler();
      let threw = false;
      try {
        base.handle();
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("can be used for feature flags", () => {
      const FEATURE_ENABLED = false;
      function experimentalFeature() {
        if (!FEATURE_ENABLED) {
          unimplemented("Experimental feature is disabled");
        }
        return "feature result";
      }
      let threw = false;
      try {
        experimentalFeature();
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
  });
  describe("return type", () => {
    test("can be used in functions that throw", () => {
      function getValue(implemented) {
        if (implemented) {
          return "value";
        }
        unimplemented("Not implemented yet");
        throw new Error("unreachable"); // TypeScript needs this
      }
      equal(getValue(true), "value");
    });
  });
  describe("error properties", () => {
    test("error has correct name", () => {
      let name = "";
      try {
        unimplemented();
      } catch (e) {
        name = e.name;
      }
      equal(name, "AssertionError");
    });
    test("error has stack trace", () => {
      let hasStack = false;
      try {
        unimplemented();
      } catch (e) {
        hasStack = !!e.stack;
      }
      equal(hasStack, true);
    });
  });
  describe("with descriptive messages", () => {
    test("can include task references", () => {
      let message = "";
      try {
        unimplemented("See JIRA-1234 for implementation details");
      } catch (e) {
        message = e.message;
      }
      equal(message.includes("JIRA-1234"), true);
    });
    test("can include version targets", () => {
      let message = "";
      try {
        unimplemented("Scheduled for v2.0 release");
      } catch (e) {
        message = e.message;
      }
      equal(message.includes("v2.0"), true);
    });
  });
});
