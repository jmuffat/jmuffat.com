export async function loadMap(filename, projectionProc) {
  const url  = `https://s3.eu-west-3.amazonaws.com/jmuffat.com/map-data/${filename}`
  const res  = await fetch(url)
  const data = await res.json()

  const transformed = data.map(part=>{
    const svgPath = (
      part.geometry.points
      .map(A=>{
        const proj = projectionProc({lng:A.x,lat:A.y})
        return `${A.t} ${proj.x.toFixed(6)},${proj.y.toFixed(6)} `
      })
      .join('')
    )

    const bbox = part.geometry.bbox
    const res = {
      ...part,
      geometry: {
        bbox,
        svgPath
      }
    }

    return res
  })

  return transformed
}
