import plumber from "gulp-plumber"; // 오류 처리 중
import notify from "gulp-notify"; // 메시지(힌트)
import chalk from "chalk";

class Logger {
  handleError(taskName) {
    return plumber({
      errorHandler: notify.onError({
        title: taskName,
        message:
          "Error: <%= error.message %> in <%= error.fileName || 'unknown file' %>",
      }),
    });
  }

  // handleError(taskName) {
  //   return plumber({
  //     errorHandler: notify.onError({
  //       title: taskName,
  //       // 오류 메시지에 파일 이름(또는 경로)을 추가합니다.
  //       message:
  //         "Error: <%= error.message %> in <%= error.fileName || 'unknown file' %>",
  //       templateOptions: {
  //         // `error.fileName`을 사용하여 오류가 발생한 파일의 이름을 가져옵니다.
  //         // 일부 경우에는 이 속성이 다르게 명명되거나 존재하지 않을 수 있으니, 오류 객체의 구조를 확인해야 할 수도 있습니다.
  //         error: {
  //           fileName: function (error) {
  //             return error.file ? error.file.path : "Unknown file";
  //           },
  //         },
  //       },
  //     }),
  //   });
  // }

  warning(message) {
    console.log(chalk.bold.white.bgGreenBright(message));
  }

  error(message, errors = []) {
    console.log(chalk.bold.white.bgRed(message), errors);
  }
}

export const logger = new Logger();
