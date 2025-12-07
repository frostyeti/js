import { history } from "./history.js";
import { chdir } from "./chdir.js";
/**
 * Pops the last directory from the directory stack and
 * changes the current working directory to that directory.
 * In the browser environment, this function calls history.back
 * to change the URL.
 *
 * @returns The last directory in the stack.
 * @throws Error if pop is not implemented.
 */
export function popd() {
  if (history.length > 0) {
    const directory = history.pop();
    if (directory) {
      chdir(directory);
      return directory;
    }
  }
  return undefined;
}
