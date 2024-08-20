import { deleteAsync } from "del";
import {
  __dirname,
  isBuild,
  destFolder,
  srcFolder,
  projectPaths,
} from "../config/paths.js";

const reset = () => deleteAsync(destFolder);

export { reset };
