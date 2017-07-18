'use strict';

var rollup = require('rollup').rollup;
var babel = require('rollup-plugin-babel');
var uglify = require('rollup-plugin-uglify');
var fs = require('fs');

// Set up Babel configuration
var babelConfig = JSON.parse(fs.readFileSync('.babelrc', 'utf8'));
babelConfig.babelrc = false;
babelConfig.plugins.push('external-helpers');
babelConfig.presets = [
  ['es2015', { modules: false }]
];

function writeBundle(bundle, suffix) {
  bundle.write({
    dest: 'dist/crushinator.umd' + suffix + '.js',
    format: 'umd',
    exports: 'named',
    moduleName: 'crushinator',
  });

  bundle.write({
    dest: 'dist/crushinator.amd' + suffix + '.js',
    format: 'amd',
    exports: 'named',
    moduleId: 'crushinator',
  });
}

// Build unminified versions
rollup({
  entry: 'src/crushinator.js',
  plugins: [babel(babelConfig)],
}).then(function (bundle) {
  writeBundle(bundle, '');
});

// Build minified versions
rollup({
  entry: 'src/crushinator.js',
  plugins: [babel(babelConfig), uglify()],
}).then(function (bundle) {
  writeBundle(bundle, '.min');
});
