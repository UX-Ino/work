import gulp from "gulp";
import zipPlugin from "gulp-zip";

import {
  __dirname,
  isBuild,
  destFolder,
  srcFolder,
  projectPaths,
} from "../config/paths.js";
import { logger } from "../config/Logger.js";

const getFormattedDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
};

const zip = () => {
  const formattedDate = getFormattedDate();
  return gulp
    .src(projectPaths.backupSrc, { dot: true })
    .pipe(logger.handleError("ZIP"))
    .pipe(zipPlugin(`${projectPaths.backupBase}-${formattedDate}.zip`))
    .pipe(gulp.dest(projectPaths.backupDest));
};

export { zip };
