const martinez = require('martinez-polygon-clipping')

function mergeBbox(a,b) {
  return {
    xMin: Math.min(a.xMin, b.xMin),
    yMin: Math.min(a.yMin, b.yMin),
    xMax: Math.max(a.xMax, b.xMax),
    yMax: Math.max(a.yMax, b.yMax)
  }
}

function mergeGeometry(A,B) {
  return {
    bbox:  mergeBbox(A.bbox,B.bbox),
    shape: martinez.union(A.shape,B.shape)
  }
}

module.exports = {
  mergeGeometry
}
