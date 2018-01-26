var path = require('path');
var webpack = require('webpack');
var Dotenv = require('dotenv-webpack');

module.exports = {
	entry: ['./client/client.js'],
	output: {
		filename: 'bundle.js',
		path: path.join(__dirname, 'public')
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['react', 'es2015', 'stage-0']
				}
			},
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['react', 'es2015', 'stage-0'],
					plugins: ['transform-class-properties', 'transform-decorators-legacy']
				}
			},
			{
				test: /\json$/,
				loader: 'json-loader'
			},
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            }
    	],

	},
	resolve: {
    	extensions: ['.js', '.jsx', '.json']
  	},
    plugins: [
        new Dotenv({
            path: './.env'
        })
    ]
};
