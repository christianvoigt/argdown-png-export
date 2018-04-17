const path = require("path");
const SvgToPngExport = require("../index.js").SvgToPngExport;

let pluginSettings = {
  outputDir: path.resolve(__dirname, "./png/"), // the folder where you want to store your png files
  width: 2000, // the width of the pdf file (if height <= width)
  height: 2000, // the height of the pdf file (if width <= height)
  density: 300 // the dpi (pixel per inch density)
};
const pngExport = new SvgToPngExport(pluginSettings);

module.exports = {
  config: {
    logLevel: "verbose",
    process: ["preprocessor", "parse-input", "build-model", "export-dot", "export-svg", "export-png"],
    plugins: [{ plugin: pngExport, processor: "export-png" }],
    input: "[Statement 1]: text"
  }
};
