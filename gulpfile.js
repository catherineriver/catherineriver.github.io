var gulp 			= require('gulp'),
	browsersync		= require('browser-sync'),
	notify 			= require("gulp-notify"),
	plumber 		= require('gulp-plumber'),
	gutil 			= require('gulp-util'),
	
	sass        	= require('gulp-sass'),
	minifyCss 		= require('gulp-minify-css'),
	csslint 		= require('gulp-csslint'),
	
	jade 			= require('gulp-jade'),
	jadeInheritance = require('gulp-jade-inheritance'),
	changed 		= require('gulp-changed'),
	cached 			= require('gulp-cached'),
	filter 			= require('gulp-filter'),
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
	
	var configPlumber = {
		errorHandler: notify.onError("\n<%= error.message %>")
	};
	
	var customReporter = function(file) {
		gutil.log(gutil.colors.cyan(file.csslint.errorCount)+' errors in '+gutil.colors.magenta(file.path));
	 
		file.csslint.results.forEach(function(result) {
			gutil.log(result.error.message+' on line '+result.error.line);
		});
	};
	
	var app = {
		jade: 'app/template/'
	};
	
	var dist = {
		css: 'dist/tpl/template_styles.css'
	};



// jade
// ---------------------------------------------------------------------------------

gulp.task('jade', function() {
	return gulp.src([app.jade + '/**/*.jade'])
	.pipe(plumber(configPlumber))
	.pipe(changed('dist', {extension: '.html'}))
	.pipe(cached('jade'))
	.pipe(jadeInheritance({basedir: 'app/template'}))
	 .pipe(filter(function (file) {
	            return !/\/_/.test(file.path) && !/^_/.test(file.relative);
	        }))
	.pipe(jade())
	.pipe(prettify(configPrettify))
	.pipe(gulp.dest('dist'))
});



// sass
// ---------------------------------------------------------------------------------

gulp.task('sass', function () {
	gulp.src('./app/scss/main.scss')
		.pipe(plumber(configPlumber))
			.pipe(sass())
			.pipe(autoprefixer({browsers: browsersList}))
			.pipe(minifyCss({
				advanced: true,
				restructuring: false,
				keepBreaks: true,
			}))
			.pipe(rename('template_styles.css'))
		.pipe(gulp.dest('dist/tpl'))
		.pipe(reload({stream:true}));
})

gulp.task('minifyCss', function() {
	gulp.src(dist.css)
		.pipe(minifyCss({
			advanced: true,
			restructuring: false,
			keepBreaks: false,
		}))
		.pipe(gulp.dest('dist/tpl'))
})

gulp.task('csslint', function() {
  gulp.src(dist.css)
    .pipe(csslint('.csslintrc.json'))
    .pipe(csslint.reporter(customReporter));
});



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
		cssTemplate: 'app/scss/handlebarsStr.scss.hb'
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
	
