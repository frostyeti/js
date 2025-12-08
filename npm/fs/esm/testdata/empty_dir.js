import { emptyDir } from "../empty_dir.js";
try {
  await emptyDir("fs/testdata/testfolder");
  console.log("success");
} catch (error) {
  console.log(error);
}
