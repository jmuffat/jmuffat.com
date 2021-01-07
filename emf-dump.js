const fs = require('fs')

const EMR = require('./lib/emf-records')

const src = '/Users/jeromemuffat-meridol/Downloads/mapJmm.emf'

function hex(a) {
  const s = '00000000'+a.toString(16)
  return '0x'+s.slice(s.length-8)
}

async function run() {
  const buffer = await fs.promises.readFile(src)
  var offset = 0

  const revEMR = Object.keys(EMR).reduce(
    (cur,a)=>{
      cur[EMR[a]] = a
      return cur
    },
    {}
  )

  const rHeader = label=>{const a=buffer.readInt32LE(offset);offset+=4;console.log(`[${hex(a)} : ${revEMR[a]}]`); return a}
  const ri16 = label=>{const a=buffer.readInt16LE(offset);offset+=2;console.log(`${label}: ${a}`); return a}
  const ri32 = label=>{const a=buffer.readInt32LE(offset);offset+=4;console.log(`${label}: ${a}`); return a}
  const rCoord = label=>{const a=buffer.readInt32LE(offset);offset+=4;console.log(`${label}: ${(a/16).toFixed(2)}`); return a}
  // const ri32h = label=>{const a=buffer.readInt32LE(offset);offset+=4;console.log(`${label}: ${hex(a)}`); return a}
  const ru32h = label=>{const a=buffer.readUInt32LE(offset);offset+=4;console.log(`${label}: ${hex(a)}`); return a}
  const ri32f = label=>{const a=buffer.readFloatLE(offset);offset+=4;console.log(`${label}: ${a.toFixed(3)}`); return a}
  const rXY = label=>{const x=buffer.readInt32LE(offset),y=buffer.readInt32LE(offset+4);offset+=8;console.log(`${label}: (${(x/16).toFixed(2)},${(y/16).toFixed(2)})`)}
  const rRect = label=>{
    const l=buffer.readInt32LE(offset),
          t=buffer.readInt32LE(offset+4),
          r=buffer.readInt32LE(offset+8),
          b=buffer.readInt32LE(offset+12);
    offset+=16;
    console.log(`${label}: [(${l},${t}), (${r},${b})]`)
  }

  rHeader('header')
  const sz = ri32('size')
  rRect('bounds')
  rRect('frame')
  ru32h('signature')
  ru32h('emf.ver')
  ri32('bytes')
  const records = ri32('records')
  ri16('handles')
  ri16('reserved')
  const descLen = ri32('description.len')
  const descOfs = ri32('description.ofs')
  ri32('palette.entries')
  ri32('deviceSize.w')
  ri32('deviceSize.h')
  ri32('deviceSizeMm.w')
  ri32('deviceSizeMm.h')

  if (descOfs>88) {
    ri32('cbPixelFormat')
    ri32('offPixelFormat')
    ru32h('bOpenGL')
  }

  if (descOfs>100) {
    ri32('MicrometersX')
    ri32('MicrometersY')
  }

  offset = sz
  for(var i=1;i<records;i++) {
    const ofsHeader = offset
    console.log('-=-=-=-')
    const h = rHeader('header')
    const szHeader = ri32('size')

    switch(h){
      case 0x11: ru32h('mapMode'); break //EMR_SETMAPMODE
      case 0x12: ru32h('bkMode'); break // EMR_SETBKMODE
      case 0x13: ru32h('polyFillMode'); break // EMR_SETPOLYFILLMODE
      case 0x14: ru32h('rop2');break // EMR_SETROP2
      case 0x16: ru32h('textAlignMode'); break // EMR_SETTEXTALIGN
      case 0x18: ru32h('textColor');break // EMR_SETTEXTCOLOR
      case 0x1b: rXY('moveTo');break // EMR_MOVETOEX
      case 0x21: break // EMR_SAVEDC
      case 0x24: ri32f('M11');ri32f('M12');ri32f('M21'); ri32f('M22');ri32f('dx');ri32f('dy'); ru32h('mode'); break;
      case 0x25: ru32h('handle'); break // EMR_SELECTOBJECT
      case 0x27: ri32('ihBrush');ri32('style');ru32h('color');ru32h('hatchStyle'); break // EMR_CREATEBRUSHINDIRECT
      case 0x28: ru32h('handle'); break // EMR_DELETEOBJECT
      case 0x36: rXY('lineTo');break // EMR_LINETO
      case 0x3b: break // EMR_BEGINPATH
      case 0x3c: break // EMR_ENDPATH
      case 0x3d: break // EMR_CLOSEFIGURE
      case 0x3e: rRect('bounds'); break // EMR_FILLPATH
      case 0x3f: rRect('bounds'); break // EMR_STROKEANDFILLPATH
      case 0x43: ru32h('regionMode'); break // EMR_SELECTCLIPPATH
      case 0x5f: { // EMR_EXTCREATEPEN
        ri32('ihPen')
        ri32('offBmi')
        ri32('cbBmi')
        ri32('offBits')
        ri32('cbBits')
        ru32h('penStyle')
        ri32('width')
        ri32('brushStyle')
        ru32h('colorRef')
        ri32('brushHatch')
        ri32('numStyleEntries')
        ru32h('(?)')
      } break
    }

    offset = ofsHeader+szHeader
  }
}


run()
