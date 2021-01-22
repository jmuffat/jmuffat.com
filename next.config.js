const path = require('path');
const WorkerPlugin = require('worker-plugin');

const i18nConfig = require('./i18n-config')

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

  i18n: i18nConfig.nextjsConfig,

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

    config.plugins.push( new WorkerPlugin({
      globalObject: 'self' // makes Hot Module Reloading work properly
    }) )

    return config
  },

  redirects
}
