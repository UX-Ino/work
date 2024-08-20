import gulp from "gulp";
import imageMin from "gulp-imagemin";

import { plugins } from "../config/plugins.js";
import { __dirname, isBuild, destFolder, srcFolder, projectPaths } from "../config/paths.js";
import { logger } from "../config/Logger.js";

const images = (isBuild) => {
  return gulp
    .src(projectPaths.imagesSrc, { removeBOM: false })
    .pipe(logger.handleError("IMAGES"))
    .pipe(plugins.newer(destFolder))
    .pipe(
      plugins.if(
        isBuild,
        imageMin({
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          interlaced: true,
          optimizationLevel: 3, // 0 to 7
        }),
      ),
    )
    .pipe(gulp.dest(destFolder))
    .pipe(plugins.browserSync.stream());
};

export { images };
