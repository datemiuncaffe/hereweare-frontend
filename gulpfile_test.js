var gulp = require('gulp');
var gutil = require('gulp-util');
var print = require('gulp-print');
const changed = require('gulp-changed');

var fs = require('fs');
var path = require('path');
var through = require('through2');
var config = require('./gulpconfig.json');


gulp.task('print', function() {
	var path = '/home/federico/Documents/ehour/projects/hereweare-frontend/client/js/**';
	gutil.log('task print: ' + path);
	gulp.src(path)
    .pipe(print());
});

gulp.task('print-changed', function() {
	var sourcepath = ['/home/federico/Documents/ehour/projects/hereweare-frontend/**',
										// '!/home/federico/Documents/ehour/projects/hereweare-frontend/*.*',
										'!**/vendor','!**/node_modules','!**/build',
										'!**/vendor/**','!**/node_modules/**','!**/build/**'];
	gutil.log('(print-changed) sourcepath: ' + sourcepath);
	var dest = 'build/local';
	gutil.log('(print-changed) dest: ' + dest);

	gulp.src(sourcepath)
		// .pipe(changed(config.local.dest))
		.pipe(changed(dest))
    .pipe(print());
});


// ignore missing file error
function fsOperationFailed(stream, sourceFile, err) {
	if (err) {
		gutil.log('(fsOperationFailed) err.code: ' + err.code);
		if (err.code !== 'ENOENT') {
			stream.emit('error', new gutil.PluginError('gulp-changed', err, {
				fileName: sourceFile.path
			}));
		}

		stream.push(sourceFile);
	}

	return err;
}

// only push through files changed more recently than the destination files
function compareLastModifiedTime(stream, cb, sourceFile, targetPath) {
	fs.stat(targetPath, function (err, targetStat) {
		if (!fsOperationFailed(stream, sourceFile, err)) {
			gutil.log('sourceFile.stat.mtime: ' + sourceFile.stat.mtime + '; targetStat.mtime: ' + targetStat.mtime);
			if (sourceFile.stat.mtime > targetStat.mtime) {
				stream.push(sourceFile);
			}
		}

		cb();
	});
}

gulp.task('print-changed-mod', function() {
	var sourcepath = ['/home/federico/Documents/ehour/projects/hereweare-frontend/**',
										// '!/home/federico/Documents/ehour/projects/hereweare-frontend/*.*',
										'!**/vendor','!**/node_modules','!**/build',
										'!**/vendor/**','!**/node_modules/**','!**/build/**'];
	gutil.log('(print-changed-mod) sourcepath: ' + sourcepath);
	var dest = 'build/local';
	gutil.log('(print-changed-mod) dest: ' + dest);

	var opts = {};
	opts.cwd = process.cwd();

	gulp.src(sourcepath)
		.pipe(through.obj(function (file, enc, cb) {
			gutil.log('(print-changed-mod) file: ' + JSON.stringify(file.history, null, '\t'));
			gutil.log('(print-changed-mod) file.relative: ' + JSON.stringify(file.relative, null, '\t'));
			var dest2 = typeof dest === 'function' ? dest(file) : dest;
			var newPath = path.resolve(opts.cwd, dest2, file.relative);
			gutil.log('(print-changed-mod) newPath: ' + newPath);

			if (opts.extension) {
				newPath = gutil.replaceExtension(newPath, opts.extension);
			}

			compareLastModifiedTime(this, cb, file, newPath);
		}))
    .pipe(print());
});

gulp.task('print-on', function() {
	var path = '/home/federico/Documents/ehour/projects/hereweare-frontend/client/js/directives/*';
	gutil.log('(task print-on) source path: ' + path);
	gulp.src(path)
    	.on('data', (chunk) => {
				// console.log('Received ' + JSON.stringify(Object.keys(chunk), null, '\t') + ' bytes of data.');
  			// console.log('Received ' + JSON.stringify(chunk.base, null, '\t') + ' bytes of data.');
				console.log('Received ' + JSON.stringify(chunk.history, null, '\t') + ' bytes of data.');
				console.log('Received ' + JSON.stringify(chunk.stat.mtime, null, '\t') + ' bytes of data.');
			});

	var build_path = '/home/federico/Documents/ehour/projects/hereweare-frontend/build/local/client/js/directives/*';
	gutil.log('(task print-on) build path: ' + build_path);
	gulp.src(build_path)
		  .on('data', (chunk) => {
				// console.log('Received ' + JSON.stringify(Object.keys(chunk), null, '\t') + ' bytes of data.');
		  	// console.log('Received ' + JSON.stringify(chunk.base, null, '\t') + ' bytes of data.');
				console.log('Received ' + JSON.stringify(chunk.history, null, '\t') + ' bytes of data.');
				console.log('Received ' + JSON.stringify(chunk.stat.mtime, null, '\t') + ' bytes of data.');
			});
});

// Default task: Check configuration
gulp.task('default', function() {
	gutil.log('checking configuration...');
	gutil.log('config: ' + JSON.stringify(config, null, '\t'));
});
