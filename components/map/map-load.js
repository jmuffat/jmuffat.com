function updateBbox(bbox, A) {
  bbox.xMin = Math.min(A.x,bbox.xMin)
  bbox.xMax = Math.max(A.x,bbox.xMax)
  bbox.yMin = Math.min(A.y,bbox.yMin)
  bbox.yMax = Math.max(A.y,bbox.yMax)
}

function getDataURL(filename) {
  if (process.env.NEXT_PUBLIC_LOCALDATA>0) return `/api/map-data/${filename}`

  return `https://s3.eu-west-3.amazonaws.com/jmuffat.com/map-data/${filename}`
}

export async function loadMap(filename, projectionProc) {
  const url  = getDataURL(filename)
  const res  = await fetch(url)
  const data = await res.json()

  const subParts = data.reduce((cur,part)=>{
    var sub = null

    part.geometry.points.forEach(A=>{
      const proj = projectionProc({lng:A.x,lat:A.y})
      switch (A.t) {
        case 'M':
          if (sub) cur.push(sub)

          sub = {
            ...part,
            geometry: {
              svgPath:`M${proj.x.toFixed(6)},${proj.y.toFixed(6)}`,
              bbox: {
                xMin:A.x, yMin:A.y,
                xMax:A.x, yMax:A.y
              }
            }
          }
          break;

        default:
          sub.geometry.svgPath = sub.geometry.svgPath + `L${proj.x.toFixed(6)},${proj.y.toFixed(6)}`
          updateBbox(sub.geometry.bbox, A)
      }
    })

    if (sub) cur.push(sub)
    return cur
  }, [])

  return subParts
}
