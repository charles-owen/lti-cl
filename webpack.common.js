const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = {
	entry: {
		LtiConsole: path.resolve(__dirname, 'js/Console/index.js')
	},
	plugins: [
		new FileManagerPlugin({
			onEnd: {
				copy: [
					{source: path.resolve(__dirname, '../../../cl/dist/lticonsole.*'), destination: path.resolve(__dirname, 'dist') }
				]
			}
		})
	]
}
