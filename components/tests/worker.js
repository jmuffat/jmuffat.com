
function workerProc(parm) {
  const {counter} = parm
  return `Hello, world ! (with counter = ${counter})`
}


addEventListener('message', event => {
  const {id,parm} = event.data
  const res = workerProc(parm)
  postMessage( {id,res} )
});
