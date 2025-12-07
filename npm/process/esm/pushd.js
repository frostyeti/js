import { chdir } from "./chdir.js";
import { history } from "./history.js";
/**
 * Pushes the current working directory onto the directory
 * stack and changes the current working directory to the
 * specified directory.
 *
 * @param directory The directory to change to.
 * @throws ChangeDirectoryError if chdir is not implemented, if the directory is not found,
 * or if the runtime does not support changing the directory.
 */
export function pushd(directory) {
  chdir(directory);
  history.push(directory);
}
