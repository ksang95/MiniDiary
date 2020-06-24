const {override, addWebpackPlugin, babelExclude } = require('customize-cra');
const webpack = require('webpack');

module.exports = override(
    // addWebpackPlugin(new webpack.ProvidePlugin({
    //     'window.Quill': 'quill'
    // })),
    // babelExclude(/node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/)
);
