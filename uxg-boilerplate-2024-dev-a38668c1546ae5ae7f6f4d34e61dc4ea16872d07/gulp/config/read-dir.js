import { promises } from "fs";
import { extname } from "path";

export const readDir = async (directoryPath) => {
  const result = {};
  try {
    const files = await promises.readdir(directoryPath);
    // 확장자가 .js인 파일 필터링
    const jsFiles = files.filter((file) => extname(file) === ".js");
    // 찾은 .js 파일을 출력합니다.
    console.log("JS files in directory: ", jsFiles);

    jsFiles.forEach((file) => {
      const [name] = file.split(".");
      result[name] = `./${file}`;
    });

    return result;
  } catch (err) {
    console.error("Error reading directory:", err);
  }
};
