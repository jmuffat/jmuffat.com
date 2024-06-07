import React from 'react'
import Link from 'next/link'
import {FormattedMessage} from 'react-intl'


const Nav = ()=> (
  <nav className="main-menu">
    <div className="brand"><Link href="/">jmuffat</Link></div>

    <ul>
      <li><Link href="/pzview"><FormattedMessage description="menu: pzView" defaultMessage="pzView"/></Link></li>
      <li><Link href="/baladovore"><FormattedMessage description="menu: baladovore" defaultMessage="baladovore"/></Link></li>
      <li><Link href="/webphotomag"><FormattedMessage description="menu: webphotomag" defaultMessage="webphotomag"/></Link></li>
      <li><Link href="/posts"><FormattedMessage description="menu: blog" defaultMessage="blog"/></Link></li>
      <li><Link href="/about"><FormattedMessage description="menu: about" defaultMessage="about"/></Link></li>
      {/*<li><Link href="/member"><i className="fas fa-user-circle fa-lg"></i></Link></li>*/}
    </ul>
  </nav>
);

export default Nav
