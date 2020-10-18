import React from 'react'
import Link from 'next/link'

const Nav = ()=> (
  <nav className="main-menu">
    <div className="brand"><Link href="/"><a>jmuffat</a></Link></div>

    <ul>
      <li><Link href="/posts"><a>News</a></Link></li>
      <li><Link href="/about"><a>About</a></Link></li>
      <li><Link href="/member"><a><i className="fas fa-user-circle fa-lg"></i></a></Link></li>
    </ul>
  </nav>
);

export default Nav
