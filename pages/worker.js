import React from 'react'
import Link from 'next/link'

import BasePage from '~/components/base-page';

import {TestWorker} from '~/test-worker'

var gWorker = null

function Page() {
  React.useEffect(
    ()=>{
      if (!gWorker) gWorker = new TestWorker()
    },
    []
  )

  return (
    <BasePage>
      <h1>Web Worker Test</h1>
      <p>testing</p>
    </BasePage>
  )
}

export default Page
