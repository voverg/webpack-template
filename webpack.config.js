const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;
const mode = isDev ? 'development' : 'production';

const getFileName = ext => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: mode,
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: getFileName('js'),
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true,
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  devtool: isDev ? 'eval-cheap-module-source-map' : false,
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.pug',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd,
      }
    }),
    new HtmlWebpackPlugin({
      template: 'pages/about.pug',
      filename: 'about.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd,
      }
    }),
    new MiniCssExtractPlugin({
      filename: getFileName('css')
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eof|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.pug$/i,
        loader: 'pug-loader',
        exclude: /(node_modules|browser_components)/,
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
              presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
