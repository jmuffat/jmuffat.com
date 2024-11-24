const path = require('path');
// const WorkerPlugin = require('worker-plugin');

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
  experimental: { 
    esmExternals: true
  },

  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  
  env: {
    ROOT: path.resolve(process.cwd())
  },

  i18n: i18nConfig.nextjsConfig,

  pageExtensions: ['js', 'md'],

  webpack: (config, options) => {
    config.resolve.alias['~'] = path.resolve(__dirname);

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
        options.defaultLoaders.babel,
        {loader:path.resolve('lib/post-loader.js'), options:{}}
      ]
    })

    // config.plugins.push( new WorkerPlugin({
    //   globalObject: 'self' // makes Hot Module Reloading work properly
    // }) )

    return config
  },

  redirects
}
