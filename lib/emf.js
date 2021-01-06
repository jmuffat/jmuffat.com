const EMR = require('./emf-records')

const emfStock = {
  WHITE_BRUSH:            0x80000000,
  LTGRAY_BRUSH:           0x80000001,
  GRAY_BRUSH:             0x80000002,
  DKGRAY_BRUSH:           0x80000003,
  BLACK_BRUSH:            0x80000004,
  NULL_BRUSH:             0x80000005,
  WHITE_PEN:              0x80000006,
  BLACK_PEN:              0x80000007,
  NULL_PEN:               0x80000008,
  OEM_FIXED_FONT:         0x8000000A,
  ANSI_FIXED_FONT:        0x8000000B,
  ANSI_VAR_FONT:          0x8000000C,
  SYSTEM_FONT:            0x8000000D,
  DEVICE_DEFAULT_FONT:    0x8000000E,
  DEFAULT_PALETTE:        0x8000000F,
  SYSTEM_FIXED_FONT:      0x80000010,
  DEFAULT_GUI_FONT:       0x80000011,
  DC_BRUSH:               0x80000012,
  DC_PEN:                 0x80000013
}

const defaults = {
  w:1920,
  h:1080,
  dpi:75,
  maxSize:1024*1024,
  description: 'http://jmuffat.com'
}

export class EmfBuilder {
  constructor(opt) {
    this.opt = {
      ...defaults,
      ...opt
    }

    this.stock = emfStock

    this.buffer = new ArrayBuffer(this.opt.maxSize)
    this.dataView = new DataView(this.buffer)
    this.offset = 0
    this.records = 1
    this.handles = 0 // NB: handles are numbered 1-n (ie handle 0 is reserved)

    this.offset = this.writeFileHeader()
  }

  finishedBuffer() {
    this.writeFileHeader()
    return this.buffer.slice(0,this.offset)
  }

  writeInt8(a)    {this.dataView.setInt8(  this.offset, a, true); this.offset+=1}
  writeUInt8(a)   {this.dataView.setUInt8( this.offset, a, true); this.offset+=1}
  writeInt16(a)   {this.dataView.setInt16( this.offset, a, true); this.offset+=2}
  writeUInt16(a)  {this.dataView.setUInt16(this.offset, a, true); this.offset+=2}
  writeInt32(a)   {this.dataView.setInt32( this.offset, a, true); this.offset+=4}
  writeUInt32(a)  {this.dataView.setUInt32(this.offset, a, true); this.offset+=4}
  writeInt64(a)   {this.dataView.setBigInt64( this.offset, a, true); this.offset+=8}
  writeUInt64(a)  {this.dataView.setBigUInt64(this.offset, a, true); this.offset+=8}
  writeFloat32(a) {this.dataView.setFloat32(this.offset, a, true); this.offset+=4}
  writeFloat64(a) {this.dataView.setFloat64( this.offset, a, true); this.offset+=8}
  writeCoord(a)   {this.writeInt32(a*16)}

  writeFileHeader() {

    const kZarbi = 1.666 // Why is this necessary ???

    const bounds = {
      left:   kZarbi*0,
      top:    kZarbi*0,
      right:  kZarbi*this.opt.w,
      bottom: kZarbi*this.opt.h
    }

    const k = 2540/this.opt.dpi
    const frame = {
      left:   k*bounds.left,
      top:    k*bounds.top,
      right:  k*bounds.right,
      bottom: k*bounds.bottom,
    }

    const szHeader = 108
    this.dataView.setInt32(  0, EMR.EMR_HEADER, true)
    this.dataView.setInt32(  4, szHeader, true)
    // bounds in logical units
    this.dataView.setInt32(  8, bounds.left*16, true)
    this.dataView.setInt32( 12, bounds.top*16, true)
    this.dataView.setInt32( 16, bounds.right*16, true)
    this.dataView.setInt32( 20, bounds.bottom*16, true)
    // frame in .01 millimeter units,
    this.dataView.setInt32( 24, frame.left, true)
    this.dataView.setInt32( 28, frame.top, true)
    this.dataView.setInt32( 32, frame.right, true)
    this.dataView.setInt32( 36, frame.bottom, true)
    this.dataView.setInt32( 40, /* ENHMETA_SIGNATURE */ 0x464D4520, true)
    this.dataView.setInt32( 44, /* EMF version  */ 0x00010000, true)
    this.dataView.setInt32( 48, /* Bytes        */ this.offset, true)
    this.dataView.setInt32( 52, /* Records      */ this.records, true)
    this.dataView.setInt16( 56, /* Handles      */ this.handles, true)
    this.dataView.setInt16( 58, /* Reserved     */ 0, true)
    this.dataView.setInt32( 60, /* nDescription */ 0, true)
    this.dataView.setInt32( 64, /* offDescription */ szHeader, true)
    this.dataView.setInt32( 68, /* nPalEntries  */ 0, true)
    // deviceSize in logical units
    this.dataView.setInt32( 72, 1920, true)
    this.dataView.setInt32( 76, 1080, true)
    // Millimeters = device size in .01 millimeter units
    this.dataView.setInt32( 80, 68, true)
    this.dataView.setInt32( 84, 38, true)

    this.dataView.setInt32( 88, 0, true)        // cbPixelFormat: 0x00000000
    this.dataView.setInt32( 92, szHeader, true) // offPixelFormat: 0x00000000
    this.dataView.setInt32( 96, 0, true)        // bOpenGL
    this.dataView.setInt32(100, 1920000, true)  // MicrometersX
    this.dataView.setInt32(104, 1080000, true)  // MicrometersY

    return szHeader
  }

  writeRecHeader(id,sz) {
    this.writeInt32(id)
    this.writeInt32(sz)
    this.records++
  }

  writeEOF() {
    this.writeRecHeader(EMR.EMR_EOF, 16)
    this.writeInt32(/* nPalEntries   */  0)
    this.writeInt32(/* offPalEntries */  0)
  }

  setMapMode(mapMode) {
    this.writeRecHeader(EMR.EMR_SETMAPMODE, 12);
    this.writeInt32(mapMode)
  }

  modifyWorldTransform(M11,M12,M21,M22,dx,dy, mode) {
    this.writeRecHeader(EMR.EMR_MODIFYWORLDTRANSFORM, 36)
    this.writeFloat32(M11);
    this.writeFloat32(M12);
    this.writeFloat32(M21)
    this.writeFloat32(M22);
    this.writeFloat32(dx);
    this.writeFloat32(dy)
    this.writeInt32(mode)
  }

  setBkMode(mode) {
    this.writeRecHeader(EMR.EMR_SETBKMODE, 12)
    this.writeInt32(mode)
  }

  setPolyFillMode(mode) {
    this.writeRecHeader(EMR.EMR_SETPOLYFILLMODE, 12)
    this.writeInt32(mode)
  }

  setTextAlign(mode) {
    this.writeRecHeader(EMR.EMR_SETTEXTALIGN, 12)
    this.writeInt32(mode)
  }

  setTextColor(color) {
    this.writeRecHeader(EMR.EMR_SETTEXTCOLOR, 12)
    this.writeInt32(color)
  }

  setROP2(rop2) {
    this.writeRecHeader(EMR.EMR_SETROP2, 12)
    this.writeInt32(rop2)
  }

  saveDC() {
    this.writeRecHeader(EMR.EMR_SAVEDC, 8)
  }

  restoreDC() {
    this.writeRecHeader(EMR.EMR_RESTOREDC, 8)
  }

  beginPath() {
    this.writeRecHeader(EMR.EMR_BEGINPATH, 8)
  }

  endPath() {
    this.writeRecHeader(EMR.EMR_ENDPATH, 8)
  }

  moveToEx(x,y) {
    this.writeRecHeader(EMR.EMR_MOVETOEX, 16)
    this.writeCoord(x)
    this.writeCoord(y)
  }

  lineTo(x,y) {
    this.writeRecHeader(EMR.EMR_LINETO, 16)
    this.writeCoord(x)
    this.writeCoord(y)
  }

  closeFigure() {
    this.writeRecHeader(EMR.EMR_CLOSEFIGURE, 8)
  }

  selectClipPath(mode) {
    this.writeRecHeader(EMR.EMR_SELECTCLIPPATH, 12)
    this.writeInt32(mode)
  }

  createBrushIndirect(style, color, hatch) {
    const ihBrush = ++this.handles
    this.writeRecHeader(EMR.EMR_CREATEBRUSHINDIRECT, 24)
    this.writeInt32(ihBrush)
    this.writeInt32(style)
    this.writeInt32(color)
    this.writeInt32(hatch)
    return ihBrush
  }

  extCreatePen(penStyle,width,brushStyle,colorRef,brushHatch) {
    const ihPen = ++this.handles
    this.writeRecHeader(EMR.EMR_EXTCREATEPEN, 52)
    this.writeInt32(ihPen)
    this.writeInt32(/* offBmi */ 0)
    this.writeInt32(/* cbBmi */ 0)
    this.writeInt32(/* offBits */ 0)
    this.writeInt32(/* cbBits */ 0)
    this.writeInt32(penStyle)
    this.writeInt32(width)
    this.writeInt32(brushStyle)
    this.writeInt32(colorRef)
    this.writeInt32(brushHatch)
    this.writeInt32(/* NumStyleEntries */ 0)
  }

  selectObject(ihObject) {
    this.writeRecHeader(EMR.EMR_SELECTOBJECT, 12)
    this.writeInt32(ihObject)
  }

  deleteObject(ihObject) {
    this.writeRecHeader(EMR.EMR_DELETEOBJECT, 12)
    this.writeInt32(ihObject)
  }

  fillPath(left,top,right,bottom) {
    this.writeRecHeader(EMR.EMR_FILLPATH, 24)
    this.writeInt32(left)
    this.writeInt32(top)
    this.writeInt32(right)
    this.writeInt32(bottom)
  }

  strokeAndFillPath(left,top,right,bottom) {
    this.writeRecHeader(EMR.EMR_STROKEANDFILLPATH, 24)
    this.writeInt32(left)
    this.writeInt32(top)
    this.writeInt32(right)
    this.writeInt32(bottom)
  }

  setMiterLimit(miterLimit) {
    this.writeRecHeader(EMR.EMR_SETMITERLIMIT, 12)
    this.writeInt32(miterLimit)
  }

  writePolygon(points) {
    const O = points[0]
    const bounds = points.reduce(
      (cur,M)=>({
        left:   Math.min(cur.left,  M[0]),
        top:    Math.min(cur.top,   M[1]),
        right:  Math.max(cur.right, M[0]),
        bottom: Math.max(cur.bottom,M[1])
      }),
      {
        left:   O[0],
        top:    O[1],
        right:  O[0],
        bottom: O[1]
      }
    )

    this.writeInt32(EMR.EMR_POLYGON)
    this.writeInt32(/* recordSize = */ 7*4 + points.length*8)
    this.writeInt32(bounds.left)
    this.writeInt32(bounds.top)
    this.writeInt32(bounds.right)
    this.writeInt32(bounds.bottom)
    this.writeInt32(points.length)
    points.forEach(M=>{
      this.writeInt32(M[0])
      this.writeInt32(M[1])
    })

    this.records++
  }
}
