'use strict';

const Fiber = require('fibers');
const autoprefixer = require('gulp-autoprefixer');
const beeper = require('beeper');
const chalk = require('chalk');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const log = require('fancy-log');
const rollup = require('rollup');
const rollupBabel = require('rollup-plugin-babel');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const sass = require('gulp-sass');
const sassdoc = require('sassdoc');
const sasslint = require('gulp-stylelint');
const sourcemaps = require('gulp-sourcemaps');
const { spawn } = require('child_process');

sass.compiler = require('sass');

const paths = {
  SASS_DIR: './_src/scss/',
  JS_SRC_DIR: './_src/js/',
  JS_DEST_DIR: './content/assets/js/',
  CSS_DIR: './content/assets/css/',
  IMG_SRC_DIR: './_src/images/',
  IMG_DEST_DIR: './content/assets/images/',
  OUTPUT_DIR: './_site/',
  IGNORE: ['!**/.#*', '!**/flycheck_*'],
  init: function() {
    this.SASS = [this.SASS_DIR + '**/*.scss'].concat(this.IGNORE);
    this.JS = [this.JS_SRC_DIR + '**/*.js'].concat(this.IGNORE);
    return this;
  },
}.init();

// Try to ensure that all processes are killed on exit
const spawned = [];
process.on('exit', () => {
  spawned.forEach(pcs => {
    pcs.kill();
  });
});

const spawnTask = function(command, args, cb) {
  spawned.push(
    spawn(command, args, { stdio: 'inherit' })
      .on('error', err => {
        beeper();
        return cb(err);
      })
      .on('exit', cb),
  );
};

gulp.task('imagemin', () =>
  gulp
    .src(`${paths.IMG_SRC_DIR}**/*`)
    .pipe(
      imagemin([
        imagemin.gifsicle(),
        imagemin.jpegtran(),
        imagemin.optipng(),
        imagemin.svgo(),
      ]),
    )
    .pipe(gulp.dest(paths.IMG_DEST_DIR)),
);

const sassTask = opts => {
  const options = { sourcemap: false, minify: false, ...opts };
  if (!options.src) {
    return Promise.reject('No source for Sass compilation');
  }
  let stream = gulp.src(options.src);
  if (options.sourcemap) {
    stream = stream.pipe(sourcemaps.init());
  }
  stream = stream.pipe(sass({ fiber: Fiber })).pipe(
    autoprefixer({
      cascade: false,
    }),
  );
  if (options.minify) {
    stream = stream.pipe(
      cleanCSS({
        compatibility: {
          properties: {
            zeroUnits: false,
          },
        },
      }),
    );
  }
  if (options.sourcemap) {
    stream = stream.pipe(
      sourcemaps.write(options.sourcemap === 'inline' ? undefined : '.'),
    );
  }
  return stream.pipe(gulp.dest(paths.CSS_DIR));
};

gulp.task('js', () => {
  return rollup
    .rollup({
      input: paths.JS_SRC_DIR + 'index.js',
      plugins: [
        rollupResolve(),
        rollupBabel({
          presets: [
            [
              '@babel/preset-env',
              {
                targets: 'defaults',
                modules: false,
                corejs: '3',
                useBuiltIns: 'usage',
              },
            ],
          ],
          exclude: [/node_modules\/(?!cascading-color-systems)/],
        }),
        rollupCommonjs(),
      ],
    })
    .then(bundle => {
      return bundle.write({
        file: paths.JS_DEST_DIR + 'scripts.js',
        format: 'iife',
      });
    });
});

gulp.task('sass', () => {
  return sassTask({ src: paths.SASS_DIR + 'screen.scss', sourcemap: 'inline' });
});

gulp.task('sass-guide', () => {
  return sassTask({
    src: paths.SASS_DIR + 'styleguide.scss',
    sourcemap: 'inline',
  });
});

gulp.task('sass-prod', () => {
  return sassTask({
    src: paths.SASS_DIR + 'screen.scss',
    sourcemap: true,
    minify: true,
  });
});

gulp.task('sassdoc-sass', () => {
  return sassTask({ src: paths.SASS_DIR + 'json.scss' });
});

const onError = function(err) {
  log.error(chalk.red(err.message));
  beeper();
  this.emit('end');
};

const sasslintTask = (src, failOnError, shouldLog) => {
  if (shouldLog) {
    const cmd = `sasslint ${src}`;
    log('Running', `'${chalk.cyan(cmd)}'...`);
  }
  const stream = gulp.src(src).pipe(
    sasslint({
      reporters: [{ formatter: 'string', console: true }],
      failAfterError: failOnError,
    }),
  );
  if (!failOnError) {
    stream.on('error', onError);
  }
  return stream;
};

gulp.task('sasslint', () => sasslintTask(paths.SASS, true));

gulp.task('sasslint-nofail', () => sasslintTask(paths.SASS));

gulp.task(
  'sassdoc',
  gulp.series('sassdoc-sass', () => {
    const stream = sassdoc();

    gulp.src(paths.SASS).pipe(stream);

    return stream.promise;
  }),
);

gulp.task('watch', cb => {
  gulp.watch(paths.SASS, gulp.parallel(['sasslint', 'sass', 'sass-guide']));
  gulp.watch(paths.JS, gulp.parallel('js'));

  // lint all scss when rules change
  gulp.watch('**/.stylelintrc.yml', gulp.parallel('sasslint-nofail'));

  cb();
});

gulp.task('sassdoc-watch', cb => {
  gulp.watch(paths.SASS, gulp.parallel(['sasslint', 'sass', 'sassdoc']));

  // lint all scss when rules change
  gulp.watch('**/.stylelintrc.yml', gulp.parallel('sasslint-nofail'));

  cb();
});

gulp.task(
  'build-assets',
  gulp.parallel('imagemin', 'js', 'sass', 'sass-guide'),
);
gulp.task(
  'build-assets-prod',
  gulp.parallel('imagemin', 'js', 'sass-prod', 'sass-guide'),
);

gulp.task('build-clean', () => del([`${paths.OUTPUT_DIR}**`]));

gulp.task(
  'build',
  gulp.series(gulp.parallel('build-assets-prod', 'build-clean'), cb =>
    spawnTask('yarn', ['eleventy'], cb),
  ),
);

gulp.task(
  'serve',
  gulp.series(gulp.parallel('build-assets', 'build-clean'), cb =>
    spawnTask('yarn', ['eleventy', '--serve'], cb),
  ),
);

gulp.task('default', gulp.parallel('watch', 'serve'));
