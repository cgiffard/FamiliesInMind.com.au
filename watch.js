#!/usr/bin/env node

var chokidar = require("chokidar"),
	exec = require("child_process").exec,
	dir = __dirname.split(/\//);

process.chdir(__dirname);
console.log("Working from %s.", process.cwd());

/*
	Public: waits a given number of milliseconds before calling the supplied
	function. If this method is called again with the same function, the timer
	will reset.

	Examples

		wait(50, func);

	Returns a the result of an internal setTimeout call.

*/
function wait(timeout, func) {
	if (func._u_timeout) {
		clearTimeout(func._u_timeout);
	}

	func._u_timeout = setTimeout(function() {
		delete func._u_timeout;
		func();
	}, timeout);
}

function build() {
	console.log("Triggering rebuild...");
	exec("make", { "cwd": process.cwd() },
		function(err, stdout, stderr) {
			if (err) throw err;

			console.log("\nBuild complete.");
			console.log(stdout);
			console.error(stderr);
		});
}

function start() {
	chokidar
		.watch(process.cwd())
		.on("add",reload)
		.on("change",reload)
		.on("unlink",reload);
}

function reload(file) {
	if (file.match(/node_modules/)) return;
	if (file.match(/build/)) return;
	if (file.match(/.git/)) return;

	console.log("%s changed.",file);
	wait(100, build);
}

process.nextTick(start);

// Keep process running. Stupid chokidar won't hold it
// open for some reason.
setInterval(function() {},1000);
