import gulp, { parallel } from "gulp";
import concat from "gulp-concat";
import order from "gulp-order";
import sourcemaps from "gulp-sourcemaps";
import webpack from "webpack-stream";
import map from 'map-stream'
import Vinyl from 'vinyl'
import stream from 'stream'
import tap from 'gulp-tap'
import path from 'path'
import newfile from 'gulp-file'
import {parse as AcornParse} from "acorn";

import { webpackConfig } from "../../webpack.config.js";
import { plugins } from "../config/plugins.js";
import {
  __dirname,
  projectDirName,
  isBuild,
  destFolder,
  srcFolder,
  projectPaths,
} from "../config/paths.js";
import { logger } from "../config/Logger.js";

// 프로젝트 경로를 변경하기 위한 함수
import { replacePathPatterns } from "../config/replacePathPatterns.js";

// codinglist.js 파일인지 확인하는 함수
const isCodinglistJS = (file) => {
  return file.basename === "codinglist.js";
};
/**
 *
 * @param file  {File}
 * @returns {boolean}
 */
const isUIJS = (file) => {
  console.log(file.dirname, file.basename, file.dirname.includes('assets\\scripts\\ui') && file.extname === '.js');
  // console.log(file.dirname, file.basename, file.name, file.extname);
  return file.dirname.includes('assets\\scripts\\ui') && file.extname === '.js';

}

// 현재 모드에 따라 적절한 경로 설정을 선택합니다.
const projectPathsTrans = isBuild ? "projectPathsBuild" : "projectPathsDev";

const javascriptLib = async (isDev) => {
  return (
    gulp
      .src(projectPaths.scriptsLibSrc)
      .pipe(logger.handleError("JS"))
      // .pipe(sourcemaps.init())
      .pipe(order([
        'tabbable.js',
        "focus-trap.js",
        "gsap.js",
        "SplitText.min.js",
        "swiper-bundle.min.js",
      ]))
      .pipe(concat("/assets/scripts/common.ui.plugin.js", {newLine: '\n;\n\n\n\n\n'}))
      // .pipe(sourcemaps.write())
      .pipe(gulp.dest(destFolder))

      // .pipe(plugins.browserSync.stream())
  );
};

function getFunctionName(code){
  const ast = AcornParse(code, { ecmaVersion: 2023 });

  return ast.body
    .filter(node => {
      return node.type === "FunctionDeclaration"
    })
    .map(node => node.id.name)
}

const javascriptConcat = (srcPath, category) => {
  let arrFileList = [];
  let contents = '';

  gulp
    .src([...srcPath, '!**/*.spec.js'])
    .pipe(map(function(file, cb) {
      const fileContents = file.contents.toString();
      if(category === 'components' || category === 'hooks' || category === 'utils'){
        arrFileList = [...arrFileList, ...getFunctionName(fileContents)]
      }

      let arrFunction = arrFileList.map((v) => `\t${v.replace('.js', '')}`)
      contents = `
etUI.${category} = {
${arrFunction.join(',\n')}
}
`
      // console.log('contents', contents);
      cb(null, file);
    }))
    .pipe(tap(function(file){
      const fileName = `assets/scripts/ui/${category}/index.cjs`;
      return newfile(fileName, contents)
        .pipe(gulp.dest(srcFolder));
    }))
    // .pipe(string_src(category+"/index.js", contents))
    // .pipe(gulp.dest(srcFolder))
    // .pipe(plugins.browserSync.stream())
}


const javascriptUtils = async (isDev) => {
  javascriptConcat(
    [projectPaths.scriptsUIUtilsSrc],
    'utils'
  )
}

const javascriptHooks = async (isDev) => {
  javascriptConcat(
    [projectPaths.scriptsUIHooksSrc],
    'hooks'
  )
}

const javascriptComponents = async (isDev) => {
  javascriptConcat(
    [projectPaths.scriptsUIComponentsSrc],
    'components'
  )
}

const javascriptUI = async (isDev) => {
  await new Promise(r => setTimeout(r, 100));

  return (
    gulp
      .src([projectPaths.scriptsUISrc, '!**/*.spec.js'])
      .pipe(sourcemaps.init())
      .pipe(order([
        'setup.js',
        "utils/**/*.js",
        "utils/index.cjs",
        "hooks/**/*.js",
        "hooks/index.cjs",
        "components/**/*.js",
        "components/index.cjs",
        "init.js",
      ]))
      .pipe(concat("/assets/scripts/common.ui.js", {newLine: ';\n\n\n'}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(destFolder))

      .pipe(plugins.browserSync.stream())
  );
};

const javascriptOther = async (isDev) => {
  return (
    gulp
      .src([projectPaths.scriptsSrc, `!${projectPaths.scriptsUISrc}`, `!${projectPaths.scriptsLibSrc}`])

      // codinglist.js 파일에만 replace 작업 적용
      .pipe(
        plugins.if(
          isCodinglistJS,
          plugins.replace("uxdevLinkFolder", projectDirName)
        )
      )

      // codinglist.js 파일에만 replace 작업 적용
      // 코딩리스트의 경로를 변경하기 위한 작업
      .pipe(
        plugins.if(
          isCodinglistJS,
          plugins.replace("projectPathsTrans", projectPathsTrans)
        )
      )

      // 여기에서 replacePathPatterns 함수를 사용
      .pipe(replacePathPatterns())

      .pipe(gulp.dest(destFolder))
      // .pipe(plugins.browserSync.stream())
  );
};
const javascript =
  gulp.series(
    gulp.parallel(javascriptUtils, javascriptHooks, javascriptComponents),
    gulp.parallel(javascriptLib, javascriptUI, javascriptOther),
  )

export { javascript };
