// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var del = require('del');
var react = require('gulp-react');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Delete the dist directory
gulp.task('clean', function(cb) {
	del(['js/dist'], cb)
});

// Lint Task
gulp.task('lint', function() {
	return gulp.src('js/*.js')
		.pipe(react())
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', ['clean'], function() {
	return gulp.src([
		"js/player_components.js",
		"js/bootstrap_shortcuts.js",
		"js/actions.js",
		"js/season_store.js",
		"js/view_store.js",
		"js/season_components.js",
		"js/conference_components.js",
		"js/season_data_rendering.js",
		"js/admin_home.js"
	])
		.pipe(react())
		.pipe(concat('all.js'), {newLine: "\r\n"})
		.pipe(gulp.dest('js/dist'))
		.pipe(rename('all.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('js/dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
	gulp.watch('js/*.js', ['lint', 'scripts']);
});

// Default Task
gulp.task('default', ['clean', 'lint', 'scripts', 'watch']);
