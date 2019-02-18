const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const connect = require('gulp-connect');
const browserify = require('browserify');
const autoprefixer = require('gulp-autoprefixer');

const paths = {
  sass: {
    src: ['./src/scss/**/*.{scss,sass}', '!./src/scss/variables.scss'],
    dest: './public/css'
  },
  scripts: {
    src: ['./src/js/**/*.js'],
    dest: './public/js'
  },
  html: {
    src: ['./public/index.html']
  }
};

const options = {
  autoprefixer: {
    browsers: ['last 2 versions']
  },
  sass: {
    outputStyle: 'expanded'
  },
  server: {
    root: './public',
    livereload: true
  }
};

gulp.task('sass', () => {
  return gulp
    .src(paths.sass.src)
    .pipe(sass(options.sass).on('error', sass.logError))
    .pipe(autoprefixer(options.autoprefixer))
    .pipe(gulp.dest(paths.sass.dest))
    .pipe(connect.reload());
});

gulp.task('connect', () => {
  return new Promise(resolve => {
    connect.server(options.server);
    resolve();
  });
});

gulp.task('scripts', () => {
  return gulp
    .src(paths.scripts.src)
    .pipe(babel())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(connect.reload());
});

gulp.task('html', () => {
  return gulp.src(paths.html.src).pipe(connect.reload());
});

gulp.task(
  'watch:html',
  () =>
    new Promise(resolve => {
      gulp.watch(paths.html.src, gulp.series('html'));
      resolve();
    })
);

gulp.task(
  'watch:styles',
  () =>
    new Promise(resolve => {
      gulp.watch(paths.sass.src, gulp.series('sass'));
      resolve();
    })
);

gulp.task(
  'watch:scripts',
  () =>
    new Promise(resolve => {
      gulp.watch(paths.scripts.src, gulp.series('scripts'));
      resolve();
    })
);

gulp.task(
  'watch',
  () =>
    new Promise(resolve => {
      gulp.parallel('watch:styles', 'watch:scripts', 'watch:html')();
      resolve();
    })
);

gulp.task(
  'default',
  () =>
    new Promise(resolve => {
      gulp.series('sass', 'scripts', 'html', gulp.parallel('watch', 'connect'))();
      resolve();
    })
);
