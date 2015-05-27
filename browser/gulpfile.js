'use strict';
// generated on 2015-05-27 using generator-gulp-webapp 0.1.0

var gulp = require("gulp");
var gutil = require("gulp-util");
var WebpackDevServer = require("webpack-dev-server");

var webpack = require('gulp-webpack');
var path = require('path'),
    webpackBuild = require('gulp-webpack-build');

var webpackOptions = {
        debug: true,
        devtool: '#source-map',
        watchDelay: 200
    },
    webpackConfig = {
        context: __dirname + "/app",
        entry: "./entry",
        output: {
            path: __dirname + "/dist",
            filename: "bundle.js"
        }
    },
    CONFIG_FILENAME = webpackBuild.config.CONFIG_FILENAME;

// load plugins
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
    return gulp.src('app/styles/main.scss')
        .pipe($.rubySass({
            style: 'expanded',
            precision: 10
        }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe($.size());
});

gulp.task('scripts', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.size());
});

// Copy directly the core files for right now
// 
// FUTURE: use a bower/npm module instead
gulp.task('core', function () {
    return gulp.src('/Users/reed/pop/pretzel_games/programming_game/core/**/*.js', { dot: true })
        .pipe(gulp.dest('app/scripts/core'));
});

gulp.task('html', ['styles', 'scripts', 'core'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src('app/*.html')
        .pipe($.useref.assets({searchPath: '{.tmp,app}'}))
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size());
});

gulp.task('fonts', function () {
    return $.bowerFiles()
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size());
});

gulp.task('extras', function () {
    return gulp.src(['app/*.*', '!app/*.html'], { dot: true })
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return gulp.src(['.tmp', 'dist'], { read: false }).pipe($.clean());
});

gulp.task('build', ['html', 'images', 'fonts', 'extras']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(connect.static('app'))
        .use(connect.static('.tmp'))
        .use(connect.directory('app'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
});

gulp.task('serve', ['connect', 'styles', 'core'], function () {
    require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    gulp.src('app/styles/*.scss')
        .pipe(wiredep({
            directory: 'app/bower_components'
        }))
        .pipe(gulp.dest('app/styles'));

    gulp.src('app/*.html')
        .pipe(wiredep({
            directory: 'app/bower_components',
            exclude: ['bootstrap-sass-official']
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect', 'serve', 'core'], function () {
    var server = $.livereload();

    // watch for changes

    gulp.watch([
        'app/*.html',
        '.tmp/styles/**/*.css',
        'app/scripts/**/*.js',
        'app/images/**/*'
    ]).on('change', function (file) {
        server.changed(file.path);
    });

    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/images/**/*', ['images']);
    gulp.watch('bower.json', ['wiredep']);
});

gulp.task('webpack', [], function() {
    return gulp.src(path.join('app/scripts', '**', CONFIG_FILENAME),
        { base: path.resolve('app/scripts') })
        .pipe(webpackBuild.init(webpackConfig))
        .pipe(webpackBuild.props(webpackOptions))
        .pipe(webpackBuild.run())
        .pipe(webpackBuild.format({
            version: false,
            timings: true
        }))
        .pipe(webpackBuild.failAfter({
            errors: true,
            warnings: true
        }))
        .pipe(gulp.dest('dist/webpacked/'));
});

// gulp.task('watch', function() {
//     gulp.watch(path.join(src, '**/*.*')).on('change', function(event) {
//         if (event.type === 'changed') {
//             gulp.src(event.path, { base: path.resolve(src) })
//                 .pipe(webpackBuild.closest(CONFIG_FILENAME))
//                 .pipe(webpackBuild.init(webpackConfig))
//                 .pipe(webpackBuild.props(webpackOptions))
//                 .pipe(webpackBuild.watch(function(err, stats) {
//                     gulp.src(this.path, { base: this.base })
//                         .pipe(webpackBuild.proxy(err, stats))
//                         .pipe(webpackBuild.format({
//                             verbose: true,
//                             version: false
//                         }))
//                         .pipe(gulp.dest(dest));
//                 }));
//         }
//     });
// });

gulp.task("webpack-dev-server", function(callback) {
    // Start a webpack-dev-server
    var compiler = 
        webpack({
            context: __dirname + "/app",
            entry: "./entry",
            output: {
                path: __dirname + "/dist",
                filename: "bundle.js"
            }
        });

    new WebpackDevServer(compiler, {
        // server and middleware options
    }).listen(8080, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        // Server listening
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");

        // keep the server alive or continue?
        // callback();
    });
});