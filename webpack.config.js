const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  entry: {
    index: './src/index.ts',
    sw: './src/sw.ts',
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },

  resolve: {
    extensions: ['.ts', '.js'],
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
      excludeChunks: ['sw'],
    }),

    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: 'static', to: './' },
      ],
    }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'eval-source-map';
    config.devServer = {
      contentBase: './dist',
      host: '0.0.0.0',
      port: 3000,
    };
  }

  if (argv.mode === 'production') {
    config.plugins.push(
      new CleanWebpackPlugin(),
    );
  }

  return config;
};
