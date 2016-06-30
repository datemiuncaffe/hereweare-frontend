var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require("gulp-rename");
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var del = require('del');
var changed = require('gulp-changed');

var shipitCaptain = require('shipit-captain');
var config = require('./gulpconfig.json');
var shipitConfig = require('./config/shipit').config;

// Clean build folder function:
function cleanBuildFn() {
	gutil.log('cleaning build folder...');
    return del.sync([config.local.dest, config.test.dest]);
}

// Build local
function buildLocalFn() {
	return gulp.src(config.local.src)
		.pipe(changed(config.local.dest))
    .pipe(gulp.dest(config.local.dest));
}
function buildCompleteLocalFn() {
	return gulp.src(config.local.srcall)
    .pipe(gulp.dest(config.local.dest));
}

// Build test
function buildTestFn() {
	return gulp.src(config.test.src)
		.pipe(changed(config.test.dest))
    .pipe(gulp.dest(config.test.dest));
}
function buildCompleteTestFn() {
	return gulp.src(config.test.srcall)
    .pipe(gulp.dest(config.test.dest));
}

// Modify local
function modifyLocalFn() {
	gutil.log('modify app.js file in local...');
	gulp.src(['/home/federico/Documents/ehour/projects/hereweare-frontend/client/js/app.js'])
    .pipe(replace('$resourceBaseUrl$', 'localhost:3002'))
    .pipe(gulp.dest('/home/federico/Documents/ehour/projects/hereweare-frontend/build/local/client/js'));
	gutil.log('modify ricerca.html file in local...');
	gulp.src(['/home/federico/Documents/ehour/projects/hereweare-frontend/client/views/estimate/ricerca.html'])
    .pipe(replace('$resourceBaseUrl$', 'localhost:3002'))
    .pipe(gulp.dest('/home/federico/Documents/ehour/projects/hereweare-frontend/build/local/client/views/estimate'));
}

// Modify test
function modifyTestFn() {
	gutil.log('modify app.js file in test...');
	gulp.src(['/home/federico/Documents/ehour/projects/hereweare-frontend/client/js/app.js'])
    .pipe(replace('$resourceBaseUrl$', '192.168.88.158:3002'))
    .pipe(gulp.dest('/home/federico/Documents/ehour/projects/hereweare-frontend/build/test/client/js'));
	gutil.log('modify ricerca.html file in test...');
	gulp.src(['/home/federico/Documents/ehour/projects/hereweare-frontend/client/views/estimate/ricerca.html'])
    .pipe(replace('$resourceBaseUrl$', '192.168.88.158:3002'))
    .pipe(gulp.dest('/home/federico/Documents/ehour/projects/hereweare-frontend/build/test/client/views/estimate'));
}

gulp.task('build:deploy', function() {
	runSequence(['build:local', 'build:test'],
							['modify:local', 'modify:test'],
							'deploy');
});

gulp.task('buildcomplete', function() {
	runSequence(['buildcomplete:local', 'buildcomplete:test'],
							['modify:local', 'modify:test']);
});

gulp.task('build', function() {
	// gulp.watch(config.test.src, ['build']);

	// gulp.watch(config.test.src, function(event) {
  // 	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	// });

	runSequence(['build:local', 'build:test'],
							['modify:local', 'modify:test']);
});

// Clean tasks:
gulp.task('clean', cleanBuildFn);

// Build tasks:
gulp.task('build:local', buildLocalFn);
gulp.task('build:test', buildTestFn);
gulp.task('buildcomplete:local', buildCompleteLocalFn);
gulp.task('buildcomplete:test', buildCompleteTestFn);

// Modify tasks:
gulp.task('modify:local', modifyLocalFn);
gulp.task('modify:test', modifyTestFn);

// Deploy task
var options = {
  init: require('./config/shipit').init,
  run: ['deploy'],
  targetEnv: 'staging',
}

gulp.task('deploy', function(cb) {
  shipitCaptain(shipitConfig, options, cb);
});

// Default task: Check configuration
gulp.task('default', function() {
	gutil.log('checking configuration...');
	gutil.log('config: ' + JSON.stringify(config, null, '\t'));
});
