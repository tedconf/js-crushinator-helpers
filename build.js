'use strict';

var rollup = require('rollup').rollup;
var babel = require('rollup-plugin-babel');
var fs = require('fs');

// Set up Babel configuration
var babelConfig = JSON.parse(fs.readFileSync('.babelrc', 'utf8'));
babelConfig.babelrc = false;
babelConfig.presets = ['es2015-rollup'];

// Build unminified versions
rollup({
  entry: 'src/crushinator.js',
  plugins: [babel(babelConfig)],
}).then(function (bundle) {
  bundle.write({
    dest: 'dist/crushinator.umd.js',
    format: 'umd',
    moduleName: 'crushinator',
  });

  bundle.write({
    dest: 'dist/crushinator.amd.js',
    format: 'amd',
    moduleId: 'crushinator',
  });
});
