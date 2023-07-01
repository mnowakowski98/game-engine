const path = require('path');

module.exports = {
    entry: './index.ts',
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [],
    output: {
        filename: 'client.js',
        path: path.resolve(__dirname, 'dist')
    }
};