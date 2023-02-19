const nodeResolve = require('@rollup/plugin-node-resolve');
const common = require('./rollup');
const commonjs = require('@rollup/plugin-commonjs');
module.exports = {
  input: './src/index.js',
  output: {
    file: './dist/index.aio.js',
    format: 'umd',
    name: 'clone',
  },
  plugins: [
    nodeResolve({
      main: true,
      extensions: ['.js'],
    }),
    commonjs(),
    common.getCompiler(),
  ],
};
