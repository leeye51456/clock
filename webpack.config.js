const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  entry: './src/index.ts',

  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.html$/i,
        use: 'html-loader',
      },
      {
        test: /\.ts$/i,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  optimization: {
    minimizer: [
      `...`,
      new CssMinimizerPlugin(),
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),

    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map';
    config.devServer = {
      contentBase: './dist',
      port: 3000,
    };

    config.plugins.push(
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false,
      }),
    );
  }

  if (argv.mode === 'production') {
    config.plugins.push(
      new CleanWebpackPlugin(),
    );
  }

  return config;
};
