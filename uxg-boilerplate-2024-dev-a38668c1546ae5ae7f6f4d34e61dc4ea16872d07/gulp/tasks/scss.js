import gulp from "gulp";
import gulpSass from "gulp-sass"; // gulp css preprocessors.
import * as sass from "sass"; // css preprocessors.
import cleanCss from "gulp-clean-css";
import sourcemaps from "gulp-sourcemaps";
import postcss from "gulp-postcss";
import presetEnv from "postcss-preset-env";
import mergeRules from "postcss-merge-rules";
import mergeIdents from "postcss-merge-idents";
import optSvgo from "postcss-svgo";
import dependents from "gulp-dependents";

import { plugins } from "../config/plugins.js";
import { logger } from "../config/Logger.js";
import {
  __dirname,
  isBuild,
  destFolder,
  srcFolder,
  projectPaths,
} from "../config/paths.js";

// 프로젝트 경로를 변경하기 위한 함수
import { replacePathPatterns } from "../config/replacePathPatterns.js";

const sassTranspile = gulpSass(sass);

// CleanCSS는 CSS를 압축하고 최적화하는 데 사용되는 도구 옵션 설정
const cleanCSSOptions = {
  compatibility: "ie11", // 여기에 원하는 cleanCSS 옵션을 추가
};

const presetEnvConfig = presetEnv({
  stage: 3,
  autoprefixer: {
    grid: false,
    cascade: false,
    overrideBrowserslist: [
      // 지원하려는 브라우저와 해당 버전을 나타내는 배열
      "> 1%",
      "last 3 versions",
      "defaults",
      "not dead",
      "not op_mini all",
      "ie >= 11",
      "Android >= 4.2",
      "iOS >= 6",
    ],
  },
});

const commonPostcssConfig = [
  // 공통 PostCSS 플러그인을 정의합니다.
  presetEnvConfig,
];
const postcssDevConfig = [
  // 개발 환경에서 사용할 PostCSS 플러그인을 정의합니다.
  presetEnvConfig,
];
const postcssBuildConfig = [
  // 빌드 환경에서 사용할 PostCSS 플러그인을 정의합니다.
  ...commonPostcssConfig,
  mergeRules(), // 중복된 규칙을 병합하여 코드 크기를 최적화합니다.
  mergeIdents(), // CSS 식별자를 병합하여 코드 크기를 최적화합니다.
  optSvgo({
    // SVG 최적화를 수행하여 SVG 파일 크기를 최소화합니다.
    encode: true, // SVG 파일을 인코딩하여 디코딩 속도를 향상시킵니다.
  }),
];

const scss = (isBuild) => {
  return (
    gulp
      .src(projectPaths.stylesSrc, { base: srcFolder, allowEmpty: true })
      .pipe(logger.handleError("SCSS"))
      // .pipe(plugins.changed(destFolder))
      // .pipe(plugins.newer(destFolder))
      // .pipe(plugins.cached('scss'))
      // .pipe(dependents())

      .pipe(plugins.if(!isBuild, sourcemaps.init()))

      .pipe(
        sassTranspile(
          {
            outputStyle: "expanded",
            indentWidth: 2, // 들여쓰기 크기를 2로 설정
          },
          null,
        ),
      )

      .pipe(postcss(isBuild ? postcssBuildConfig : postcssDevConfig))

      // build 시에만 CSS 파일을 압축합니다.
      .pipe(plugins.if(isBuild, cleanCss(cleanCSSOptions)))

      // 여기에서 replacePathPatterns 함수를 사용
      .pipe(replacePathPatterns())

      .pipe(plugins.if(!isBuild, sourcemaps.write(".")))
      .pipe(gulp.dest(destFolder))
      .pipe(plugins.browserSync.stream())
  );
};

export { scss };
