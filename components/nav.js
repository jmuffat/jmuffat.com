import React from 'react'
import Link from 'next/link'
import {FormattedMessage} from 'react-intl'


const Nav = ()=> (
  <nav className="main-menu">
    <div className="brand"><Link href="/"><a>jmuffat</a></Link></div>

    <ul>
      <li><Link href="/pzview"><a><FormattedMessage description="menu: pzView" defaultMessage="pzView"/></a></Link></li>
      <li><Link href="/baladovore"><a><FormattedMessage description="menu: baladovore" defaultMessage="baladovore"/></a></Link></li>
      <li><Link href="/webphotomag"><a><FormattedMessage description="menu: webphotomag" defaultMessage="webphotomag"/></a></Link></li>
      <li><Link href="/posts"><a><FormattedMessage description="menu: blog" defaultMessage="blog"/></a></Link></li>
      <li><Link href="/about"><a><FormattedMessage description="menu: about" defaultMessage="about"/></a></Link></li>
      {/*<li><Link href="/member"><a><i className="fas fa-user-circle fa-lg"></i></a></Link></li>*/}
    </ul>
  </nav>
);

export default Nav
