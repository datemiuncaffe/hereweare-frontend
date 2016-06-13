var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require("gulp-rename");
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var del = require('del');
var config = require('./gulpconfig.json');

// Clean build folder function:
function cleanBuildFn() {
	gutil.log('cleaning build folder...');
    return del.sync([config.local.dest, config.test.dest]);
}

// Build local
function buildLocalFn() {
	return gulp.src(config.local.src)
    .pipe(gulp.dest(config.local.dest));
}

// Build test
function buildTestFn() {
	return gulp.src(config.test.src)
    .pipe(gulp.dest(config.test.dest));
}

// Modify local
function modifyLocalFn() {
	gutil.log('modify app.js file in local...');
	gulp.src(['/home/federico/Documents/ehour/projects/hereweare-frontend/client/js/app.js'])
    .pipe(replace('$resourceBaseUrl$', 'localhost:3000'))
    .pipe(gulp.dest('/home/federico/Documents/ehour/projects/hereweare-frontend/build/local/client/js'));
	gutil.log('modify ricerca.html file in local...');
	gulp.src(['/home/federico/Documents/ehour/projects/hereweare-frontend/client/views/estimate/ricerca.html'])
    .pipe(replace('$resourceBaseUrl$', 'localhost:3000'))
    .pipe(gulp.dest('/home/federico/Documents/ehour/projects/hereweare-frontend/build/local/client/views/estimate'));
}

// Modify test
function modifyTestFn() {
	gutil.log('modify app.js file in test...');
	gulp.src(['/home/federico/Documents/ehour/projects/hereweare-frontend/client/js/app.js'])
    .pipe(replace('$resourceBaseUrl$', '192.168.88.158:3000'))
    .pipe(gulp.dest('/home/federico/Documents/ehour/projects/hereweare-frontend/build/test/client/js'));
	gutil.log('modify ricerca.html file in test...');
	gulp.src(['/home/federico/Documents/ehour/projects/hereweare-frontend/client/views/estimate/ricerca.html'])
    .pipe(replace('$resourceBaseUrl$', '192.168.88.158:3000'))
    .pipe(gulp.dest('/home/federico/Documents/ehour/projects/hereweare-frontend/build/test/client/views/estimate'));
}

gulp.task('clean:build', function() {
	runSequence('clean',
				['build:local', 'build:test'],
				['modify:local', 'modify:test']);
});

// Clean tasks:
gulp.task('clean', cleanBuildFn);

// Build tasks:
gulp.task('build:local', buildLocalFn);
gulp.task('build:test', buildTestFn);

// Modify tasks:
gulp.task('modify:local', modifyLocalFn);
gulp.task('modify:test', modifyTestFn);

// Default task: Check configuration
gulp.task('default', function() {
	gutil.log('checking configuration...');
	gutil.log('config: ' + JSON.stringify(config, null, '\t'));
});