let path = require("path");
let _ = require("lodash");
const sharp = require("sharp");
let mkdirp = require("mkdirp");

class SvgToPngExport {
  constructor(config) {
    this.name = "SvgToPngExport";
    this.defaults = _.defaultsDeep({}, config, {
      outputDir: "./png",
      density: 300,
      format: "png"
    });
  }
  getSettings(request) {
    if (request.svgToPng) {
      return request.svgToPng;
    } else if (request.SvgToPngExport) {
      return request.SvgToPngExport;
    } else {
      request.svgToPng = {};
      return request.svgToPng;
    }
  }
  prepare(request) {
    _.defaultsDeep(this.getSettings(request), this.defaults);
  }
  async runAsync(request, response) {
    if (!response.svg) {
      return response;
    }
    const settings = this.getSettings(request);
    let fileName = "default";
    if (_.isFunction(settings.fileName)) {
      fileName = settings.fileName.call(this, request, response);
    } else if (_.isString(settings.fileName)) {
      fileName = settings.fileName;
    } else if (request.inputPath) {
      fileName = this.getFileName(request.inputPath);
    }
    const absoluteOutputDir = path.resolve(process.cwd(), settings.outputDir);
    const filePath = absoluteOutputDir + "/" + fileName + ".png";

    // Graphviz svg font sizes are missing a size format (font-size="10.00") and are interpreted by sharp (librsvg) as pixel sizes.
    // Because of this if density is increased, Sharp (librsvg) will not scale the text with the rest of the image.
    // To avoid this we have to change all font-sizes to explicit point sizes.
    // Normally 10px should be converted to 7.5pt and 8px should be converted to 6pt
    // For some unknown reason this leads to wrong results
    // Instead 10px has to be convertd to 9pt and 8px has to be converted to 7.5pt to obtain satisfactory results.
    // This will break if font sizes or if the viz.js svg output change. :(
    let convertedSvg = response.svg;
    convertedSvg = this.replaceAll(convertedSvg, 'font-size="10.00"', 'font-size="9pt"');
    convertedSvg = this.replaceAll(convertedSvg, 'font-size="8.00"', 'font-size="7.5pt"');

    await new Promise((resolve, reject) => {
      mkdirp(absoluteOutputDir, function(err) {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
    if (settings.width && settings.height) {
      await sharp(new Buffer(convertedSvg), { density: settings.density })
        .resize(settings.width, settings.height)
        .max()
        .png()
        .toFile(filePath);
    } else {
      await sharp(new Buffer(convertedSvg), { density: settings.density })
        .png()
        .toFile(filePath);
    }
    return response;
  }
  getFileName(file) {
    let extension = path.extname(file);
    return path.basename(file, extension);
  }
  replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, "g"), replace);
  }
}
module.exports = {
  SvgToPngExport: SvgToPngExport
};
