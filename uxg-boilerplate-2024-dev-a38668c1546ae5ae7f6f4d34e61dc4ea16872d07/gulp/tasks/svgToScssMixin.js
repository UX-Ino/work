import fs from "fs/promises";
import path from "path";
import gulp from "gulp";

const svgToScssMixin = async () => {
  const jsonFilePath = path.join("src/assets/scripts/uiComp/", "svgIcons.json");
  const scssFilePath = path.join("src/assets/styles/abstracts/", "_svg.scss");

  try {
    const data = await fs.readFile(jsonFilePath, { encoding: "utf-8" });
    const svgs = JSON.parse(data);
    let scssContent = "";

    svgs.forEach((svgObj) => {
      const { className, svg } = svgObj;
      const encodedSvg = encodeURIComponent(svg).replace(/%3D/g, "=").replace(/%20/g, " ").replace(/%7B/g, "{").replace(/%7D/g, "}").replace(/%24/g, "$").replace(/%23/g, "#");

      const mixinName = className.replace(/-/g, "_");
      scssContent += `@mixin ${mixinName}($color) {
  $${mixinName}: "data:image/svg+xml,${encodedSvg}";
  background-image: url($${mixinName});
}
\n`;
    });

    await fs.writeFile(scssFilePath, scssContent);
    console.log("SCSS mixins generated successfully.");
  } catch (err) {
    console.error("Error processing file:", err);
  }
};

export { svgToScssMixin };
