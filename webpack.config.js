const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

dotenv.config();

const isDevelopment = process.env.REACT_APP_NODE_ENV === 'development';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment ? 'inline-source-map' : 'hidden-source-map',
  entry: './src/client.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'client.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      Src: path.resolve(__dirname, 'src/'),
      Api: path.resolve(__dirname, 'src/api/'),
      Components: path.resolve(__dirname, 'src/components/'),
      Constants: path.resolve(__dirname, 'src/constants/'),
      Containers: path.resolve(__dirname, 'src/containers/'),
      Features: path.resolve(__dirname, 'src/features/'),
      Hooks: path.resolve(__dirname, 'src/hooks/'),
      Layouts: path.resolve(__dirname, 'src/layouts/'),
      Lib: path.resolve(__dirname, 'src/lib/'),
      Pages: path.resolve(__dirname, 'src/pages/'),
      Routes: path.resolve(__dirname, 'src/routes/'),
      Styles: path.resolve(__dirname, 'src/styles/'),
      Typings: path.resolve(__dirname, 'src/typings/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env'],
              ['@babel/preset-react'],
            ],
          }
        }
      },
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
        ],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    historyApiFallback: true,
    open: true,
    port: process.env.DEVELOPMENT_SERVER_PORT,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    // }),
  ],
};