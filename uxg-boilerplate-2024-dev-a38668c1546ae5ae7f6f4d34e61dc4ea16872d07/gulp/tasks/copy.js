// import gulp from "gulp";

// import {
//   __dirname,
//   isBuild,
//   destFolder,
//   srcFolder,
//   projectPaths,
// } from "../config/paths.js";
// import { logger } from "../config/Logger.js";

// const copy = () => {
//   return gulp
//     .src(projectPaths.publicSrc, { base: srcFolder, allowEmpty: true })
//     .pipe(logger.handleError("COPY"))
//     .pipe(gulp.dest(destFolder));
// };

// export { copy };

import gulp from "gulp";
import fs from "fs";
import path from "path";
import {
  __dirname,
  isBuild,
  destFolder,
  srcFolder,
  projectPaths,
} from "../config/paths.js";
import { logger } from "../config/Logger.js";

const copy = () => {
  // src 폴더 내의 public 폴더 경로 구성
  const sourcePath = path.join(srcFolder, 'public');

  // 폴더가 존재하는지 확인
  if (!fs.existsSync(sourcePath)) {
    console.log(`Public 폴더(${sourcePath})가 존재하지 않습니다. 복사 작업을 건너뜁니다.`);
    return Promise.resolve(); // 작업을 정상적으로 완료된 것으로 처리
  }

  // 폴더가 존재할 경우에만 파일 복사 실행
  return gulp
    .src(`${sourcePath}/**/*`, { base: srcFolder, allowEmpty: true })
    .pipe(logger.handleError("COPY"))
    .pipe(gulp.dest(destFolder));
};

export { copy };
