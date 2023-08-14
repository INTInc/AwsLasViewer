const webpack = require('webpack');
const path = require('path');
const {VueLoaderPlugin} = require('vue-loader');
const {VuetifyLoaderPlugin} = require('vuetify-loader');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'development',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist/')
    },
    entry: './src/index.js',
    devServer: {
        hot: true,
        devMiddleware: {
            publicPath: 'http://localhost:8080/dist'
        },
        static: [
            {directory: path.resolve(__dirname, './'), watch: false}
        ]
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
            // {
            //     test: /\.m?js/,
            //     resolve: {
            //         fullySpecified: false
            //     }
            // },
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
                test: /\.sass$/i,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            additionalData: `@import "./src/assets/css/main.scss"`
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
                            additionalData: `@import "./src/assets/css/main.scss";`
                        }
                    }
                ]
            },
            {
                resourceQuery: /raw/,
                type: 'asset/source'
            },
            {
                test: /\.css$/,
                resourceQuery: {not: [/raw/]},
                use: [
                    {
                        loader: 'vue-style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                auto: true
                            }
                        }
                    }
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(png|jpe?g|gif|ttf|svg|woff2|eot|woff|csv)$/,
                type: 'asset/resource'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new VuetifyLoaderPlugin(),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer']
        }),
        new webpack.DefinePlugin({
            'process.env.SERVER': JSON.stringify(process.env.SERVER || 'http://localhost:3000'),
            'process.platform': JSON.stringify(process.platform),
            'process.browser': 'true'
        })
    ],
    resolve: {
        modules: ['node_modules', 'src'],
        alias: {
            'vue': 'vue/dist/vue.js',
            'vue-color': 'vue-color/dist/vue-color.min.js'
        },
        fallback: {
            buffer: require.resolve('buffer'),
            http: false,
            https: false,
            url: require.resolve('url')
        }
    },
    stats: 'errors-only'
};
