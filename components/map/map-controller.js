import React from 'react'

const defaults = {
  center: {lng:0, lat:0},
  zoomLevel:0
}

export function useMapController(initialValues) {
  const A = initialValues || defaults

  const [center,setCenter] = React.useState(A.center)
  const [zoomLevel,setZoomLevel] = React.useState(A.zoomLevel)

  return {
    center,
    zoomLevel,

    setCenter,
    setZoomLevel
  }
}
