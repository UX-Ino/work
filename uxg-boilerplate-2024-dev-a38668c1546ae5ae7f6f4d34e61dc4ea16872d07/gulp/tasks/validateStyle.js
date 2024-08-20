import gulp from "gulp";
import postcss from "gulp-postcss";
import postcssScss from "postcss-scss"; // SCSS 구문 분석을 위한 PostCSS 플러그인
import stylelint from "stylelint";
import reporter from "postcss-reporter";
import fs from "fs";
import path from "path";
import chalk from "chalk";

import { plugins } from "../config/plugins.js";
import { logger } from "../config/Logger.js";
import {
  __dirname,
  projectDirName,
  isBuild,
  destFolder,
  srcFolder,
  projectPaths,
} from "../config/paths.js";

// 참고 URL
// https://stylelint.io/

const validateStyle = (done) => {
  const now = new Date();
  const formattedDate =
    now.getFullYear() +
    ("0" + (now.getMonth() + 1)).slice(-2) +
    ("0" + now.getDate()).slice(-2) +
    "-" +
    ("0" + now.getHours()).slice(-2) +
    ("0" + now.getMinutes()).slice(-2) +
    ("0" + now.getSeconds()).slice(-2);

  const logFilePath = path.join(
    process.cwd(),
    `src/guide/pages/validation/css-validation-results-${formattedDate}.txt`,
  );

  // 디렉토리가 존재하지 않으면 생성
  const dirPath = path.dirname(logFilePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(logFilePath, "Stylelint Validation Results\n\n", "utf-8");

  const originalWrite = process.stdout.write.bind(process.stdout);
  process.stdout.write = (chunk, encoding, callback) => {
    const cleanChunk = chunk.toString().replace(
      // 정규 표현식을 사용하여 ANSI 이스케이프 코드를 제거합니다.
      // 이 정규 표현식은 대부분의 ANSI 이스케이프 코드를 포착합니다.
      /\x1b\[([0-9]{1,2}(;[0-9]{1,2})?)?[mGK]/g,
      "",
    );
    fs.appendFileSync(logFilePath, cleanChunk, "utf8");
    originalWrite(chunk, encoding, callback);
  };

  // 현재 날짜와 시간 가져오기
  const startTime = now.toLocaleString();
  console.log(chalk.blue(`Stylelint validation started at: ${startTime}`));
  fs.appendFileSync(
    logFilePath,
    `Stylelint validation started at: ${startTime}\n\n`,
    "utf-8",
  );

  return gulp
    .src(projectPaths.styleValidationSrc)
    .pipe(
      postcss(
        [
          stylelint(),
          reporter({
            clearReportedMessages: true,
            throwError: false, // 에러가 발생하면 Gulp 작업을 실패시킵니다.
          }),
        ],
        {
          syntax: postcssScss, // SCSS 파일을 처리하기 위해 구문 분석기로 postcss-scss를 지정합니다.
        },
      ),
    )
    .on("end", () => {
      process.stdout.write = originalWrite;
      done();
    });
  // .pipe(gulp.dest("./reports")); // 결과를 reports 폴더에 저장합니다 (선택적)
};

export { validateStyle };
