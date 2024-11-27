"use client"
import React from 'react'
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image'
import { useRouter } from 'next/router'
import {FormattedMessage} from 'react-intl'

import Nav from './nav'

function LocaleSelector(props) {
  console.log(props)
  const router = useRouter()
  const {locales} = props

  return (
    <ul className="locale-selector">
      {router.locales.map( locale=>{
        const img = <Image src={`/img/${locale}.svg`} alt={locale} unoptimized/>
        const current = locale===router.locale? 'current ': ''
        const unavailable = locales.includes(locale)? '' : 'unavailable '
        return (
          <li key={locale} className={current+unavailable}>
            <Link href={router.pathname} locale={locale}>
              {img}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

function getAvailableLocales(locales,router) {
  if (!locales) return []
  if (Array.isArray(locales)) return locales

  // if (locales==='*') return router.locales
  return router.locales
}

function BasePage(props){
  const router = useRouter()
  const sectionClassName = props.extraClass? 'page-content '+props.extraClass : 'page-content'

  const locales = getAvailableLocales(props.locales,router)

  return (
    <div className="accept-youtube">
      <Head>
        <title>{props.title || "jmuffat"}</title>

        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="48x48" href="/android-icon-48x48.png"/>
        <link rel="manifest" href="/manifest.json"/>
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png"/>.
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png"/>
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png"/>
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png"/>
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png"/>
        <link rel="apple-touch-icon" sizes="72x72"   href="/apple-icon-72x72.png"/>

        <meta property="og:site_name" content="jmuffat.com" />

        {locales.map( locale =>{
          if (locale===router.locale) return null;
          const localeInUrl = locale===router.defaultLocale? '' : '/'+locale;

          return <link key={locale} rel="alternate" hrefLang={locale} href={`https://jmuffat.com${localeInUrl}${router.pathname}`}/>
        })}

      </Head>

      <header><Nav/></header>
      <div className={props.className || "container"}>
        <LocaleSelector locales={locales}/>
        <section className={sectionClassName}>
          {props.children}
        </section>
        <footer>
          <small><Link href="/privacy-policy"><FormattedMessage id="3zXjyR" description="in footer" defaultMessage="Privacy Policy"/></Link></small><br/>
          <small><Link href="/attribution"><FormattedMessage id="VRa0Qo" description="in footer" defaultMessage="Attribution"/></Link></small><br/>
          <small><FormattedMessage
            id="x4hSe8"
            description="in footer"
            defaultMessage="site authored by {jmm} and hosted by {vercel}"
            values={{
              jmm: <a href="mailto:jmuffat@webphotomag.com" target="_blank">Jérôme Muffat-Méridol</a>,
              vercel: <a href="https://vercel.com/" target="_blank">vercel.com</a>
            }}
          /></small><br/>
        </footer>
      </div>
    </div>
  )
}

export default BasePage;
