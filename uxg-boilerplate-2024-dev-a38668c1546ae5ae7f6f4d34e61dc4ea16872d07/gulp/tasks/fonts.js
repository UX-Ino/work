import gulp from "gulp";

import { plugins } from "../config/plugins.js";
import { __dirname, isBuild, destFolder, srcFolder, projectPaths } from "../config/paths.js";
import { logger } from "../config/Logger.js";

const fonts = (isBuild) => {
  return gulp.src(projectPaths.fontsSrc, { removeBOM: false }).pipe(logger.handleError("FONTS")).pipe(plugins.newer(destFolder)).pipe(gulp.dest(destFolder)).pipe(plugins.browserSync.stream());
};

export { fonts };
