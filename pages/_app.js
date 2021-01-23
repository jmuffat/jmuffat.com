import React from 'react'
import {useRouter} from 'next/router'
import {IntlProvider} from 'react-intl'

import '../styles/globals.scss'

import msgEN from '../i18n/en-US/lang.json'
import msgFR from '../i18n/fr-FR/lang.json'

function loadMessages(locale) {
  switch(locale) {
    case 'fr-FR': return msgFR
    default:      return msgEN
  }
}

function MyApp({ Component, pageProps }) {

  const router = useRouter()
  const { locale, defaultLocale, pathname } = router
  const messages = loadMessages(locale)

  console.log(messages)

  return (
    <IntlProvider
      locale={locale}
      defaultLocale={defaultLocale}
      messages={messages} >

      <Component {...pageProps} />

    </IntlProvider>
  )
}

export default MyApp
