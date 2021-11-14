const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));

function buildStyles() {
  return src("./sass/index.scss").pipe(sass()).pipe(dest("css"));
}

function watchTask() {
  watch(["./sass/index.scss", "./sass/**/*.scss"], buildStyles);
}

exports.default = series(buildStyles, watchTask);
