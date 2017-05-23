const webpack = require('webpack');
const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV;

const env = {
    production: NODE_ENV === 'production',
    staging: NODE_ENV === 'staging',
    test: NODE_ENV === 'test',
    development: NODE_ENV === 'development' || typeof NODE_ENV === 'undefined'
};

Object.assign(env, {
    build: (env.production || env.staging)
});

const addPlugin = (add, plugin) => add ? plugin : undefined; // eslint-disable-line no-confusing-arrow
const ifProd = plugin => addPlugin(env.production, plugin);
const removeEmpty = array => array.filter(i => !!i);

const styleLoaders = [
    {
        loader: 'css-loader',
        options: {
            modules: true,
            camelCase: true,
            importLoaders: 1,
            sourceMap: true,
            localIdentName: '[name]__[local]---[hash:base64:5]'
        }
    },
    {
        loader: 'resolve-url-loader',
        options: {
            sourceMap: true
        }
    },
    {
        loader: 'postcss-loader',
        options: {
            sourceMap: true
        }
    },
    'resolve-url-loader',
    {
        loader: 'sass-loader',
        options: {
            sourceMap: true,
            precision: 10,
            includePaths: [
                resolve(__dirname, '../src/assets/stylesheet'),
                'node_modules'
            ],
            outputStyle: 'expanded'
        }
    }
];

module.exports = {

    entry: {
        app: [
            './assets/js/app.js',
            resolve(__dirname, '../src/assets/stylesheet/index.js')
        ]
    },

    output: {
        path: resolve(__dirname, '../dist'),
        filename: 'assets/js/[name].bundle.js'
    },

    context: resolve(__dirname, '../src'),

    module: {
        rules: [
            {
                test: /\.md$/,
                use: [
                    {
                        loader: 'html-loader'
                    },
                    {
                        loader: 'markdown-loader'
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            },
            {
                test: /\.(css|scss)$/,
                exclude: /(node_modules)/,
                use: (env.production
                        ? ExtractTextPlugin.extract({
                            fallback: 'style-loader',
                            use: styleLoaders
                        })
                        : ['style-loader'].concat(styleLoaders))
            },
            {
                test: /\.(eot|xml|svg|ttf|woff|woff2|jpg|png|gif|svg)$/,
                include: [
                    resolve(__dirname, '../src/assets/images'),
                    resolve(__dirname, '../src/assets/fonts')
                ],
                loader: 'file-loader',
                options: {
                    name: (env.production ? '[path][name].[hash:10].[ext]' : '[path][name].[ext]'),
                    context: resolve(__dirname, '../src/assets')
                }
            }
        ]
    },

    plugins: removeEmpty([

        new HtmlWebpackPlugin({
            template: './views/index.html'
        }),

        new webpack.DefinePlugin({
            __DEV__: env.development,
            __STAGING__: env.staging,
            __PRODUCTION__: env.production,
            __CURRENT_ENV__: `'${NODE_ENV}'`
        }),

        ifProd(new webpack.optimize.OccurrenceOrderPlugin(true)),

        ifProd(new webpack.optimize.DedupePlugin()),

        ifProd(new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            },
            compress: {
                warnings: false,
                screw_ie8: true
            }
        }))

    ]),

    resolve: {
        alias: {
            styles: resolve(__dirname, '../src/assets/stylesheet'),
            images: resolve(__dirname, '../src/assets/images')
        },
        modules: [
            'node_modules',
            resolve(__dirname, '../src/assets/stylesheet'),
            resolve(__dirname, '../src/assets/js')
        ]
    }

};