const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const prod = require('./webpack.prod.js');

module.exports = merge(prod, {
    optimization: {
        minimize: false
    },
    devServer: {
        hot: true,
        contentBase: './',
        publicPath: 'http://localhost:8080/dist'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.EnvironmentPlugin({
            SERVER: 'http://localhost:3000'
        })
    ],
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js',
            'vue-color': 'vue-color/dist/vue-color.js'
        }
    }
});
