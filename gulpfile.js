"use strict";

const build = require("@microsoft/sp-build-web");
const gulp = require("gulp");

build.addSuppression(
  `Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`
);
build.addSuppression(/Warning/gi);

gulp.task("sass", () => {
  const config = build.getConfig();
  return build.sass.execute(config);
});

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set("serve", result.get("serve-deprecated"));

  return result;
};

const tailwindcss = build.subTask(
  "tailwindcss",
  async (gulp, buildOptions, done) => {
    const postcss = require("gulp-postcss");

    const autoprefixer = await import("gulp-autoprefixer");

    gulp
      .src(`${buildOptions.srcFolder}/tailwind.css`)
      .pipe(postcss([require("tailwindcss")("./tailwind.config.js"), autoprefixer.default]))
      .pipe(gulp.dest("assets/dist"));
    done();
  }
);

const wait = build.subTask("wait", function (gulp, buildOptions, done) {
  setTimeout(done, 1000);
});

build.rig.addPreBuildTask(wait);
build.rig.addPreBuildTask(tailwindcss);
/* fast-serve */
const { addFastServe } = require("spfx-fast-serve-helpers");
addFastServe(build);
/* end of fast-serve */

build.initialize(require('gulp'));

