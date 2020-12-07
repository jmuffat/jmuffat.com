import React from 'react'
import {PanZoom} from './pan-zoom'
import {loadMap} from './map-load'
import {useMapController} from './map-controller'

const defaultWidth = 1024
const defaultHeight=  512


function computeBbox(data) {
  return data.reduce(
    (cur,a)=>{
      if (!cur) return a.geometry.bbox
      return {
        xMin: Math.min(cur.xMin, a.geometry.bbox.xMin),
        yMin: Math.min(cur.yMin, a.geometry.bbox.yMin),
        xMax: Math.max(cur.xMax, a.geometry.bbox.xMax),
        yMax: Math.max(cur.yMax, a.geometry.bbox.yMax)
      }
    },
    null
  )
}

const D2R=Math.PI/180;
const R2D=180/Math.PI;

function mercator(A){
  const lng = A.lng;
  const lat = Math.max(-85,Math.min(85,A.lat));
  return {
    x: lng,
    y: Math.log(Math.tan( (45+lat/2)*D2R) ) *R2D
  }
}

function invMercator(A){
  return {
    lng: A.x,
    lat: 2*Math.atan( Math.exp(A.y/R2D) )/D2R - 90
  }
}


function TransformPart(props) {
  const {part, colors, onClick, onDoubleClick} = props
  const fill = props.countries.includes(part.iso_a2)? colors.sel : colors.land

  return (
    <g id={part.name}>
      <path
        d={part.geometry.svgPath}
        fill={fill}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      />
    </g>
  )
}

export function Map(props) {
  const svgRef = React.useRef(null)
  const [data110,setData110] = React.useState(null)
  const [data50,setData50] = React.useState(null)
  const [data10,setData10] = React.useState(null)
  const colors = {
    water: "#f6f6f6", //"#cceeff",
    land:  "#ffffff", //"#f8f8f8",
    sel:   "#c00"
  }

  function onPan(delta) {
    const C = props.controller
    if (!C) return

    const width = props.width  || defaultWidth
    const height= props.height || defaultHeight
    const scaleScreen = Math.min(width,height)/2
    const center = mercator(C.center)
    const scaleMap = Math.pow(2,C.zoomLevel)/180
    const scl = scaleMap*scaleScreen

    const offsetCenter = {
      x: center.x-delta.x/scl,
      y: center.y+delta.y/scl
    }

    C.center = invMercator(offsetCenter)
    C.redraw()
  }

  React.useEffect(()=>{
    loadMap('countries-110m.json',mercator)
    .then( a=>setData110(a))
    .then(()=>loadMap('countries-50m.json',mercator))
    .then( a=>setData50(a))
    .then(()=>loadMap('countries-10m.json',mercator))
    .then( a=>setData10(a))
  },[])

  React.useEffect(()=>{
    if (!svgRef.current) return
    const controller = new PanZoom(svgRef.current,{onPan})

    return ()=>controller.close()
  },[svgRef?.current])


  const C = props.controller
  if (!C) return <p>[ (!) Map without controller]</p>


  const width = props.width  || defaultWidth
  const height= props.height || defaultHeight
  const scaleScreen = Math.min(width,height)/2;

  const center = mercator(C.center)
  const scaleMap = Math.pow(2,C.zoomLevel)/180
  const countries = props.countries.split(' ').filter(a=>a.length>0)

  const stroke   = props.stroke || 0.5
  const strokeWidth = stroke/scaleMap/scaleScreen

  const scl = scaleMap*scaleScreen
  const trn = {
    x:   width/2/scl - center.x,
    y: -height/2/scl - center.y
  }

  const data = (
    (!!data10 && C.zoomLevel>=4.5) ?  data10
   :(!!data50 && C.zoomLevel>=2.0) ?  data50
   :                                  data110
  )

  if (!data) {
    return (
      <svg viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
        <rect fill={colors.water} id="background" width={width+2} height={height+2} y="-1" x="-1"/>
      </svg>
    )
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      draggable={false}
      style={{userSelect:"none"}}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill={colors.water} id="background" width={width+2} height={height+2} y="-1" x="-1" onClick={props.onClick && (()=>props.onClick(null))}/>

      <g
        transform={`scale(${scl} ${-scl}) translate(${trn.x} ${trn.y})`}
        stroke="#000" strokeWidth={strokeWidth} fill="none" >

        { data.map(part=> (
          <TransformPart
            key={part.name}
            part={part}
            colors={colors}
            countries={countries}
            onClick={props.onClick && (()=>props.onClick(part))}
            onDoubleClick={props.onDoubleClick && (()=>props.onDoubleClick(part))}
          />
        )) }

      </g>
    </svg>
  );
}

Map.useMapController = useMapController
