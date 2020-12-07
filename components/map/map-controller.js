import React from 'react'

const defaults = {
  center: {lng:0, lat:0},
  zoomLevel:0
}

class MapController {
  constructor(initialValues,setDummy) {
    const A = initialValues || defaults

    this.center = A.center
    this.zoomLevel = A.zoomLevel
    this.redraw = ()=>setDummy(Date.now())
  }

  setZoomLevel(k) {
    this.zoomLevel = k
    this.redraw()
  }

  setCenter(M) {
    this.center = M
    this.redraw()
  }
}

export function useMapController(initialValues) {
  const [dummy,setDummy] = React.useState(Date.now())
  const [controller] = React.useState( new MapController(initialValues,setDummy))

  return controller
}
