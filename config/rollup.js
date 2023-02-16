const babel = require('rollup-plugin-babel');

function getCompiler(opt) {
    return babel({
        babelrc: false,
        presets: [
            [
                '@babel/preset-env', {
                    targets: {
                        browsers: 'last 2 versions, > 0.1%, ie >= 8, Chrome >= 45, safari >= 10',
                        node: '0.12'
                    },
                    modules: false,
                    loose: true
                }
            ]
        ],
        exclude: 'node_modules/**',
        plugins: [
            [
                '@babel/plugin-transform-runtime',
                {
                    corejs: 2,
                }
            ],
        ],
        runtimeHelpers: true
    })
}

exports.getCompiler = getCompiler;