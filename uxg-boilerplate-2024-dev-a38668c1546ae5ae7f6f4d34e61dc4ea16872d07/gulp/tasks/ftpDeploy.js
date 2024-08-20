import gulp from "gulp";
import ftp from "vinyl-ftp";
import util from "gulp-util";

import { configFTP } from "../config/ftp.js";
import {
  __dirname,
  isBuild,
  destFolder,
  srcFolder,
  projectPaths,
} from "../config/paths.js";
import { logger } from "../config/Logger.js";

const ftpDeploy = () => {
  configFTP.log = util.log;
  const ftpConnect = ftp.create(configFTP);

  return gulp
    .src(projectPaths.ftpSrc, {})
    .pipe(logger.handleError("FTP_DEPLOY"))
    .pipe(ftpConnect.dest(projectPaths.ftpServerDest));
};

export { ftpDeploy };
