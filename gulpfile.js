var gulp 						= require('gulp'),
	browsersync				= require('browser-sync'),
	notify 						= require('gulp-notify'),
	plumber 					= require('gulp-plumber'),

	postcss						= require('gulp-postcss'),
	autoprefixer			= require('autoprefixer'),
	stylelint 				= require('gulp-stylelint'),
	cssnano 					= require('cssnano'),
	cssimport 				= require('postcss-import'),
	cssnested 				= require('postcss-nested'),
	cssvar		 				= require('postcss-simple-vars'),

	jade 							= require('gulp-jade'),
	jadeInheritance 	= require('gulp-jade-inheritance'),
	changed 					= require('gulp-changed'),
	cached 						= require('gulp-cached'),
	filter 						= require('gulp-filter'),
	prettify 					= require('gulp-html-prettify'),

	clean 						= require('gulp-clean'),
	concat 						= require('gulp-concat'),
	uglify 						= require('gulp-uglify'),
	rename 						= require('gulp-rename'),
	runSequence				= require('run-sequence'),

	reload 						= browsersync.reload;

	var configPrettify = {
		indent_char: '\t',
		indent_size: 1,
		indent_inner_html: true,
		unformatted: []
	};

	var configPlumber = {
		errorHandler: notify.onError("\n<%= error.message %>")
	};

	var app = {
		jade: 'app/template/'
	};

	var dist = {
		css: 'dist/tpl/template_styles.css'
	};


gulp.task('jade', function() {
	return gulp.src([app.jade + '/**/*.jade'])
		.pipe(plumber(configPlumber))
		// .pipe(changed('dist', {extension: '.html'}))
		.pipe(cached('jade'))
		.pipe(jadeInheritance({basedir: 'app/template'}))
		.pipe(filter(function (file) {
			return !/\/_/.test(file.path) && !/^_/.test(file.relative);
		}))
		.pipe(jade())
		.pipe(prettify(configPrettify))
		.pipe(gulp.dest('dist'))
});


gulp.task('css', function () {
  var processors = [
		cssimport(),
		cssvar(),
		cssnested(),
    autoprefixer({browsers: ['ie 10', 'last 2 versions']}),
    cssnano({convertValues: {length: false}}),
  ];
  return gulp.src('./app/styles/main.css')
		.pipe(plumber(configPlumber))
    .pipe(postcss(processors))
		.pipe(rename('template_styles.css'))
    .pipe(gulp.dest('./dist/tpl'))
		.pipe(reload({stream:true}));
});


gulp.task('lintcss', function lintCssTask() {
   gulp.src('./app/styles/**/*.css')
    .pipe(stylelint({
      reporters: [ { formatter: 'string', console: true } ]
    }));
});


gulp.task('js', function() {
  gulp.src(['app/js/**/*.js'])
    .pipe(concat('lib.min.js'))
	.pipe(uglify())
    .pipe(gulp.dest('dist/tpl/js'))
	.pipe(reload({stream:true}));
})

gulp.task('clean', function() {
	return gulp.src('dist', {read: false})
	.pipe(clean());
});

gulp.task('copy', function() {
	gulp.src('./app/static/**')
		.pipe(gulp.dest('dist/tpl'))
});

gulp.task('default', ['jade', 'css', 'js', 'copy' ], function () {

	browsersync({
		server: {
			baseDir: "dist",
			directory: true
		},
		open: false
	});

	gulp.watch(["app/styles/**/*.css"], ['css']);

	gulp.watch(["app/template/**/*.jade", "app/template/**/*.svg"], function(){ runSequence('jade', reload)});

	gulp.watch(["app/js/**/*.js"], ['js']);

	gulp.watch("app/static/**/*", function() { runSequence('copy', reload) });
});

gulp.task('build', ['clean', 'jade', 'css', 'js' ])
