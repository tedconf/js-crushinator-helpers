import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/crushinator.js',
  dest: 'dist/crushinator.js',
  plugins: [
    babel({
      babelrc: false,
      presets: ['es2015-rollup'],
    }),
  ],
  format: 'umd',
  moduleName: 'crushinator',
};
