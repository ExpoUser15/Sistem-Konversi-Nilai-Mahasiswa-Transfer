// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/Pages/akademik/DashboardAkademik.jsx',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
  },
  plugins: [
    resolve({
      extensions: ['.js', '.jsx'],
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react'],
    }),
  ],
};
