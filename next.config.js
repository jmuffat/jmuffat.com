const path = require('path');

const pagesFolder = path.resolve(__dirname,'pages')

module.exports = {
  env: {
    ROOT: path.resolve(process.cwd())
  },

  pageExtensions: ['js', 'md'],

  webpack: (config, {isServer}) => {
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }

    config.resolve.alias['~'] = path.resolve(__dirname);

    const jsLoader = config.module.rules.find(f => f.test.test('.js'))
    const loaders = Array.isArray(jsLoader.use)? jsLoader.use : [jsLoader.use]

    // config.module.rules.push({
    //   test: /\.(graphql|gql)$/,
    //   exclude: /node_modules/,
    //   loader: 'graphql-tag/loader',
    // });

    config.module.rules.push({
      test: /\.md$/,
      exclude: pagesFolder,
      use: 'raw-loader'
    })

    config.module.rules.push({
      test: /\.md$/,
      include: pagesFolder,
      use: [
        ...loaders,
        {loader:path.resolve('lib/post-loader.js'), options:{}}
      ]
    })

    return config
  },
}
