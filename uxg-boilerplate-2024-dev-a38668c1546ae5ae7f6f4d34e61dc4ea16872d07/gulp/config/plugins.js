import replace from "gulp-replace"; // 검색하고 바꾸기
import browserSync from "browser-sync"; // 로컬 서버
import newer from "gulp-newer"; // 업데이트를 확인
import ifPlugin from "gulp-if"; // 조건부 분기
import changed from "gulp-changed"; // 변경된 파일만 다시 컴파일
import cached from "gulp-cached"; // 파일 내용을 메모리에 캐쉬
import prettier from "gulp-prettier"; // 코드 스타일 자동 정리

const concatPathAndFileName = (path, files) => {
  return files.map((file) => `${path}/${file}`);
};

export const plugins = {
  if: ifPlugin,
  replace,
  browserSync,
  newer,
  changed,
  cached,
  prettier,
  concat: concatPathAndFileName,
};
