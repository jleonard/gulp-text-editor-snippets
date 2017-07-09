//const buffer = require('vinyl-buffer');
const chai = require('chai');
//const cleanCSS = require('..');
//const concat = require('gulp-concat');
//const del = require('del');
const expect = chai.expect;
//const File = require('vinyl');
const gulp = require('gulp');
//const gulpSass = require('gulp-sass');
//const rename = require('gulp-rename');
//const sourcemaps = require('gulp-sourcemaps');
//const vfsFake = require('vinyl-fs-fake');
const snips = require('../index');
const should = require('should');
const fs = require('fs');

chai.should();
chai.use(require('chai-string'));

describe('gulp-text-editor-snipppets: init', function () {

  it('should return the gulp-text-editor-snipppets object: required export', function () {
    expect(snips).to.exist;
  });
});

describe('gulp-text-editor-snipppets: base functionality', function () {

  it('should throw an error if a destination folder is not specified', function (done) {

    try {
      gulp.src('./fixtures/**/*.snippet').pipe(snips({}));
    }
    catch (error) {
     done();
    }
    should.fail('no error was thrown when it should have been');

  });

  it('should create the destination path',function(done){
    var path = './test/tools/';
    gulp.src('./fixtures/**/*.snippet').pipe(snips({'dest':path}));
    if (!fs.existsSync(path)) {
      throw ("destination path was not created");
    }else{
      done();
    }
  });

  
});