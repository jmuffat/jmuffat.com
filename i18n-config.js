const locales = ['fr-FR', 'en-US']

const nextjsConfig = {
  locales,
  defaultLocale: 'en-US',
  ignoreRoutes: [
    '/download'
  ]
}

module.exports = {
  locales,
  nextjsConfig
}
