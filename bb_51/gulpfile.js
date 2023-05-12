const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const replace = require('gulp-replace');
  
// Tarea para compilar SASS y agregar prefijos automáticos
gulp.task('sass', () => {
  return gulp.src('src/scss/*.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('dist/css'))
    .pipe(gulp.dest('dist/production')) // copia identica en dist/production 
    .pipe(browserSync.stream());
});

// Tarea para inicializar el servidor y recargar el navegador
gulp.task('serve', () => {
  browserSync.init({
    browser: 'firefox',
    server: {
      baseDir: './dist'
    }
  });

  gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('dist/index.html').on('change', browserSync.reload, gulp.series('copy-html'));
});

// Tarea para copiar el archivo index.html de dist a dist/production
gulp.task('copy-html', () => {
    return gulp.src('dist/index.html')
      .pipe(gulp.dest('dist/production'));
  });
  
  // Tarea para agregar un ID a cada clase en el archivo style.css de dist/production
  gulp.task('add-id-to-cmprmbb_root', () => {
    return gulp.src('dist/production/style.css')
      .pipe(rename('production.css'))
      .pipe(replace('.cmprmbb_root', '{id}.cmprmbb_root'))
      .pipe(gulp.dest('dist/production'));
  });
  
// Tarea por defecto que se ejecuta al correr `gulp` en la terminal
gulp.task('default', gulp.series('sass', 'copy-html', 'add-id-to-cmprmbb_root', 'serve'));

