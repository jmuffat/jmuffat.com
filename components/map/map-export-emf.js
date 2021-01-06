import * as martinez from 'martinez-polygon-clipping';
import {EmfBuilder} from '~/lib/emf'


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
    [       -2,        -2],
    [P.width+2,        -2],
    [P.width+2,P.height+2],
    [       -2,P.height+2],
    [       -2,        -2]
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

  return clipped
}

function writePaths(emf, P,data,borderColor,fillProc) {
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

  parts.forEach(part=>{
    if (!part) return
    emf.selectObject(emf.stock.BLACK_PEN)
    emf.selectObject(emf.stock.NULL_BRUSH)

    part.path.forEach(shape=>{
      const border = shape[0]

      emf.beginPath()
      border.forEach( (a,i)=>{
        if (i==0) emf.moveToEx(a[0],a[1])
        else      emf.lineTo(a[0],a[1])
      })
      emf.endPath()
      emf.strokeAndFillPath(0,0,-1,-1)
    })
  })
}

function writeClipPath(emf,P) {
  emf.beginPath()
  emf.moveToEx(    0,       0)
  emf.lineTo(P.width,       0)
  emf.lineTo(P.width,P.height)
  emf.lineTo(      0,P.height)
  emf.closeFigure()
  emf.endPath()
  emf.selectClipPath(0x05)
}

function writeBackground(emf,P) {
  const txtColor = `0x${P.colors.water.slice(1)}`

  const hBrush = emf.createBrushIndirect(0, parseInt(txtColor), 0x06)
  emf.selectObject(hBrush)

  emf.beginPath()
  emf.moveToEx(     -16,         -16)
  emf.lineTo(P.width+16,         -16)
  emf.lineTo(P.width+16, P.height+16)
  emf.lineTo(       -16, P.height+16)
  emf.closeFigure()
  emf.endPath()

  emf.fillPath(0,0,-1,-1)

  emf.selectObject(emf.stock.NULL_BRUSH)
  emf.deleteObject(hBrush)
}

export const generateEmf = P=>{
  const emf = new EmfBuilder({
    w: P.width,
    h: P.height
  })

  console.log({
    w: P.width,
    h: P.height
  })

  emf.setMapMode(/* MM_TEXT */ 0x01)
  emf.modifyWorldTransform(1,0, 0,1, 0,0, /* MWT_SET */ 0x04) // was /* MWT_LEFTMULTIPLY */ 0x02
  emf.setBkMode(/* TRANSPARENT */ 0x01)
  emf.setPolyFillMode(/* WINDING */ 0x02)
  emf.setTextAlign(/* TA_BASELINE */ 0x18)
  emf.setTextColor(0x00000000)
  emf.setROP2(/* R2_COPYPEN */ 0x0d)

  emf.selectObject(emf.stock.NULL_PEN)
  emf.selectObject(emf.stock.NULL_BRUSH)

  emf.saveDC()

  writeClipPath(emf, P)
  writeBackground(emf, P)

  const countries = P.onlySelected? P.dataCountries.filter(part=>P.countries.includes(part.iso_a2)) : P.dataCountries

  writePaths(emf, P, countries,       P.colors.countryBorder,  part=>P.getCountryFill(part))
  // writePaths(emf, P, P.dataDetailed,  P.colors.provinceBorder, part=>P.getProvinceFill(part))

  emf.restoreDC()
  emf.writeEOF()

  return emf.finishedBuffer()
}
