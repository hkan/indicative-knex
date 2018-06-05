import { uglify } from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

const rollupPlugins = require('./rollupPlugins')
const pkg = require('./package.json')
const plugins = rollupPlugins.concat([uglify({}, minify)])

export default [
    {
        input: './src/index',
        output: {
            file: pkg.main,
            format: 'umd',
            name: 'indicative',
        },
        plugins: plugins,
    },
]