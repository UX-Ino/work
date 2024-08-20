import gulp from "gulp";
import chokidar from "chokidar";
import { __dirname, isBuild, destFolder, srcFolder, projectPaths } from "./gulp/config/paths.js";

/**
 * 작업 가져오기
 */
import { copy } from "./gulp/tasks/copy.js";
import { reset } from "./gulp/tasks/reset.js";
import { html, htmlInclude, applyPrettier } from "./gulp/tasks/html.js";
import { server } from "./gulp/tasks/server.js";
import { scss } from "./gulp/tasks/scss.js";
import { javascript } from "./gulp/tasks/javascript.js";
import { images } from "./gulp/tasks/images.js";
import { fonts } from "./gulp/tasks/fonts.js";
import { zip } from "./gulp/tasks/zip.js";
import { ftpDeploy } from "./gulp/tasks/ftpDeploy.js";
import { sftpDeploy } from "./gulp/tasks/sftpDeploy.js";
import { validateHtml } from "./gulp/tasks/validateHtml.js";
import { validateStyle } from "./gulp/tasks/validateStyle.js";
import { svgToScssMixin } from "./gulp/tasks/svgToScssMixin.js";

const handleHTML = html.bind(null, isBuild);
const handleHtmlInclude = htmlInclude.bind(null, isBuild);
const handleHtmlPrettier = applyPrettier.bind(null, isBuild);
const handleSCSS = scss.bind(null, isBuild);
// const handleJS = javascript.bind(null, !isBuild);
const handleJS = javascript;
const handleImages = images.bind(null, isBuild);
const handleFonts = fonts.bind(null, isBuild);

/**
 * 파일 변경 관찰자
 */
// function watcher() {
//   gulp.watch(projectPaths.publicSrc, copy);
//   gulp.watch(projectPaths.pagesSrc, handleHTML);
//   gulp.watch(projectPaths.pagesIncludeWatch, handleHtmlInclude);
//   gulp.watch(projectPaths.stylesSrc, handleSCSS);
//   gulp.watch(projectPaths.scriptsSrc, handleJS);
//   gulp.watch(projectPaths.imagesSrc, handleImages);
//   gulp.watch(projectPaths.fontsSrc, handleFonts);
// }

/**
 * 파일 변경 관찰자 - choliker 사용
 */
function createWatcher(path, handler) {
  const watcherOptions = {
    ignoreInitial: true,
    usePolling: true,
    interval: 100,
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 100,
    },
  };

  const watcher = chokidar.watch(path, watcherOptions);
  watcher.on("all", handler);
  return watcher;
}

function watcher() {
  const publicWatcher = createWatcher(projectPaths.publicSrc, () => {
    gulp.series(copy)();
  });

  const htmlWatcher = createWatcher(projectPaths.pagesSrc, () => {
    gulp.series(handleHTML)();
  });

  const htmlIncludeWatcher = createWatcher(projectPaths.pagesIncludeWatch, () => {
    gulp.series(handleHtmlInclude)();
  });

  const scssWatcher = createWatcher(projectPaths.stylesSrc, () => {
    gulp.series(handleSCSS)();
  });

  const jsWatcher = createWatcher(projectPaths.scriptsSrc, () => {
    gulp.series(handleJS)();
  });

  const imagesWatcher = createWatcher(projectPaths.imagesSrc, () => {
    gulp.series(handleImages)();
  });

  const fontsWatcher = createWatcher(projectPaths.fontsSrc, () => {
    gulp.series(handleFonts)();
  });

  // 여기에 추가적인 watch 로직을 구현하세요.
}

/**
 * 개발 모드의 병렬 작업
 * */
const devTasks = gulp.parallel(copy, handleSCSS, handleJS, handleImages, handleFonts);
/**
 * 빌드 모드의 병렬 작업
 * */
const buildTasks = gulp.parallel(copy, handleSCSS, handleJS, handleImages, handleFonts);

/**
 * 주요 목표
 * */
const mainTasks = gulp.series(devTasks, handleHtmlInclude, handleHTML);
const productTasks = gulp.series(buildTasks, handleHtmlInclude, handleHTML);

/**
 * 작업 실행 시나리오 구축
 * */
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, productTasks, handleHtmlPrettier);

const checkhtml = gulp.series(validateHtml);
const checkstyle = gulp.series(validateStyle);
const backupZIP = gulp.series(zip);
const deployFTP = gulp.series(reset, productTasks, ftpDeploy);
const deploySFTP = gulp.series(reset, productTasks, sftpDeploy);
const svg = gulp.series(svgToScssMixin);

/**
 * 기본 스크립트 실행
 * */
gulp.task("default", dev);

/**
 * 스크립트 내보내기
 * */
export { dev, build, backupZIP, deployFTP, deploySFTP, checkhtml, checkstyle, svg };
