import React from 'react'
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router'

import Nav from './nav';

function BasePage(props){
  const router = useRouter()
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

        <meta property="og:site_name" content="Mirandola" />
        <meta property="og:locale" content="en_GB" />
      </Head>

      <header><Nav/></header>
      <div className={props.className || "container"}>
        <section className="page-content">{props.children}</section>
        <footer>
          <small><Link href="/privacy-policy"><a>Privacy Policy</a></Link></small><br/>
          <small>site créé par Jérôme Muffat-Méridol, hébergé par <a href="https://vercel.com/" target="_blank">vercel.com</a></small>
          {/*<small><Link href="/cookies"><a>Cookies consent</a></Link></small>*/}
        </footer>
      </div>
    </div>
  )
}

export default BasePage;
