import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { DotEnvDocument } from "./document.js";
import { stringifyDocument } from "./stringify_document.js";
import { WINDOWS } from "./globals.js";
test("dotenv::stringifyDocument", () => {
  const doc = new DotEnvDocument();
  doc.comment("comment=1");
  doc.newline();
  doc.item("FOO", "bar");
  doc.item("BAR", "baz\n");
  doc.newline();
  console.log(doc.toArray());
  const source = stringifyDocument(doc);
  let expected = `#comment=1

FOO='bar'
BAR="baz
"
`;
  if (WINDOWS) {
    expected = `#comment=1\r\n\r\nFOO='bar'\r\nBAR="baz\n"\r\n`;
  }
  equal(source, expected);
});
