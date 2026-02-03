// deno-lint-ignore-file no-console
import { emptyDir } from "../empty_dir.js";
try {
  // Empty testfolder stored in Deno.args where the child.txt is located.
  // deno-lint-ignore no-process-global
  await emptyDir(process.argv.slice(2)[0]);
  console.log("success");
} catch (error) {
  console.log(error);
}
