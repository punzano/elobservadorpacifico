'use strict';

import plugins  from 'gulp-load-plugins';
import yargs    from 'yargs';
import browser  from 'browser-sync';
import gulp     from 'gulp';
import panini   from 'panini';
import rimraf   from 'rimraf';
import sherpa   from 'style-sherpa';
import yaml     from 'js-yaml';
import fs       from 'fs';
import rename   from 'gulp-rename';

// Load all Gulp plugins into one variable
const $ = plugins();

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Load settings from settings.yml
const { COMPATIBILITY, PORT, UNCSS_OPTIONS, PATHS } = loadConfig();

function loadConfig() {
  let ymlFile = fs.readFileSync('config.yml', 'utf8');
  return yaml.load(ymlFile);
}

// Build the "dist" folder by running all of the below tasks
gulp.task('build', gulp.series(clean, gulp.parallel(pages, otherPages, sass, adminSass, blog_javascript, login_javascript, admin_javascript, images, fonts/*, copyOthers*/)));

// Build the site and watch for file changes
gulp.task('default', gulp.series('build', watch));

// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
  rimraf(PATHS.dist, done);
}

// Copy page templates into finished HTML files
function pages() {
  return gulp.src('src/pages/**/*.{html,hbs,handlebars}')
    .pipe(panini({
      root: 'src/pages/',
      layouts: 'src/layouts/',
      // pageLayouts: {
      //   // All pages inside src/pages/blog will use the blog.html layout
      //   'adminHome': 'adminHome'
      // },
      partials: 'src/partials/'
    }))
    .pipe(gulp.dest(PATHS.dist));
}
// Load updated HTML templates and partials into Panini
function resetPages(done) {
  panini.refresh();
  done();
}

function otherPages() {
  return gulp.src('src/partials/**/*.{html,hbs,handlebars}')
    .pipe(gulp.dest(PATHS.dist));
}

// Compile Sass into CSS
// In production, the CSS is compressed
function sass() {
  return gulp.src(['src/assets/scss/app.scss','src/assets/scss/admin/app.scss'])
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: PATHS.sass
    })
    .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: COMPATIBILITY
    }))
    // Comment in the pipe below to run UnCSS in production
    //.pipe($.if(PRODUCTION, $.uncss(UNCSS_OPTIONS)))
    .pipe($.if(PRODUCTION, $.cssnano()))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/assets/css'))
    .pipe(browser.reload({ stream: true }));
}
function adminSass() {
  return gulp.src('src/assets/scss/admin/app.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: PATHS.sass
    })
    .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: COMPATIBILITY
    }))
    .pipe(rename('admin.css'))
    // Comment in the pipe below to run UnCSS in production
    //.pipe($.if(PRODUCTION, $.uncss(UNCSS_OPTIONS)))
    .pipe($.if(PRODUCTION, $.cssnano()))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/assets/css'))
    .pipe(browser.reload({ stream: true }));
}

// Combine JavaScript into one file
// In production, the file is minified
function blog_javascript() {
  return gulp.src(PATHS.common_javascript.concat(PATHS.blog_javascript))
    .pipe($.sourcemaps.init())
    .pipe($.babel({ignore: ['what-input.js']}))
    .pipe($.concat('app.js'))
    .pipe($.if(PRODUCTION, $.uglify()
      .on('error', e => { console.log(e); })
    ))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/assets/js'));
}
function login_javascript() {
  return gulp.src(PATHS.common_javascript.concat(PATHS.login_javascript))
    .pipe($.sourcemaps.init())
    .pipe($.babel({ignore: ['what-input.js']}))
    .pipe($.concat('login.js'))
    .pipe($.if(PRODUCTION, $.uglify()
      .on('error', e => { console.log(e); })
    ))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/assets/js/admin'));
}
function admin_javascript() {
  return gulp.src(PATHS.common_javascript.concat(PATHS.admin_javascript))
    .pipe($.sourcemaps.init())
    .pipe($.babel({ignore: ['what-input.js']}))
    .pipe($.concat('app.js'))
    .pipe($.if(PRODUCTION, $.uglify()
      .on('error', e => { console.log(e); })
    ))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/assets/admin/js'));
}

// Copy images to the "dist" folder
// In production, the images are compressed
function images() {
  return gulp.src('src/assets/img/**/*')
    .pipe($.if(PRODUCTION, $.imagemin({
      progressive: true
    })))
    .pipe(gulp.dest(PATHS.dist + '/assets/img'));
}

function fonts() {
  return gulp.src(PATHS.fonts)
    .pipe(gulp.dest(PATHS.dist + '/assets/fonts'));
}

// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
function copyOthers() {
  return gulp.src(PATHS.assets)
    .pipe(gulp.dest(PATHS.dist + '/assets'));
}

// Watch for changes to static assets, pages, Sass, and JavaScript
function watch() {
  // gulp.watch(PATHS.assets, copyOthers);
  gulp.watch('src/pages/**/*.html').on('all', gulp.series(pages));
  gulp.watch('src/partials/**/*.{html,hbs,handlebars}').on('all', gulp.series(otherPages));
  gulp.watch('src/{layouts,partials}/**/*.html').on('all', gulp.series(resetPages, pages));
  gulp.watch('src/assets/scss/**/*.scss').on('all', gulp.series(sass, adminSass));
  gulp.watch('src/assets/js/**/*.js').on('all', gulp.series(blog_javascript, login_javascript, admin_javascript));
  gulp.watch('src/assets/img/**/*').on('all', gulp.series(images));
}
