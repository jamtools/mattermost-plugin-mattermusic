var path = require('path');

const NPM_TARGET = process.env.npm_lifecycle_event; //eslint-disable-line no-process-env

var DEV = false;
if (NPM_TARGET === 'run') {
    DEV = true;
}

const bundleName = 'mattermusic_00a9f383c1e57ad9_bundle.js';

const config = {
    entry: [
        './src/index.js',
    ],
    resolve: {
        modules: [
            'src',
            'node_modules',
        ],
        extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    },
    devtool: 'source-map',
    watchOptions: {
        poll: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,

                        // Babel configuration is in babel.config.js because jest requires it to be there.
                    },
                },
            },
            // {
            //     test: /\.scss$/,
            //     use: [
            //         'style-loader',
            //         {
            //             loader: 'css-loader',
            //         },
            //         {
            //             loader: 'sass-loader',
            //             options: {
            //                 includePaths: ['node_modules/compass-mixins/lib', 'sass'],
            //             },
            //         },
            //     ],
            // },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                    },
                ],
            },
        ],
    },
    externals: {
        react: 'React',
        redux: 'Redux',
        'react-redux': 'ReactRedux',
        'prop-types': 'PropTypes',
        'react-bootstrap': 'ReactBootstrap',
    },
    output: {
        devtoolModuleFilenameTemplate: 'webpack://[namespace]/[resource-path]?[loaders]',
        devtoolNamespace: 'mattermusic',
        path: path.join(__dirname, '/dist'),
        publicPath: '/',
        filename: DEV ? bundleName : 'main.js',
        sourceMapFilename: 'main.js.map',
    },
    optimization: {
        // minimize: false,
        minimize: !DEV,
    },
};

config.mode = 'production';

if (DEV) {
    // Development mode configuration
    config.mode = 'development';
}

module.exports = config;
