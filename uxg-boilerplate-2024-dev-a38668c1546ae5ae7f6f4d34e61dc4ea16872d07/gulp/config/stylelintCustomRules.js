import stylelint from "stylelint";
import fs from "fs";
import path from "path";

import {
  __dirname,
  projectDirName,
  isBuild,
  destFolder,
  srcFolder,
  projectPaths,
  projectReplacePaths,
} from "./paths.js";

const createRule = (ruleName, message, checkProp, checkValue, targetProp) => {
  const messages = stylelint.utils.ruleMessages(ruleName, {
    expected: message,
  });

  return stylelint.createPlugin(ruleName, function (enabled) {
    return (root, result) => {
      if (!enabled) return;
      root.walkDecls(checkProp, (decl) => {
        if (decl.value === checkValue) {
          decl.parent.walkDecls(new RegExp(targetProp), (declChild) => {
            stylelint.utils.report({
              message: messages.expected,
              node: declChild,
              result,
              ruleName,
            });
          });
        }
      });
    };
  });
};

const createClassRule = (ruleName, message, checkType, checkValues) => {
  const messages = stylelint.utils.ruleMessages(ruleName, {
    expected: message,
  });

  // checkValues가 배열인지 확인
  const values = Array.isArray(checkValues) ? checkValues : [];

  return stylelint.createPlugin(ruleName, function (enabled) {
    return (root, result) => {
      if (!enabled) return;
      root.walkRules((rule) => {
        rule.selectors.forEach((selector) => {
          const classNames = selector.match(/\.[a-zA-Z0-9_-]+/g) || [];
          classNames.forEach((className) => {
            className = className.slice(1); // Remove the leading dot
            // console.log(`Checking className: ${className}`); // 디버그 로그 추가
            values.forEach((checkValue) => {
              // console.log(`Against value: ${checkValue}`); // 디버그 로그 추가
              const message =
                checkType === "prefix"
                  ? `Class name should not start with "${checkValue}"`
                  : `Class name should not end with "${checkValue}"`;
              if (checkType === "prefix" && className.startsWith(checkValue)) {
                stylelint.utils.report({
                  message,
                  node: rule,
                  result,
                  ruleName,
                });
              } else if (
                checkType === "suffix" &&
                className.endsWith(checkValue)
              ) {
                stylelint.utils.report({
                  message,
                  node: rule,
                  result,
                  ruleName,
                });
              }
            });
          });
        });
      });
    };
  });
};

const rulesConfigPath = path.resolve(__dirname, "stylelintRulesConfig.json");
const rulesConfig = JSON.parse(fs.readFileSync(rulesConfigPath, "utf8"));

const rules = rulesConfig.map((config) => {
  if (config.checkType) {
    return createClassRule(
      config.ruleName,
      config.message,
      config.checkType,
      config.checkValues,
    );
  }
  return createRule(
    config.ruleName,
    config.message,
    config.checkProp,
    config.checkValue,
    config.targetProp,
  );
});

export default rules;
