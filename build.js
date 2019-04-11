#!/usr/bin/env node

var jade = require("jade"),
  fs = require("fs"),
  path = require("path"),
  mkdirp = require("mkdirp"),
  after = require("after"),
  colors = require("colors");

const OUT_DIR = path.join(__dirname, "build");
const CONTENT_DIR = path.join(__dirname, "content");

// Load the list of pages
var pages = require("./manifest.json");

var buildStages = [
  compilePages.bind(null, pages),
];

// Guts
// For this little thing I'm not worrying about the (err, data) convention
(function doBuildStage(stageList, idx) {
  if (!stageList.length) {
    return console.log("\nBuild process complete!".green.underline);
  }

  process.stdout.write("\n");

  var stage = stageList[0];
  idx = idx || 1;

  console.log("Commencing build stage %d".white.underline, idx);
  stage(doBuildStage.bind(null, stageList.slice(1), idx+1));
})(buildStages);

// Jade compilation
function compilePages(pages, done) {
  Object.keys(pages)
    .map(function(page) {
      // This is mutating the original page object but I'm pretending
      // it's not. Can't be arsed req'ing lodash just to clone an object
      pages[page].path = page;
      return pages[page];
    })
    .forEach(function(page, index, array) {
      var templateFullPath = path.join(CONTENT_DIR, page.template),
        htmlOutDir = path.join(OUT_DIR, page.path),
        htmlOutputPath = path.join(htmlOutDir + "/index.html"),
        template;

      console.log("Checking %s".dim, templateFullPath);

      // This'll throw if the template doesn't exist
      template = fs.readFileSync(templateFullPath, "utf8")
      template =
        jade.compile(template, {
          filename: templateFullPath,
          pretty: true
        });

      mkdirp.sync(htmlOutDir);

      fs.writeFileSync(
        htmlOutputPath,
        template({ page: page, nav: array}));

      console.log("-  Written out to %s".dim, htmlOutputPath);
    });

  done();
}
