var path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    open: true
  },
  optimization: {
    minimize: false
  }
};
