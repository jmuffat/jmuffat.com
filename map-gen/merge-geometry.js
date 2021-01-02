const martinez = require('martinez-polygon-clipping')

function toGeojson(a) {
  const res = []
  var cur = null

  const close = ()=>{ if (cur) {cur.push(cur[0]);res.push([cur]);cur=null} }

  a.points.forEach( A=>{
    if (A.t==='M') close()
    if (cur) cur.push([A.x,A.y])
    else     cur = [[A.x,A.y]]
  })

  close()
  return res
}

function fromGeojson(geojson) {
  return (
    geojson
    .map(P=>{
      const outer = P[0]
      return outer.map( (M,i)=>({
        x:M[0],
        y:M[1],
        t:i?'L':'M'
      }))
    })
    .reduce((cur,a)=>cur.concat(a),[])
  )
}

function mergeBbox(a,b) {
  return {
    xMin: Math.min(a.bbox.xMin, b.bbox.xMin),
    yMin: Math.min(a.bbox.yMin, b.bbox.yMin),
    xMax: Math.max(a.bbox.xMax, b.bbox.xMax),
    yMax: Math.max(a.bbox.yMax, b.bbox.yMax)
  }
}

function mergeGeometry(a,b) {
  const gA = toGeojson(a)
  const gB = toGeojson(b)
  const gC = martinez.union(gA,gB)

  return {
    bbox:   mergeBbox(a,b),
    points: fromGeojson(gC)
  }
}

module.exports = {
  mergeGeometry
}
