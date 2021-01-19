import React from 'react';
import {mercator} from './mercator';

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
      xMin: buffer.readDoubleLE(36),
      yMin: buffer.readDoubleLE(44),
      xMax: buffer.readDoubleLE(52),
      yMax: buffer.readDoubleLE(60),
      zMin: buffer.readDoubleLE(68),
      zMax: buffer.readDoubleLE(76),
      mMin: buffer.readDoubleLE(84),
      mMax: buffer.readDoubleLE(92),
    }
  };
}

function loadPolyLine(buffer){
  var polyline={
    bbox: {
      xMin: buffer.readDoubleLE( 4),
      yMin: buffer.readDoubleLE(12),
      xMax: buffer.readDoubleLE(20),
      yMax: buffer.readDoubleLE(28),
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
      x: bufferPoints.readDoubleLE(i*16),
      y: bufferPoints.readDoubleLE(i*16+8),
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

function loadData(url, abortController){
  return (
    window.fetch(url, abortController)
    .then(response=>response.arrayBuffer())
    .then(data=>{
      const res=[];
      const buffer = new Buffer(data);
      const header = decodeHeader(buffer);

      for(var i=100; i<header.fileLength*2; ) {
        const recNo = buffer.readInt32BE(i);
        const len = buffer.readInt32BE(i+4);

        const record = buffer.slice(i+8,i+8+len*2);
        const shapeType=record.readInt32LE(0);

        switch (shapeType){
          case 3: res.push(loadPolyLine(record)); break;
        }

        i += (4+len)*2;
      }

      return res;
    })
  );
}

function convertMercator(data){
  return data.map(polyline=>({
    ...polyline,
    points: polyline.points.map(A=>({...A, ...mercator(A)}))
  }));
}

var loadCoastlinesPromise = {};
export function loadCoastlines(url, abortController) {
  if (!loadCoastlinesPromise[url]) {
    loadCoastlinesPromise[url] = (
      loadData(url, abortController)
      .then(data=>convertMercator(data))
    );
  }

  return loadCoastlinesPromise[url];
}

function convert3D(data){
  return data.map(polyline=>({
    ...polyline,
    points: polyline.points.map(A=>{
      const u= A.x/180.0*Math.PI;
      const v=-A.y/180.0*Math.PI;

      return {
        ...A,
        x: Math.sin(u)*Math.cos(v),
        y: Math.cos(u)*Math.cos(v),
        z: Math.sin(v)
      }
    })
  }));
}

var loadCoastlines3DPromise = {};
export function loadCoastlines3D(url, abortController) {
  if (!loadCoastlines3DPromise[url]) {
    loadCoastlines3DPromise[url] = (
      loadData(url, abortController)
      .then(data=>convert3D(data))
    );
  }

  return loadCoastlines3DPromise[url];
}

export function useGeoshape(url) {
  const state = React.useState(null);
  const [data,setData] = state;

  React.useEffect(()=>{
    const abortController = new AbortController();

    loadCoastlines(url,abortController)
    .then(data=>setData(data));

    return ()=>abortController.abort();
  },[]);

  return state;
}

export function useGeoshape3D(url) {
  const state = React.useState(null);
  const [data,setData] = state;

  React.useEffect(()=>{
    const abortController = new AbortController();

    loadCoastlines3D(url,abortController)
    .then(data=>setData(data));

    return ()=>abortController.abort();
  },[]);

  return state;
}
