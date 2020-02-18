const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const fs = require('fs');

// Set up Babel configuration
const babelConfig = JSON.parse(fs.readFileSync('.babelrc', 'utf8'));
babelConfig.babelrc = false;
babelConfig.plugins.push('external-helpers');
babelConfig.presets = [['env', { modules: false }]];

function writeBundle(bundle, suffix) {
  bundle.write({
    dest: `dist/crushinator.umd${suffix}.js`,
    format: 'umd',
    exports: 'named',
    moduleName: 'crushinator',
  });

  bundle.write({
    dest: `dist/crushinator.amd${suffix}.js`,
    format: 'amd',
    exports: 'named',
    moduleId: 'crushinator',
  });
}

// Build unminified versions
rollup({
  entry: 'src/crushinator.js',
  plugins: [babel(babelConfig)],
}).then(bundle => {
  writeBundle(bundle, '');
});

// Build minified versions
rollup({
  entry: 'src/crushinator.js',
  plugins: [babel(babelConfig), uglify()],
}).then(bundle => {
  writeBundle(bundle, '.min');
});
