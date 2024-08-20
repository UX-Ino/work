# uxg-boilerplate-2024

### 2024.06.12 - v0.5.2

---

## NVM 설치

NVM (Node Version Manager)은 Node.js 버전을 관리하는 프로그램입니다. 다양한 Node.js 버전을 쉽게 설치, 제거, 전환할 수 있게 해주어, 서로 다른 프로젝트에서 각기 다른 Node.js 버전을 필요로 할 때 매우 유용합니다. NVM을 사용하면 특정 버전의 Node.js를 전역으로 또는 프로젝트별로 관리할 수 있어, 버전 호환성 문제를 해결하는 데 도움이 됩니다.

> NVM 설치 방법
>
> - windows : https://sharryhong.github.io/2016/12/20/nodejs-nvm/
> - mac : https://gist.github.com/falsy/8aa42ae311a9adb50e2ca7d8702c9af1
> - NVM Lastest : https://github.com/coreybutler/nvm-windows/releases For window only

## Gulp 설치

```js
// 실행 명령어
// node 버전은 16이상이여야 합니다.
$ nvm install v16.19.0
$ nvm use 16.19.0
$ node -v
v16.19.0
```

## Gulp CLI

gulp-cli는 Gulp 작업을 실행하기 위한 커맨드 라인 인터페이스(CLI) 도구입니다. 이 모듈은 시스템 전역에 설치되어, 개발자가 명령 프롬프트나 터미널을 통해 Gulp 작업을 쉽게 실행할 수 있게 해줍니다. gulp-cli를 사용하면 로컬 또는 전역에 설치된 Gulp를 구동할 수 있으며, 다양한 프로젝트에서 각기 다른 Gulp 버전을 사용하는 것을 용이하게 합니다. 이는 Gulp 기반의 자동화된 빌드 및 개발 작업을 관리하는 데 필수적인 도구입니다.

```js
// nvm으로 설치한 노드 버전별로 설치되어야 합니다.
$ npm i -g gulp-cli
```

## Gulp 실행

```js
// vscode 실행 프로젝트 폴더로 이동 후 터미널 오픈

// 노드모듈 설치
$ npm install
// gulp 실행
$ npm run dev
// build
$ npm run build
// backup
$ npm run bak
// uxdev.etribe.co.kr SFTP upload
$ npm run sftp
```

### 코딩리스트 CSV 온라인 오프라인 설정방법 (2023.01.13추가)

온라인 설정: https://flow.team/l/0Vt2L (구글시트연동)

> - codinglist.js 안의 mySpreadsheet 링크: https://docs.google.com/spreadsheets/d/1eRDz98xdM30x3OdsWLortiN1jbcLIf54NNPbIYn1cZ4/edit#gid=0 를 복사
> - 위 링크 양식을 복사후 새로만든 코딩리스트에 붙여넣기
> - 새로만든 코딩리스트 Share(공유)클릭
> - 권한설정을 Anyone width the link 로 변경 및 권한을 Viewer 에서 Editor로 변경후 Done클릭
> - 구글시트 URL 복사후 codinglist.js 안의 mySpreadsheet 링크를 변경
> - 코딩리스트 페이지를 새로고침후 확인

오프라인 설정: https://flow.team/l/0VxaJ (csv 파일 연결)

> - 코딩리스트 실행
> - 구글시트에서 파일-> 다운로드 ->csv 다운로드 csv 파일 생성하기
> - codinglist.js 에서 csv관련 코드 주석해제 하기 (// 구글닥스 연동 ,// 로컬 CSV 데이터 연동)
> - vscode 확장프로그램인 edit csv 설치하기
> - 다운로드 받은 csv 파일을 edit csv 확장프로그램으로 수정하기
> - 수정된 내용이 코딩리스트에 잘 적용되는지 확인하기

!주의사항!

> - cl.csv는 로컬서버가 실행되어야 합니다.
> - vscode liveServer 또는 http-server 모듈을 사용하면 됩니다.
