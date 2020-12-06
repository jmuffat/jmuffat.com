import React from 'react'
import {PanZoom} from './pan-zoom'
import {loadMap} from './map-load'
import {useMapController} from './map-controller'

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
  const lng=A.x;
  const lat=Math.max(-85,Math.min(85,A.y));
  return {
    x: lng,
    y: Math.log(Math.tan( (45+lat/2)*D2R) ) *R2D
  }
}

const mercatorLatLon = M=>mercator({x:M.lng,y:M.lat});

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
  const [data,setData] = React.useState([])
  const colors = {
    water: "#f6f6f6", //"#cceeff",
    land:  "#ffffff", //"#f8f8f8",
    sel:   "#c00"
  }

  const [offset] = React.useState({x:0,y:0})
  const [redraw,setRedraw] = React.useState(Date.now())

  React.useEffect(()=>{
    loadMap('countries-50m.json',mercator)
    .then( data=>setData(data))
  },[])

  React.useEffect(()=>{
    if (!svgRef.current) return
    const controller = new PanZoom(svgRef.current,{
      onPan: delta=>{offset.x=offset.x+2*delta.x; offset.y=offset.y+2*delta.y; setRedraw(Date.now())}
    })

    return ()=>controller.close()
  },[svgRef?.current])


  if (!props.controller) return <p>[ (!) Map without controller]</p>

  const width = props.width  || 1024;
  const height= props.height ||  512;
  const aspect=height/width;
  const scaleScreen=Math.min(width,height)/2;

  if (!data.length) {
    return (
      <svg viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
        <rect fill={colors.water} id="background" width={width+2} height={height+2} y="-1" x="-1"/>
      </svg>
    )
  }

  const center   = mercatorLatLon(props.controller.center)
  const scaleMap = Math.pow(2,props.controller.zoomLevel)/180
  const countries = props.countries.split(' ').filter(a=>a.length>0)
  const stroke   = props.stroke || 0.5

  const strokeWidth = stroke/scaleMap/scaleScreen


  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      draggable={false}
      style={{userSelect:"none"}}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill={colors.water} id="background" width={width+2} height={height+2} y="-1" x="-1" onClick={props.onClick && (()=>props.onClick(null))}/>

      <g transform={`translate(${width/2+offset.x} ${height/2+offset.y}) scale(${scaleScreen})`} >
        <g transform={`scale(${scaleMap},${-scaleMap}) translate(${-center.x} ${-center.y})`} stroke="#000" strokeWidth={strokeWidth} fill="none">
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
      </g>
    </svg>
  );
}

Map.useMapController = useMapController
