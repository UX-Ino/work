import { resolve, join } from "path";
import { readDir } from "./gulp/config/read-dir.js";

export const webpackConfig = async (isMode) => {
  const paths = {
    src: resolve("src"),
    build: resolve("dist"),
  };

  const context = join(paths.src, "assets", "scripts", "/");

  console.log("Source path:", paths.src);
  console.log("Build path:", paths.build);
  console.log("Context (entry base):", context);
  console.log("Output path:", resolve("dist", "assets", "scripts"));

  return {
    context,
    entry: await readDir(context),
    mode: isMode ? "development" : "production",
    output: {
      path: join(paths.build, "assets", "scripts", "/"),
      filename: "[name].min.js",
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },
  };
};
