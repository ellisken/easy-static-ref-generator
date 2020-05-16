// Gulp.js defines all executable and non-executable gulp tasks used to create the /build directory
// and generate all static HTML pages for Easy Static Ref Generator

// Define dependencies and bring in configs
const gulp = require('gulp'),
    handlebars = require('gulp-compile-handlebars'),
    rename = require('gulp-rename'),
    del = require('del'),
    cleanCSS = require('gulp-clean-css'),
    minJS = require('gulp-uglify'),
    configs = require('./config-files/config.json')

// Removes the /build directory and its contents
function cleanBuild() {
    // force: true recursively deletes all subdirectories and their files
    return del('build/**', { force: true });
}

// Moves all yaml source files to the /build directory for easy bundling
function moveYaml() {
    return gulp.src('yaml/*.yaml')
        .pipe(gulp.dest('build/yaml'));
}

// Moves all images to /build directory for easy bundling,
// exclude README image
function moveImages() {
    return gulp.src(['assets/images/*', '!assets/images/build-messages.PNG'])
        .pipe(gulp.dest('build/assets/images'));
}

// Minifies and moves CSS to /build
function minifyCSS() {
    return gulp.src('assets/styles/*.css')
        // rebase: false prevents font/image path rebasing
        .pipe(cleanCSS({ rebase: false }))
        .pipe(gulp.dest('build/assets/styles'));
}

// Minifies and moves scripts to /build
function minifyJS() {
    return gulp.src('assets/scripts/*.js')
        .pipe(minJS())
        .pipe(gulp.dest('build/assets/scripts'));
}

// Makes directories and HTML documents for each api ref specified in
// config.json
function makeHtml(done) {
    configs.forEach(function (config) {
        // Set file name
        const fileName = config.slug;

        return gulp.src('templates/*.handlebars')
            .pipe(handlebars(config))
            .pipe(rename(fileName))
            .pipe(gulp.dest('build/'));
    });
    done();
}

exports.clean = cleanBuild;
exports.makeHtml = makeHtml;
exports.moveYaml = moveYaml;
exports.moveAssets = gulp.series(moveImages, minifyCSS, minifyJS, moveYaml);
exports.makeDocs = gulp.series(cleanBuild, this.moveAssets, makeHtml);