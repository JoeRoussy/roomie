var path = require('path');
var webpack = require('webpack');


module.exports = {
	entry: ['./app/client.js'],
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
			}
    	]
	},
	resolve: {
    	extensions: ['.js', '.jsx', '.json']
  	}
};