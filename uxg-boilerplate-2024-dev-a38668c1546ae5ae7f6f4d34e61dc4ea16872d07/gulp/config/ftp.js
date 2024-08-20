import fs from "fs";
import { __dirname, isBuild, destFolder, srcFolder, projectPaths } from "./paths.js";

const configFTP = {
  host: "", // FTP 서버 주소
  user: "", // 사용자 이름
  password: "", // 비밀번호
  parallel: 20, // 동시 스레드 수
};

const configSFTP = {
  host: "3.37.180.169", // SFTP 서버 주소
  username: "uxdev", // 사용자 이름
  privateKey: fs.readFileSync(projectPaths.ftpKey), // PEM 키 파일 경로
};

export { configFTP, configSFTP };
