import { emptyDirSync } from "../empty_dir.js";
try {
  emptyDirSync("fs/testdata/testfolder");
  console.log("success");
} catch (error) {
  console.log(error);
}
