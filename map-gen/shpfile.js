const fs = require('fs')
const path = require('path')
const parseDBF = require('parsedbf')

const {githubFetchBuffer} = require('./github')

const gitOwner = 'nvkelso'
const gitRepo  = 'natural-earth-vector'

function readDouble(buffer,index) {
  return parseFloat( buffer.readDoubleLE(index).toFixed(6) )
}

function filterKeys(a,keys) {
  return keys.reduce(
    (cur,k)=>{
      if (a[k]!=undefined) cur[k.toLowerCase()] = a[k]
      return cur
    },
    {}
  )
}

const shapeTypeName = {
  '0' : 'NullShape',
  '1' : 'Point',
  '3' : 'Polyline',
  '5' : 'Polygon',
  '8' : 'Multipoint',
  '11': 'PointZ',
  '13': 'PolylineZ',
  '15': 'PolygonZ',
  '18': 'MultiPointZ',
  '21': 'PointM',
  '23': 'PolyLineM',
  '25': 'PolygonM',
  '28': 'MultiPointM',
  '31': 'MultiPatch'
}

function decodeHeader(buffer){
  return {
    fileCode: buffer.readInt32BE(0),
    fileLength: buffer.readInt32BE(24),
    version: buffer.readInt32LE(28),
    shapeType: shapeTypeName[buffer.readInt32LE(32)],
    bbox: {
      xMin: readDouble(buffer,36),
      yMin: readDouble(buffer,44),
      xMax: readDouble(buffer,52),
      yMax: readDouble(buffer,60),
      zMin: readDouble(buffer,68),
      zMax: readDouble(buffer,76),
      mMin: readDouble(buffer,84),
      mMax: readDouble(buffer,92),
    }
  };
}

function loadPolyLine(buffer){
  var polyline={
    bbox: {
      xMin: readDouble(buffer, 4),
      yMin: readDouble(buffer,12),
      xMax: readDouble(buffer,20),
      yMax: readDouble(buffer,28),
    },
    points:[]
  };
  const numParts = buffer.readInt32LE(36);
  const numPoints = buffer.readInt32LE(40);

  const startPoints = 44+4*numParts;
  const bufferParts  = buffer.slice(44, startPoints);
  const bufferPoints = buffer.slice(startPoints, startPoints+numPoints*16);

  for(var i=0; i<numPoints; i++){
    const a = {
      x: readDouble(bufferPoints, i*16),
      y: readDouble(bufferPoints, i*16+8),
      t:'L'
    };
    polyline.points[i]=a;
  }

  for(var i=0; i<numParts; i++){
    const pt = bufferParts.readInt32LE(i*4);
    polyline.points[pt].t='M';
  }

  return polyline;
}

async function loadBuffer(relPath) {
  const filepath = path.join(process.env.NATURAL_EARTH_PATH,relPath)
  return fs.promises.readFile(filepath)
}

async function loadShapes(dataset,keys,fixup=a=>a){
  const basePath = process.env.NATURAL_EARTH_PATH;

  const [shpData,dbfData] = await Promise.all([
    // githubFetchBuffer(gitOwner, gitRepo, dataset+'.shp'),
    // githubFetchBuffer(gitOwner, gitRepo, dataset+'.dbf')
    loadBuffer(dataset+'.shp'),
    loadBuffer(dataset+'.dbf'),
  ])

  const dbf = parseDBF(dbfData);

  const res=[];

  const buffer = shpData;
  const header = decodeHeader(buffer);

  for(var i=100; i<header.fileLength*2; ) {
    const recNo = buffer.readInt32BE(i);
    const len = buffer.readInt32BE(i+4);

    const record = buffer.slice(i+8,i+8+len*2);
    const shapeType=record.readInt32LE(0);

    const shape = filterKeys( fixup(dbf.shift()),keys)

    switch (shapeType){
      case 5:
      case 3:
        shape.geometry = loadPolyLine(record)
        break;

      default: console.log(`shapeType:${shapeType}`)
    }

    res.push(shape)
    i += (4+len)*2;
  }

  return res;
}


module.exports = {
  loadShapes
}
