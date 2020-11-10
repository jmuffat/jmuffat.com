const path = require('path');

const pagesFolder = path.resolve(__dirname,'pages')

async function redirects() {
  // old blog used this format : /2020/03/04/my-first-paid-job
  return [
    {
      source: '/:yy(\\d{1,})/:mm(\\d{1,})/:dd(\\d{1,})/:slug',
      destination: '/posts/:yy:mm:dd-:slug',
      permanent: true
    }
  ]
}

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

  redirects
}
