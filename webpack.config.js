const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== "production";
const WebpackBuildNotifierPlugin = require("webpack-build-notifier");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
require("@babel/polyfill");

const webpackOption = {
    entry: ["@babel/polyfill", "./client/app.js"],
    // entry: "./client/app.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    devtool: "eval-source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: ["@babel/plugin-transform-async-to-generator"]
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    {loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader},
                    {loader: "css-loader" /* translates CSS into CommonJS*/},
                    {loader: "sass-loader" /* compiles Sass to CSS*/}]
            },
            {
                test: /\.css$/,
                use: [
                    {loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader},
                    {loader: "css-loader" /* translates CSS into CommonJS*/}]
            },
            {
                test: /\.html$/,
                exclude: /template.html$/,
                use: [{loader: "html-loader" /* translates CSS into CommonJS*/}]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "fonts/"
                    }
                }]
            }]
    },
    // optimization: {
    //     minimizer: devMode ? [] : [new UglifyJsPlugin]
    // },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Sony Camera Remote Manager",
            files: {
                css: ["./assets/style.css"],
            },
            template: "./client/template.html"
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: devMode ? "[name].css" : "[name].[hash].css",
            chunkFilename: devMode ? "[id].css" : "[id].[hash].css",
        }),
        new WebpackBuildNotifierPlugin({
            title: "Sony Cam Remote Manager",
            logo: path.resolve("./node_modules/material-design-icons/image/2x_web/ic_camera_black_48dp.png"),
            suppressSuccess: "initial",
            suppressWarning: true
        })
    ]
};
module.exports = webpackOption;