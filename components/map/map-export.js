function exportPart(P,part) {
  const fill = P.countries.includes(part.iso_a2)? P.colors.sel : P.colors.land
  const bbox = part.geometry.bbox

  if ( bbox.xMin > P.bbox.xMax
    || bbox.xMax < P.bbox.xMin
    || bbox.yMin > P.bbox.yMax
    || bbox.yMax < P.bbox.yMin
  ) return

  return {fill,path:part.geometry.svgPath}
}

export const generateSvg = P=>{
  const parts = P.dataCountries.map( part=>exportPart(P,part) )

  const groups = parts.reduce((cur,a)=>{
    if (a) {
      cur[a.fill] = cur[a.fill]? cur[a.fill]+a.path : a.path
    }

    return cur
  },{})

  const paths = Object.keys(groups).map(fill=>`<path d="${groups[fill]}" fill="${fill}" />`)

  return (
  `<svg viewBox="0 0 ${P.width} ${P.height}" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <clipPath id="clip"> <rect x="0" y="0" width="${P.width}" height="${P.height}" /> </clipPath>
    <rect fill="${P.colors.water}" id="background" width="${P.width+2}" height="${P.height+2}" y="-1" x="-1" />
    <g clip-path="url(#clip)">
      <g transform="scale(${P.scl} ${-P.scl}) translate(${P.trn.x} ${P.trn.y})"
         stroke="#000" stroke-width="${P.strokeWidth}" fill="none" >
        ${paths.join('\n')}
      </g>
    </g>
  </svg>`)
}
