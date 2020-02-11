const { rollup } = require('rollup');
const babel = require('rollup-plugin-babel');
const { uglify } = require('rollup-plugin-uglify');

function writeBundle(bundle, suffix) {
  bundle.write({
    output: {
      file: `dist/crushinator.umd${suffix}.js`,
      name: 'crushinator',
    },
    format: 'umd',
    exports: 'named',
  });

  bundle.write({
    output: {
      file: `dist/crushinator.amd${suffix}.js`,
      amd: { id: 'crushinator' },
    },
    format: 'amd',
    exports: 'named',
  });
}

// Build unminified versions
rollup({
  input: 'src/crushinator.js',
  plugins: [babel()],
}).then((bundle) => {
  writeBundle(bundle, '');
});

// Build minified versions
rollup({
  input: 'src/crushinator.js',
  plugins: [babel(), uglify()],
}).then((bundle) => {
  writeBundle(bundle, '.min');
});
