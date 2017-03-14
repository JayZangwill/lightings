const gulp = require('gulp');
const babel = require('gulp-babel');
const polyfiller = require('gulp-polyfiller');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');

gulp.task('default', () => {
	return gulp.src('src/lightings.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(polyfiller(['Promise']))
		.pipe(gulp.dest('dist'));
});
gulp.task("concat",["default"],()=>{
	return gulp.src("dist/*.js")
	.pipe(concat("lightings.js"))
	.pipe(gulp.dest("dist"));
});
gulp.task('scripts',["concat"], () => {
	return gulp.src('dist/*.js')
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});
 gulp.task('del',["scripts"], function(cb) {
	del(['dist/polyfills.js','dist/polyfills.min.js'], cb)
 });
gulp.task('clean', function(cb) {
	del(['dist'], cb)
});
gulp.task("go",()=>{
	gulp.start("default","scripts","del");
})
