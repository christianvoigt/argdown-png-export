const chai = require("chai");
chai.use(require("chai-fs"));
const expect = require("chai").expect;
const path = require("path");
const rimraf = require("rimraf");
const fs = require("fs");

const rimrafPromise = function(path) {
  return new Promise((resolve, reject) => {
    rimraf(path, {}, function(err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};
const execPromise = function(cmd, callback) {
  return new Promise((resolve, reject) => {
    require("child_process").exec(cmd, function(error, stdout, stderr) {
      if (error !== null) {
        reject(error);
      }
      callback(error, stdout, stderr);
      resolve();
    });
  });
};

describe("argdown-png-export", function() {
  this.timeout(20000);
  it("can create png file from map", () => {
    let pngFolder = path.resolve(__dirname, "./png/");
    let configPath = path.resolve(__dirname, "./argdown.config.js");
    let filePathToPng = path.resolve(__dirname, "./png/default.png");
    let filePathToCli = path.resolve(__dirname, "../node_modules/argdown-cli/lib/src/cli.js");
    //const cmd = "node " + filePathToCli + " -v --config " + configPath;
    const cmd = "node " + filePathToCli + " --verbose --config " + configPath;
    return rimrafPromise(pngFolder)
      .then(() => {
        return execPromise(cmd, (error, stdout, stderr) => {
          console.log(stdout);
          expect(error).to.equal(null);
          expect(stderr).to.equal("");
          expect(filePathToPng).to.be.a.file();
        });
      })
      .then(() => {
        return rimrafPromise(pngFolder);
      });
  });
});
