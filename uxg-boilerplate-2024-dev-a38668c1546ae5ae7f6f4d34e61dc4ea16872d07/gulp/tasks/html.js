import gulp from "gulp";
import fileInclude from "gulp-file-include";
import beautify from "gulp-jsbeautifier";

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

// 프로젝트 경로를 변경하기 위한 함수
import { replacePathPatterns } from "../config/replacePathPatterns.js";

// pug -> html 변환 옵션값 세팅
// https://www.npmjs.com/package/js-beautify
const beautifyOptions = {
  html: {
    indent_size: 2,
    indent_char: " ",
    // "indent_with_tabs": true,
    eol: "\n",
    end_with_newline: true,
    preserve_newlines: true,
    max_preserve_newlines: 10,
    indent_inner_html: false,
    brace_style: "collapse",
    wrap_line_length: 0,
    wrap_attributes: "auto",
    inline: [
      "br",
      "a",
      "span",
      "img",
      "i",
      "b",
      "strong",
      "em",
      "u",
      "del",
      "sub",
      "sup",
      "mark",
      "cite",
    ],
    unformatted: ["pre", "code", "textarea"],
    // "extra_liners": ['-->']
  },
  css: {},
};

// cl.html 파일인지 확인하는 함수
const isClHtml = (file) => {
  return file.basename === "cl.html";
};

// 공통 fileInclude 처리를 위한 함수
const applyFileInclude = () => {
  return fileInclude({
    prefix: "@@",
    basepath: "@file",
    // basepath: projectPaths.pagesInclude,
  });
};

// Prettier를 적용하는 별도의 빌드용 작업
const applyPrettier = () => {
  return gulp
    .src(projectPaths.pagesPrettier) // 대상 경로 설정
    .pipe(beautify(beautifyOptions))
    .pipe(gulp.dest(destFolder));
};

// fileInclude 처리를 위한 별도의 함수
const htmlInclude = () => {
  return gulp
    .src(projectPaths.pagesIncludeSrc, {
      base: srcFolder,
      allowEmpty: true,
    })
    .pipe(replacePathPatterns())
    .pipe(applyFileInclude())
    .pipe(replacePathPatterns())
    .pipe(gulp.dest(destFolder))
    .pipe(plugins.browserSync.stream());
};

const html = (isBuild) => {
  return (
    gulp
      .src(projectPaths.pagesSrc, { base: srcFolder, allowEmpty: true })
      .pipe(logger.handleError("HTML"))
      .pipe(plugins.changed(destFolder))
      .pipe(replacePathPatterns())
      .pipe(applyFileInclude())
      // cl.html 파일에만 replace 작업 적용
      .pipe(
        plugins.if(
          isClHtml,
          plugins.replace("uxdevLinkFolder", projectDirName),
        ),
      )
      .pipe(replacePathPatterns())
      .pipe(gulp.dest(destFolder))
      .pipe(plugins.browserSync.stream())
  );
};

export { html, htmlInclude, applyPrettier };
