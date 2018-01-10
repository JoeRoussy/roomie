var path = require('path');
var webpack = require('webpack');


module.exports = {
	entry: './app/client.js',
	output: {
		filename: 'bundle.js',
		path: path.join(__dirname, 'public')
	},
	module: {
		loaders: [
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['react']
				}
			},
			{
				test: /\json$/,
				loader: 'json-loader'
			}
    	]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	resolve: {
    	extensions: ['.js', '.jsx', '.json']
  	}
};