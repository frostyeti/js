import "./_dnt.test_polyfills.js";
import { test } from "node:test";
import { equal } from "./equal.js";
test("assert::equal", () => {
    equal(1, 1);
    equal("hello", "hello");
    equal([1, 2, 3], [1, 2, 3]);
    equal({ a: 1, b: 2 }, { a: 1, b: 2 });
    equal({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } });
    equal(undefined, undefined);
    equal(null, null);
    equal(true, true);
    equal(false, false);
    equal(0, 0);
    equal(-0, -0);
    equal(new Set([1, 2, 3]), new Set([1, 2, 3]));
    function throws(fn, msg) {
        let threw = false;
        try {
            fn();
        }
        catch {
            threw = true;
        }
        if (!threw) {
            throw new Error(msg ?? "Expected function to throw");
        }
    }
    throws(() => equal(1, 2), "Expected 1 to equal 2");
    throws(() => equal("hello", "world"), "Expected 'hello' to equal 'world'");
    throws(() => equal([1, 2, 3], [1, 2, 4]), "Expected [1, 2, 3] to equal [1, 2, 4]");
    throws(() => equal({ a: 1, b: 2 }, { a: 1, b: 3 }), "Expected { a: 1, b: 2 } to equal { a: 1, b: 3 }");
});
