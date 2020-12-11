function clipped(bboxA,bboxB) {
  return (
       bboxA.xMin > bboxB.xMax
    || bboxA.xMax < bboxB.xMin
    || bboxA.yMin > bboxB.yMax
    || bboxA.yMax < bboxB.yMin
  )
}

function generatePaths(P,data,borderColor,fillProc) {
  const parts = data.map( part=>{
    if (clipped(part.geometry.bbox, P.bbox)) return
    return {
      fill: fillProc(part),
      path: part.geometry.svgPath
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
    <clipPath id="clip"> <rect x="0" y="0" width="${P.width}" height="${P.height}" /> </clipPath>
    <rect fill="${P.colors.water}" id="background" width="${P.width+2}" height="${P.height+2}" y="-1" x="-1" />
    <g xclip-path="url(#clip)">
      <g transform="scale(${P.scl} ${-P.scl}) translate(${P.trn.x} ${P.trn.y})"
         stroke-width="${P.strokeWidth}" fill="none" >
        ${regionPaths}
        ${countryPaths}
      </g>
    </g>
  </svg>`)
}
