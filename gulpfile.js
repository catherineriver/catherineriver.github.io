var gulp 			= require('gulp'),
	browsersync		= require('browser-sync'),
	notify 			= require("gulp-notify"),
	plumber 		= require('gulp-plumber'),
	
	sass        	= require('gulp-sass'),
	sourcemaps 		= require('gulp-sourcemaps'),
	minifyCss 		= require('gulp-minify-css'),
	
	jade 			= require('gulp-jade'),
	prettify 		= require('gulp-html-prettify'),
	
	concat 			= require('gulp-concat'),
	uglify 			= require('gulp-uglify'),
	rename 			= require("gulp-rename"),
	spritesmith		= require('gulp.spritesmith'),
	autoprefixer	= require('gulp-autoprefixer'),
	runSequence		= require('run-sequence'),

	browsersList	= ['ie 8', 'last 2 versions'],
	reload 			= browsersync.reload;
	
	var configPrettify = {
		indent_char: '\t',
		indent_size: 1,
		indent_inner_html: true,
		unformatted: []
	};



// jade
// ---------------------------------------------------------------------------------

gulp.task('jade', function() {
	return gulp.src(['./app/template/*.jade', '!./app/template/_*.jade'])
		.pipe(plumber({errorHandler: notify.onError("\n<%= error.message %>")}))
		.pipe(jade({pretty: true}))

		.pipe(prettify(configPrettify))

		.pipe(gulp.dest('dist'))
});



// sass
// ---------------------------------------------------------------------------------

gulp.task('sass', function () {
	gulp.src('./app/scss/main.scss')
		.pipe(plumber({errorHandler: notify.onError("\n<%= error.message %>")}))
		.pipe(sourcemaps.init())
			.pipe(sass())
			.pipe(autoprefixer({browsers: browsersList}))
			.pipe(minifyCss({
				advanced: true,
				restructuring: false,
				keepBreaks: true,
			}))
			.pipe(rename('template_styles.css'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/tpl'))
		.pipe(reload({stream:true}));
})



// js
// ---------------------------------------------------------------------------------

gulp.task('js', function() {
    gulp.src(['app/js/**/*.js'])
        .pipe(concat('lib.min.js'))
		.pipe(uglify())
        .pipe(gulp.dest('dist/tpl/js'))
		.pipe(reload({stream:true}));
})



// sprite
// ---------------------------------------------------------------------------------
gulp.task('sprite', function () {
	var spriteData = gulp.src('app/images/**/*.png').pipe(spritesmith({
		retinaSrcFilter: ['app/images/**/*@2x.png'],
		imgName: 'images/sprite.png',
		retinaImgName: 'images/sprite@2x.png',
		cssName: '_sprite.scss',
		cssTemplate: 'app/handlebarsStr.scss.handlebars',
	}))

	spriteData.img
		.pipe(gulp.dest('dist/tpl'));

	spriteData.css
		.pipe(gulp.dest('app/scss/utils'));
});


// defaut task
// ---------------------------------------------------------------------------------
gulp.task('default', ['jade', 'sprite', 'sass', 'js' ], function () {

	browsersync({
		server: {
			baseDir: "dist",
			directory: true
		}
	});

	gulp.watch(["app/scss/**/*.+(scss|sass)"], ['sass']);

	gulp.watch("app/template/**/*.jade", function(){
		runSequence('jade', reload)});

	gulp.watch(["app/js/**/*.js", "dist/tpl/js/**/*.js", "!dist/tpl/js/lib.min.js"], ['js']);

	gulp.watch("app/images/*.png", ['sprite']);

});

gulp.task('build', ['jade', 'sprite', 'sass', 'js' ])
	
