import chalk from "chalk";
import { exec } from "child_process";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import os from "os";
import { globSync } from "glob";
import fs from "fs";

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

const argv = yargs(hideBin(process.argv)).argv;

const validateHtml = (done) => {
  const folder = argv.folder
    ? `${argv.folder}/**/*.html`
    : projectPaths.htmlValidationSrc;

  const srcPattern = Array.isArray(folder) ? folder : [folder];
  const ignorePatterns = ["dist/guide/**", "dist/pages/include/**"];

  const patterns = srcPattern.concat(
    ignorePatterns.map((pattern) => `!${pattern}`),
  );

  console.log("Validating HTML files in:", patterns);

  const files = srcPattern.reduce((acc, pattern) => {
    return acc.concat(
      globSync(pattern.replace(/\\/g, "/"), { ignore: ignorePatterns }),
    );
  }, []);

  if (files.length === 0) {
    console.log(chalk.yellow("No HTML files found for validation."));
    done();
    return;
  }

  const normalizedFiles = files.map((file) => path.posix.normalize(file));
  const isWindows = os.platform() === "win32";
  const finalFiles = isWindows
    ? normalizedFiles.map((file) => path.win32.normalize(file))
    : normalizedFiles;

  let hasError = false;
  let hasWarning = false;
  let completed = 0;

  // 현재 날짜와 시간을 가져와서 포맷팅
  const now = new Date();
  const formattedDate =
    now.getFullYear() +
    ("0" + (now.getMonth() + 1)).slice(-2) +
    ("0" + now.getDate()).slice(-2) +
    "-" +
    ("0" + now.getHours()).slice(-2) +
    ("0" + now.getMinutes()).slice(-2) +
    ("0" + now.getSeconds()).slice(-2);

  const resultFilePath = path.join(
    process.cwd(),
    `src/guide/pages/validation/html-validation-results-${formattedDate}.txt`,
  );

  // 디렉토리가 존재하지 않으면 생성
  const dirPath = path.dirname(resultFilePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(resultFilePath, "HTML Validation Results\n\n", "utf-8");

  const validateFile = (file, callback) => {
    const command = `npx html-validate ${file.replace(/\\/g, "/")}`;

    exec(
      command,
      { shell: true, maxBuffer: 1024 * 500 },
      (err, stdout, stderr) => {
        const outputLines = (stderr + stdout).split("\n");
        let coloredOutput = "";

        outputLines.forEach((line) => {
          if (line.includes("warning")) {
            coloredOutput += chalk.yellow(line) + "\n";
            hasWarning = true;
          } else if (line.includes("error")) {
            coloredOutput += chalk.red(line) + "\n";
            hasError = true;
          } else {
            coloredOutput += line + "\n";
          }
        });

        if (hasError || stderr) {
          console.error(chalk.red(`Validation error in file: ${file}`));
          console.error(coloredOutput);
        } else if (hasWarning) {
          console.warn(`Validation result for file: ${file}\n${coloredOutput}`);
        } else {
          console.log(`Validation result for file: ${file}\n${coloredOutput}`);
        }

        const fileOutput = stderr + stdout;
        fs.appendFileSync(
          resultFilePath,
          `Validation result for file: ${file}\n${fileOutput}\n`,
          "utf-8",
        );
        callback();
      },
    );
  };

  // 현재 날짜와 시간 가져오기
  const startTime = now.toLocaleString();
  console.log(chalk.blue(`HTML validation started at: ${startTime}`));
  fs.appendFileSync(
    resultFilePath,
    `HTML validation started at: ${startTime}\n\n`,
    "utf-8",
  );

  finalFiles.forEach((file) => {
    validateFile(file, () => {
      completed++;
      if (completed === finalFiles.length) {
        if (hasError) {
          console.log(chalk.red("HTML validation completed with errors."));
          fs.appendFileSync(
            resultFilePath,
            "HTML validation completed with errors.\n",
            "utf-8",
          );
        } else if (hasWarning) {
          console.log(chalk.yellow("HTML validation completed with warnings."));
          fs.appendFileSync(
            resultFilePath,
            "HTML validation completed with warnings.\n",
            "utf-8",
          );
        } else {
          console.log(chalk.green("HTML validation completed successfully."));
          fs.appendFileSync(
            resultFilePath,
            "HTML validation completed successfully.\n",
            "utf-8",
          );
        }
        done();
      }
    });
  });
};

export { validateHtml };
