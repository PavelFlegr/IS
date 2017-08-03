const path = require('path');

module.exports = {
  entry: './client/src/index.js',
  devtool: "source-map",
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'client/dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          "vue-loader"
        ]
      }
    ]
  }
};