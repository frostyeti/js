import { describe, test } from "node:test";
import { equal } from "./equal.ts";
import { unreachable } from "./unreachable.ts";
import { AssertionError } from "./assertion-error.ts";

describe("assert::unreachable", () => {
    describe("basic behavior", () => {
        test("always throws AssertionError", () => {
            let threw = false;
            let errorType = "";
            try {
                unreachable();
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
                unreachable();
            } catch (e) {
                message = (e as Error).message;
            }
            equal(message.includes("Unreachable"), true);
        });

        test("throws with custom message", () => {
            let message = "";
            try {
                unreachable("this should never happen");
            } catch (e) {
                message = (e as Error).message;
            }
            equal(message.includes("this should never happen"), true);
        });
    });

    describe("use cases", () => {
        test("can be used in switch statements for exhaustive checks", () => {
            type Color = "red" | "green" | "blue";
            function getColorCode(color: Color): number {
                switch (color) {
                    case "red": return 0xFF0000;
                    case "green": return 0x00FF00;
                    case "blue": return 0x0000FF;
                    default:
                        // This ensures all cases are handled
                        unreachable(`Unknown color: ${color}`);
                }
            }
            equal(getColorCode("red"), 0xFF0000);
            equal(getColorCode("green"), 0x00FF00);
            equal(getColorCode("blue"), 0x0000FF);
        });

        test("can be used after type guards", () => {
            type Shape = { kind: "circle"; radius: number } | { kind: "square"; side: number };
            
            function getArea(shape: Shape): number {
                if (shape.kind === "circle") {
                    return Math.PI * shape.radius ** 2;
                }
                if (shape.kind === "square") {
                    return shape.side ** 2;
                }
                unreachable("Unknown shape");
            }
            
            equal(getArea({ kind: "circle", radius: 1 }), Math.PI);
            equal(getArea({ kind: "square", side: 2 }), 4);
        });

        test("can be used in conditional branches", () => {
            function process(value: string | number): string {
                if (typeof value === "string") {
                    return value.toUpperCase();
                }
                if (typeof value === "number") {
                    return value.toString();
                }
                unreachable("Unexpected type");
            }
            
            equal(process("hello"), "HELLO");
            equal(process(42), "42");
        });
    });

    describe("return type", () => {
        test("has return type never", () => {
            function getValue(condition: boolean): string {
                if (condition) {
                    return "value";
                }
                // unreachable() returns never, so this is type-safe
                unreachable("Should have returned");
            }
            equal(getValue(true), "value");
        });
    });

    describe("error properties", () => {
        test("error has correct name", () => {
            let name = "";
            try {
                unreachable();
            } catch (e) {
                name = (e as Error).name;
            }
            equal(name, "AssertionError");
        });

        test("error has stack trace", () => {
            let hasStack = false;
            try {
                unreachable();
            } catch (e) {
                hasStack = !!(e as Error).stack;
            }
            equal(hasStack, true);
        });
    });
});
