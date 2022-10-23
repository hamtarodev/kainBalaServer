/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    describe_instances_lambda: './src/lambda/DescribeContainer/DescribeContainerLambdaHandler.ts',
    start_instance_lambda: './src/lambda/StartInstance/StartInstanceLambdaHandler.ts'
  },
  output: {
    path: path.resolve(__dirname, '../cdk/backend_dist'),
    filename: '[name]/index.js',
    library: 'commonjs2',
    libraryTarget: 'umd'
  },
  externals: {
    'aws-sdk': 'aws-sdk'
  },
  target: 'node',
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      'node_modules',
      path.resolve(__dirname, './src')
    ]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ terserOptions: { mangle: false } })],
  }
};