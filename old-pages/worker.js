import React from 'react'
import Link from 'next/link'

import {useWorker} from '@/components/worker'
import BasePage from '@/components/base-page';


function Page() {
  const worker = useWorker( ()=>new Worker('@/components/tests/worker.js',{type: 'module'}) )

  const [result, setResult] = React.useState('')
  const [counter, setCounter] = React.useState(0)

  const onClick= async e=>{
    const a = counter
    setCounter(a+1)

    const res = await worker.call({counter:a})
    setResult(res)
  }

  return (
    <BasePage>
      <h1>Web Worker Test</h1>
      <p>result: <em>{result}</em></p>
      <button onClick={onClick}>Test</button>
    </BasePage>
  )
}

export default Page
