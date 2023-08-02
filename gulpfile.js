const {src, dest, watch, parallel, series} = require('gulp');

const scss = require('gulp-sass')(require('sass'));

const concat = require('gulp-concat');

const uglify = require('gulp-uglify-es').default;

const autoprefixer = require('gulp-autoprefixer');

const clean = require('gulp-clean');

const fonter = require('gulp-fonter');

const ttf2woff2 = require('gulp-ttf2woff2');

const include = require('gulp-include');

const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');

const cheerio = require('gulp-cheerio');
const svgMin = require('gulp-svgmin');
const replace = require('gulp-replace');
const svgSprite = require('gulp-svg-sprite');


const browserSync = require('browser-sync').create();

function pages() {
    return src(['app/pages/*.html', 'app/*.html'])
    .pipe(include({
        includePaths: 'app/components'
    }))
    .pipe(dest('app'))
    .pipe(browserSync.stream());
}

function fonts() {
    return src('app/fonts/src/*.*')
    .pipe(fonter({
        formats: ['woff', 'ttf']
    }))
    .pipe(src('app/fonts/*.ttf'))
    .pipe(ttf2woff2())
    .pipe(dest('app/fonts'))
}

function images() {
    return src(['!app/images/src/svg/*.*', 'app/images/src/*/*.*'])

        .pipe(newer('app/images'))
        .pipe(imagemin())

        .pipe(dest('app/images'))
        .pipe(browserSync.stream());
}

function sprite() {
    return src('app/images/src/svg/*.svg')
        .pipe(svgMin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(replace('&gt;', '>'))
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "../sprite.svg",
                    render: {
                        scss: {
                            dest: '../../scss/_sprite.scss'
                        }
                    }
                }
            }
        }))
        .pipe(dest('app/images'))
}

function styles() {
    return src('app/scss/style.scss')
    .pipe(autoprefixer({overrideBrowserslist: ['last 10 version']}))
    .pipe(concat('style.min.css'))
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}

function  scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/slick-slider/slick/slick.js',
        'app/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}

function watching() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
    watch(['app/images/src/svg/*.*'], sprite)
    watch(['app/images/src'], images)
    watch(['app/scss/*.*'], styles)
    watch(['app/js/main.js'], scripts)
    watch(['app/components/*', 'app/pages/*'], pages)
    watch(['app/*.html']).on('change', browserSync.reload);
}


function building() {
    return src([
        '!app/images/src',
        'app/**/*.html',
        'app/fonts/*.*',
        'app/images',
        'app/images/sprite.svg',
        'app/css/style.min.css',
        'app/js/main.min.js'
    ], {base : 'app'})
    .pipe(dest('dist'))
}


function cleanDist() {
    return src('dist')
    .pipe(clean())
}

exports.pages = pages;
exports.styles = styles;
exports.fonts = fonts;
exports.images = images;
exports.sprite = sprite;
exports.scripts = scripts;
exports.building = building;
exports.watching = watching;

exports.default = parallel( styles, images, scripts, pages, watching);
exports.build = series(building, cleanDist);