import gulp from "gulp";
import GulpSSH from "gulp-ssh";

import { configSFTP } from "../config/ftp.js";
import {
  __dirname,
  isBuild,
  destFolder,
  srcFolder,
  projectPaths,
} from "../config/paths.js";
import { logger } from "../config/Logger.js";

const gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: configSFTP,
});

const sftpDeploy = () => {
  return gulp
    .src(projectPaths.ftpSrc)
    .pipe(gulpSSH.dest(projectPaths.ftpServerDest));
};

export { sftpDeploy };
