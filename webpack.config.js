const path = require('path');

module.exports = {
    // a empty placeholder to define custom rules and more
    // (e.g. set loaders for specific file types)
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            // Require .vert and .frag as raw text.
            {
                test: /\.(vert|frag)$/i,
                use: 'raw-loader',
            }
        ],
    },
    optimization: {
        minimize: false
    },
    // set the webpack mode
    mode: "development",
    // set the entry point (main file of the web-application)
    entry: './src/index.js',
    // define the name of the bundle file and its location to store it
    output: {
        // name of the bundle file
        filename: 'main.js',
        // location to store it (here: 'working dir'/dist)
        path: path.resolve(__dirname, 'dist'),
        publicPath: path.join('/'),
        clean: true,
    },
    devtool: 'inline-source-map',

    // configure the webserver
    devServer: {

        // set the path to the folder containing the web-app
        static: path.join(__dirname, 'dist'),

        // you can also use another port, it is just custom to use 8080
        compress: true,
        port: 8080,
        open: false,
    },
};