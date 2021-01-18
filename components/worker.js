import React from 'react'

class AsyncWorker {
  constructor(worker) {
    this.worker = worker
    this.nextId = 1
    this.pending = {}

    worker.onmessage = ev => this.onMessage(ev)
  }

  close() {
    this.worker = null
  }

  call(parm) {
    if (!this.worker) return Promise.reject(new Error('worker is closed'))

    return new Promise((resolve,reject)=>{
      const id = this.nextId++
      this.pending[id] = res=>resolve(res)
      this.worker.postMessage({id,parm})
    })
  }

  onMessage(ev) {
    const {id,res} = ev.data
    const resolver = this.pending[id]
    if (!resolver) throw new Error(`Unknown worker id = ${id}`)
    resolver(res)
    delete this.pending[id]
  }
}

export function makeWorker(worker) {
  return new AsyncWorker(worker)
}

export function useWorker(createWorker) {
  const [worker, setWorker] = React.useState(null)

  React.useEffect(
    ()=>{
      const w = createWorker()
      const asyncWorker = new AsyncWorker(w)
      setWorker(asyncWorker)
      return ()=>w.close()
    },
    []
  )

  return worker
}
