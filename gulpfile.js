var gulp = require('gulp');
var gutil = require('gulp-util');
//var uglify = require('gulp-uglify');
//var runSequence = require('run-sequence');
var del = require('del');
//var cache = require('gulp-cache');
var config = require('./gulpconfig.json');

var paths = {
	build : []
};

function doStuff(cfg) {
	gutil.log('configuration = ', cfg, gutil.colors.magenta('123'));
	return gulp.src(cfg.src)
//		.pipe(uglify())
		.pipe(gulp.dest(cfg.dest));
}

// Clean build folder function:
function cleanBuildFn() {
    return del.sync(paths.build);
}

// Build function:
function buildFn(cb) {
//    runSequence(
//        'clean:build', // run synchronously first
//        ['scripts, 'images'], // then run rest asynchronously
//        'watch',
//        cb
//    );
}

// Scripts function:
function scriptsFn() {
//  return gulp.src(paths.scripts)
////    .pipe(coffee())
////    .pipe(uglify())
////    .pipe(concat('all.min.js'))
//    .pipe(gulp.dest('build/js'));
}

// Images function with caching added:
function imagesFn() {
//    gulp.src(paths.source + '/images/**/*.+(png|jpg|gif|svg)')
//    .pipe(cache(imagemin({optimizationLevel: 5})))
//    .pipe(gulp.dest(paths.build + '/images'));
}

// Clean tasks:
gulp.task('clean:build', cleanBuildFn);

// Scripts task:
gulp.task('scripts', scriptsFn);

// Images task:
gulp.task('images', imagesFn);

// Watch for changes on files:
gulp.task('watch', function() {
//    gulp.watch(paths.source + '/images/**/*.+(png|jpg|gif|svg)', ['images']);
//    gulp.watch(paths.source + '/scripts/**/*.js', ['scripts']);
});

// Default task:
//gulp.task('default', buildFn);
gulp.task('default', function() {
	doStuff(config.local);
	doStuff(config.test);
});