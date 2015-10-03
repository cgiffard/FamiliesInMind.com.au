#!/usr/bin/env node

var jade		= require("jade"),
	myth		= require("myth"),
	fs		= require("fs"),
	path		= require("path"),
	after	= require("after"),
	colors	= require("colors");

const OUT_DIR			= path.join(__dirname, "build");
const CONTENT_DIR		= path.join(__dirname, "content");
const PATH_HTACCESS		= path.join(OUT_DIR, ".htaccess");

// Load the list of pages
var pages = require("./manifest.json");

var buildStages = [
	generateHtAccess.bind(null, pages, fs.createWriteStream(PATH_HTACCESS)),
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

function generateHtAccess(pages, outStream, done) {
	console.log(
		"Writing .htaccess rewrites to build directory (%s)...",
		PATH_HTACCESS);

	// Subtracting 1 from the page length because we don't rewrite the home page
	var next =
		after(Object.keys(pages).length + 1, function() {
			console.log(".htaccess written.".cyan);
			outStream.end();
			done();
		});

	outStream.write("RewriteEngine On\n", "utf8", next);
	outStream.write("RewriteBase /\n", "utf8", next);

	Object.keys(pages)
		.map(function(page) {
			pages[page].path = page;
			return pages[page];
		})
		.filter(function(page) {
			// the root path already redirects to index.html, so we don't
			// need to do anything tricky here.
			return page.path != "/";
		})
		.forEach(function(page) {
			var path = page.path.replace(/^\//, "");
			var rule = "RewriteRule ^" + path + "$ " + path + ".html";
			console.log(rule.dim);
			outStream.write(rule + "\n", "utf8", next);
		});
}

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
			var pagePath = page.path === "/" ? "index" : page.path,
				templateFullPath = path.join(CONTENT_DIR, page.template),
				htmlOutputPath = path.join(OUT_DIR, pagePath + ".html"),
				template;

			console.log("Checking %s".dim, templateFullPath);

			// This'll throw if the template doesn't exist
			template = fs.readFileSync(templateFullPath, "utf8")
			template =
				jade.compile(template, {
					filename: templateFullPath,
					pretty: true
				});

			fs.writeFileSync(
				htmlOutputPath,
				template({ page: page, nav: array}));

			console.log("-  Written out to %s".dim, htmlOutputPath);
		});

	done();
}