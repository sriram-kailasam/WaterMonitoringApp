const gulp = require('gulp');
const terser = require('gulp-terser');

function minifyJs() {
	return gulp.src('app/public/scripts/*.js')
		.pipe(terser())
		.pipe(gulp.dest('dist/public/scripts'));
}

function views() {
	return gulp.src('app/views/*.pug')
		.pipe(gulp.dest('dist/views'));
}

exports.default = gulp.parallel(minifyJs, views);