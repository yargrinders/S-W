const {src, dest, watch, parallel, series} = require('gulp');

const del           = require('del');
const browserSync   = require('browser-sync').create();
const fileInclude   = require('gulp-file-include');
const changed       = require('gulp-changed');
const ttf2woff2     = require('gulp-ttftowoff2');
const fontmin       = require('gulp-fontmin');
const imagemin      = require('gulp-imagemin');
const scss          = require('gulp-sass')(require('sass'));
const concat        = require('gulp-concat');
const uglify        = require('gulp-uglify-es').default;
const autoprefixer  = require('gulp-autoprefixer');

function clean() {
    return del(['docs']); 
}

// ✅ ИЗМЕНЕНО: app/**/*.html
function html() {
  return src('app/**/*.html')
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(dest('docs')) 
    .pipe(browserSync.stream());
}

function convertFonts() {
  return src('app/fonts/*.ttf')
    .pipe(fontmin({
      formats: ['woff', 'woff2']
    }))
    .pipe(dest('docs/fonts/')); 
}

function woff2() {
  return src('app/fonts/*.ttf')
    .pipe(changed('docs/fonts/', { extension: '.woff2' })) 
    .pipe(ttf2woff2())
    .pipe(dest('docs/fonts/')); 
}

function images() {
  return src('app/images/**/*')
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(dest('docs/images')); 
}

function scripts() {
  return src([
    'app/js/*.js', 
    '!app/js/main.min.js'
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('docs/js')) 
    .pipe(browserSync.stream());
}

function styles() {
  return src('app/scss/main.scss')
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version'] }))
    .pipe(concat('style.min.css'))
    .pipe(scss({ outputStyle: 'compressed'}))
    .pipe(dest('docs/css/')) 
    .pipe(browserSync.stream());
}

function watchFiles() {
    watch(['app/fonts/*.ttf'], convertFonts, woff2)
    watch(['app/images/**/*'], images)
    watch(['app/js/main.js'], scripts)
    watch(['app/scss/*.scss', 'app/components/*.scss'], styles) 
    watch('app/**/*.html', html);
}

function browserSyncInit(done) {
  browserSync.init({
    server: {
      baseDir: './docs' 
    },
    port: 3000,
    open: true,
    notify: false
  });
  done();
}

exports.clean        = clean;
exports.html         = html;
exports.convertFonts = convertFonts;
exports.woff2        = woff2;
exports.images       = images;
exports.scripts      = scripts;
exports.styles       = styles;

exports.default = series(clean, convertFonts, woff2, html, parallel(images, scripts, styles, watchFiles, browserSyncInit));
exports.build   = series(clean, convertFonts, woff2, html, images, scripts, styles);