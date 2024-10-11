const path = require('node:path')
const TerserPlugin = require('terser-webpack-plugin')

/** @type { import('webpack').Configuration } */
module.exports = {
  mode: 'production', // 或者 'development'
  target: 'electron-main', // 目标环境设置为 Node.js
  entry: {
    main: './dist-vite/index.cjs',
    // extensionWorker: './dist-vite/extensionWorker.cjs',
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: '[name].cjs', // 使用 [name] 占位符来确保每个 chunk 有唯一的文件名
  },
  node: {
    __dirname: false, // 保持 __dirname 的原样（在 Node.js 中很重要）
    __filename: false,
  },
  optimization: {
    minimize: true, // 启用代码压缩和混淆
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: true, // 启用代码压缩
          mangle: true, // 混淆变量名称
        },
        extractComments: false, // 禁止生成 LICENSE.txt 文件
      }),
    ],
    splitChunks: {
      chunks: 'all', // 对所有类型的代码进行分割
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2, // 至少两个 chunk 共享的模块会被提取到 common chunk 中
          priority: -10,
          reuseExistingChunk: true,
        },
      },
    },
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.js$/,
  //       exclude: /node_modules/,
  //       use: 'babel-loader', // 如果需要转换现代 JavaScript 语法
  //     },
  //   ],
  // },
}
