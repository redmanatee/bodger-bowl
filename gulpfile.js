// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var del = require('del');
var jshintify = require('jshintify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var source_paths = ['js/*.js', 'js/components/*.js', 'js/stores/*.js'];

// Delete the dist directory
gulp.task('clean', function(cb) {
	del(['js/dist'], cb)
});

gulp.task('compile', ['clean'], function() {
	return browserify({
		entries: ['./js/main.js'],
		debug: (process.env.NODE_ENV == 'production')
	})
	.transform(reactify, {stripTypes: true})
	.transform(jshintify)
	.bundle()
	.pipe(source('all.js'))
	.pipe(gulp.dest('js/dist'))
	.pipe(buffer())
	.pipe(uglify())
	.pipe(rename('all.min.js'))
	.pipe(gulp.dest('js/dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
	gulp.watch(source_paths, ['compile']);
});

// Default Task
gulp.task('default', ['clean', 'compile', 'watch']);
