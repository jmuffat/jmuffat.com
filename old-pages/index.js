import React from 'react';
import Link from 'next/link'
import {FormattedMessage} from 'react-intl'

import BasePage from '@/components/base-page';
import CVDownload from '@/components/cvjmm';

function Home(props) {
  return (
    <BasePage locales="*">
      <br/>
      <br/>
      <div className="big-logo">
        <Link href="/posts"><img src="img/2019-jerlock.jpg" width={256} height={256}/></Link>
        <div id="title">jmuffat</div>
        <div id="subtitle"><FormattedMessage
          description="moto"
          defaultMessage="what can be done can be done better"
        /></div>
      </div>

      <br/>
      <br/>

      <CVDownload/>

      <div className="frontpage-icon">
        <Link href="/maps">
          <img src="/img/map.svg" height="48"/><br/>
          maps
        </Link>
      </div>

    </BasePage>
  );
}

export default Home
