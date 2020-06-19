const {override, addWebpackPlugin, babelExclude } = require('customize-cra');
const webpack = require('webpack');
// const rewireBabelLoader = require("react-app-rewire-babel-loader");

module.exports = override(
    addWebpackPlugin(new webpack.ProvidePlugin({
        'window.Quill': 'quill'
    })),
    babelExclude(/node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/)
);
