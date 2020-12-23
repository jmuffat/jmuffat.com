import * as martinez from 'martinez-polygon-clipping';

function clipped(bboxA,bboxB) {
  return (
       bboxA.xMin > bboxB.xMax
    || bboxA.xMax < bboxB.xMin
    || bboxA.yMin > bboxB.yMax
    || bboxA.yMax < bboxB.yMin
  )
}

function processPath(P, s) {
  const geom = []

  const clipRect = [[
    [      0,       0],
    [P.width,       0],
    [P.width,P.height],
    [      0,P.height],
    [      0,       0]
  ]]


  for (var i=1 /* skip 'M'*/; i<s.length; ) {
    const jj = s.indexOf('L',i)
    const j = jj>0? jj : s.length
    const strCoords = s.substring(i,j)
    const v = strCoords.split(',')
    const x = P.scl*(parseFloat(v[0]) + P.trn.x)
    const y =-P.scl*(parseFloat(v[1]) + P.trn.y)

    geom.push( [x,y] )

    i=j+1 /* skip 'L' */
  }

  const clipped = martinez.intersection([geom],clipRect)
  if (!clipped || !clipped.length) return

  const processed = clipped.map(
    geom=>geom.reduce((processedCur,part)=>{
      const processedPart = part.reduce((cur,a)=>(
        cur?
          `${cur}L${a[0].toFixed(1)},${a[1].toFixed(1)}`
        :       `M${a[0].toFixed(1)},${a[1].toFixed(1)}`
      ),null)

      return processedCur+processedPart
    },'')
  )

  return processed.join()
}

function generatePaths(P,data,borderColor,fillProc) {
  if (!data) return ""
  const parts = data.map( part=>{
    if (clipped(part.geometry.bbox, P.bbox)) return
    const path = processPath(P, part.geometry.svgPath)
    if (!path) return

    return {
      fill: fillProc(part),
      path
    }
  })

  const groups = parts.reduce((cur,a)=>{
    if (a) {cur[a.fill] = cur[a.fill]? cur[a.fill]+a.path : a.path}
    return cur
  },{})

  return (
    Object.keys(groups)
    .map(fill=>`<path stroke="${borderColor}" fill="${fill}" d="${groups[fill]}" />`)
    .join('\n')
  )
}

export const generateSvg = P=>{
  const countryPaths = generatePaths(P, P.dataCountries, P.colors.countryBorder,  part=>P.getCountryFill(part))
  const regionPaths  = generatePaths(P, P.dataDetailed,  P.colors.provinceBorder, part=>P.getProvinceFill(part))

  return (
  `<svg viewBox="0 0 ${P.width} ${P.height}" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <!-- made with Jérôme Muffat-Méridol's SVG map generator at https://jmuffat.com/maps -->

    <rect fill="${P.colors.water}" id="background" width="${P.width+2}" height="${P.height+2}" y="-1" x="-1" />
    <g stroke-width="${P.strokeWidth*P.scl}" fill="none">
      ${regionPaths}
      ${countryPaths}
    </g>
  </svg>`)
}
