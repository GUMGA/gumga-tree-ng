const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const baseName = "ng-easy-tree";
const isProduction = () => process.env.NODE_ENV == 'production';

const extractSass = new ExtractTextPlugin({
    filename: isProduction() ? baseName + ".min.css" : baseName + ".css",
    allChunks: true
});

let plugins = [extractSass];

if (isProduction()) {
    plugins.push(new UglifyJSPlugin());
}

module.exports = {
    entry: path.join(__dirname, 'src', 'index'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: isProduction() ? baseName + '.min.js' : baseName + '.js',
        publicPath: 'dist'
    },
    devServer: {
        inline: true,
        port: 1111
    },
    devtool: 'source-map',
    plugins: plugins,
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader'
                })
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg|eot|woff2|woff|ttf)$/i,
                use: "file-loader?name=assets/[name].[ext]"
            }
        ]
    }
};