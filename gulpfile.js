var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var del = require('del');
var config = require('./gulpconfig.json');

// Clean build folder function:
function cleanBuildFn() {
	gutil.log('cleaning build folder...');
    return del.sync([config.local.dest, config.test.dest]);
}

//Build local
function buildLocalFn() {
	return gulp.src(config.local.src)
    .pipe(gulp.dest(config.local.dest));
}

//Build test
function buildTestFn() {
	return gulp.src(config.test.src)
    .pipe(gulp.dest(config.test.dest));
}

gulp.task('clean:build', function() {
	runSequence('clean',
				['build:local', 'build:test']);
});

// Clean tasks:
gulp.task('clean', cleanBuildFn);

//Build tasks:
gulp.task('build:local', buildLocalFn);
gulp.task('build:test', buildTestFn);

// Default task: Check configuration
gulp.task('default', function() {
	gutil.log('checking configuration...');
	gutil.log('config: ' + JSON.stringify(config, null, '\t'));
});