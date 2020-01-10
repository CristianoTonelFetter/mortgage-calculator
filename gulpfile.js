const gulp = require('gulp');
const sass = require('gulp-sass');
const log = require('gulplog');
const tap = require('gulp-tap');
const buffer = require('gulp-buffer');
const babel = require('gulp-babel');
const connect = require('gulp-connect');
const autoprefixer = require('gulp-autoprefixer');
const open = require('gulp-open');

const browserify = require('browserify');

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
    livereload: true,
    port: 3000
  }
};

gulp.task('scripts', () => {
  return gulp
    .src('./src/**/*.js', { read: false })
    .pipe(
      tap(file => {
        const fileObj = file;
        log.info(`Bundling ${file.path}`);
        fileObj.contents = browserify(file.path, { debug: true }).bundle();
      })
    )
    .pipe(buffer())
    .pipe(babel())
    .pipe(gulp.dest('public'));
});

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

gulp.task('html', () => {
  return gulp.src(paths.html.src).pipe(connect.reload());
});

gulp.task('open', () => {
  return gulp
    .src('./public/index.html')
    .pipe(open({ uri: `http://localhost:${options.server.port}/` }));
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
      gulp.parallel('watch:styles', 'watch:html', 'watch:scripts')();
      resolve();
    })
);

gulp.task(
  'default',
  () =>
    new Promise(resolve => {
      gulp.series('sass', 'html', 'scripts', 'open', gulp.parallel('watch', 'connect'))();
      resolve();
    })
);
