import React from 'react';
import Link from 'next/link'
import BasePage from '~/components/base-page';

export default function (props) {
  return (
    <BasePage>
      <br/>
      <br/>
      <div className="big-logo">
        <Link href="/posts"><a><img src="img/2019-jerlock.jpg" width={256} height={256}/></a></Link>
        <div id="title">jmuffat</div>
        <div id="subtitle">what can be done can be done better</div>
      </div>
    </BasePage>
  );
}
