let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	configureWebpack: (config)=>{
		return {
			plugins: [
				new HtmlWebpackPlugin({
					template: 'index.html'
				})
			]
		}
	}
}