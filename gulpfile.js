const gulp = require('gulp');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const watch = require('gulp-watch');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const del = require('del');

gulp.task("concat" , ()=>{
	return gulp.src("src/*.js")
	.pipe(concat("lightings.js"))
	.pipe(babel({
            presets: ['es2015']
     }))
	.pipe(gulp.dest("dist"));
});

gulp.task('scripts', ["concat"], () => {
    return gulp.src('dist/lightings.js')
        .pipe(rename({
			suffix: '.min'
		}))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
	gulp.watch("src/**/*.js", ['scripts'])
});

gulp.task('clean', (cb) => {
	del(['dist'], cb)
});
