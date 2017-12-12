const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname + '/dist/js',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'eslint-loader'
          }
        ]
    },
    plugins: [
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            server: { 
                baseDir: ['dist']
            },
            files: ['./dist/*']
        }),
    ],
    watch: true,
    devtool: 'source-map'
};