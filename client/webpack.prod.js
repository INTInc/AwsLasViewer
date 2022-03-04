const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
module.exports = {
    mode: 'development',
    output: {
        filename: 'bundle.js',
        publicPath: './dist/'
    },
    entry: './src/index.js',
    devServer: {
        hot: true,
        publicPath: 'http://localhost:8080/dist'
    },
    performance: {
        hints: false
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                extractComments: false,
                terserOptions: {
                    mangle: false,
                    compress: false
                }
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                use: [{
                    loader: 'source-map-loader',
                    options: {
                        filterSourceMappingUrl: (url, resourcePath) => {
                            if (/node_modules/i.test(resourcePath)) {
                                return false;
                            }
                            return 'skip';
                        }
                    }
                }]
            },
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src'),
                    // this for IE11 only
                    new RegExp('node_modules\\' + path.sep + '(vuetify|jsonforms|ono|json-schema-ref-parser)')
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', 'vue']
                    }
                }
            },
            {
                test: /\.sass$/i,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            prependData: `@import "./src/assets/css/main.scss"`
                        }
                    }
                ]
            },
            // SCSS has different line endings than SASS and needs a semicolon after the import.
            {
                test: /\.scss$/i,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            prependData: `@import "./src/assets/css/main.scss";`
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(ttf|svg|woff2|eot|woff|csv)$/,
                loader: 'url-loader'
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                options: {
                    esModule: false
                },
                loader: 'url-loader'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new VuetifyLoaderPlugin(),
        new MonacoWebpackPlugin({
            // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
            languages: ['xml']
        }),
        new webpack.DefinePlugin({
            'process.env.SERVER': JSON.stringify(process.env.SERVER || 'http://localhost:3000')
        })
    ],
    resolve: {
        modules: ['node_modules', 'src'],
        alias: {
            'vue': 'vue/dist/vue.esm.js',
            'vue-color': 'vue-color/dist/vue-color.min.js'
        }
    },
    stats: 'errors-only'
};
