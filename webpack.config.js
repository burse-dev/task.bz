const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const WEBPACK_DEV_SERVER_PORT = 8080;
const DEV_SERVER_PORT = 3000;

module.exports = {
  entry: ['@babel/polyfill', path.join(__dirname, 'src', 'index.jsx')],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.(svg|jpg|png|mp4)$/,
        loader: require.resolve('file-loader'),
        options: {
          name: '/static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'public'),
        to: path.resolve(__dirname, 'build'),
      },
    ]),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: false,
    port: WEBPACK_DEV_SERVER_PORT,
    proxy: { '*': `http://localhost:${DEV_SERVER_PORT}` },
    historyApiFallback: true,
  },
};
