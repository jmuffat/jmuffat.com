function updateBbox(bbox, A) {
  bbox.xMin = Math.min(A[0],bbox.xMin)
  bbox.xMax = Math.max(A[0],bbox.xMax)
  bbox.yMin = Math.min(A[1],bbox.yMin)
  bbox.yMax = Math.max(A[1],bbox.yMax)
}

function getDataURL(filename) {
  if (process.env.NEXT_PUBLIC_LOCALDATA>0) return `/api/map-data/${filename}`

  return `https://s3.eu-west-3.amazonaws.com/jmuffat.com/map-data/${filename}`
}

export async function loadMapDirectory() {
  const url = getDataURL('directory.json')
  const res  = await fetch(url)
  return res.json()
}

function loadShape(part, A, projectionProc) {
  const border = A[0]
  var bbox = null

  const svgPath = border.reduce(
    (cur,a,i) => {
      const proj = projectionProc({lng:a[0],lat:a[1]})
      if (i) {
        updateBbox(bbox, a)
        return `${cur}L${proj.x.toFixed(6)},${proj.y.toFixed(6)}`
      }
      else {
        bbox = {
          xMin:a[0], yMin:a[1],
          xMax:a[0], yMax:a[1]
        }
        return `M${proj.x.toFixed(6)},${proj.y.toFixed(6)}`
      }
    },
    null
  )

  if (!svgPath) return

  return {
    ...part,
    geometry: {
      svgPath,
      bbox
    }
  }
}

export async function loadMap(filename, projectionProc) {
  const url  = getDataURL(filename)
  const res  = await fetch(url)
  const data = await res.json()

  const subParts = data.reduce((cur,part)=>{
    const sub = part.geometry.shape.map( A=>loadShape(part, A, projectionProc))
    if (sub.length) return cur.concat(sub)
    return cur
  }, [])

  return subParts
}
