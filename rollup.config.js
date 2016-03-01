import babel from 'rollup-plugin-babel';
import fs from 'fs';

const babelConfig = JSON.parse(fs.readFileSync('.babelrc', 'utf8'));

babelConfig.babelrc = false;
babelConfig.presets = ['es2015-rollup'];

export default {
  entry: 'src/crushinator.js',
  dest: 'dist/crushinator.js',
  plugins: [
    babel(babelConfig),
  ],
  format: 'umd',
  moduleName: 'crushinator',
};
