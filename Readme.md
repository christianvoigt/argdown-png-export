# PNG Export for argdown-cli

This is a plugin for [argdown-cli](https://github.com/christianvoigt/argdown-cli) that will export Argdown argument maps as png files. This plugin is not part of argdown-cli itself because it relies on binaries of the Sharp image library that can cause installation problems on some operating systems and in the Argdown VS Code extension (that also relies on argdown-cli).

# Usage

You can install the plugin globally or in your current project.

Global installation:

```bash
npm install -g argdown-png-export
```

Local installation:

```
npm install --save-dev argdown-png-export
```

Now you can add the plugin to argdown-cli in your argdown.config.js:

```Javascript
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
    plugins: [{ plugin: pngExport, processor: "export-png" }], // adds our plugin to the processor 'export-png'
    processes: { // processes defined here can be executed by using `argdown run [processName]`
        "export-png": ["preprocessor", "parse-input", "build-model", "export-dot", "export-svg", "export-png"]
    },
    process: "export-png" // the process to run if you simply call `argdown`
  }
};
```

You can now simply run `argdown` to export all `.argdown` files in your current folder to png files.
Alternatively you can use `argdown run export-png`.

# Adjusting the density parameter

If the png images are of low quality (pixelated) you have to increase the density parameter in the plugin settings. The default density is `300`. For more information on the density parameter read [this](https://github.com/lovell/sharp/issues/729).

## Installation problems under Linux

If the installation of argdown-png-export fails under Linux this may be caused by the sharp module being unable to build the library. Please take a look at [christianvoigt/argdown#47](https://github.com/christianvoigt/argdown/issues/47) for further information.
