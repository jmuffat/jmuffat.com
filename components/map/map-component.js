import React from 'react'

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

function TransformPolyline(props){
  const {points,colors} = props

  const s = (
    points
    .map(A=>{
      const proj = mercator(A)
      return `${A.t} ${proj.x.toFixed(6)},${proj.y.toFixed(6)} `
    })
    .join('')
  )

  return <path d={s+' Z'} fill={props.fill} onClick={props.onClick} onDoubleClick={props.onDoubleClick}/>
}

function TransformPart(props) {
  const {part, colors, onClick, onDoubleClick} = props
  const fill = props.countries.includes(part.iso_a2)? colors.sel : colors.land

  return (
    <g id={part.name}>
      <TransformPolyline
        points={part.geometry.points}
        fill={fill}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      />
    </g>
  )
}

export function Map(props) {
  const [data,setData] = React.useState([])
  const colors = {
    water: "#f6f6f6", //"#cceeff",
    land:  "#ffffff", //"#f8f8f8",
    sel:   "#c00"
  }

  const [offset,setOffset] = React.useState({x:0,y:0})
  const [dragState] = React.useState({})

  React.useEffect(()=>{
    fetch('https://s3.eu-west-3.amazonaws.com/jmuffat.com/map-data/countries-50m.json')
    .then( res=>res.json())
    .then( data=>setData(data))
  },[])

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

  const bbox = computeBbox(data)

  const llmin= props.minCoord || {lng:bbox.xMin,lat:bbox.yMin}
  const llmax= props.maxCoord || {lng:bbox.xMax,lat:bbox.yMax}
  const stroke = props.stroke || 0.5

  const min = mercatorLatLon(llmin);
  const max = mercatorLatLon(llmax);

  const center = {
    x: (max.x+min.x)/2,
    y: (max.y+min.y)/2
  };

  const range = {
    x: (max.x-min.x)/2,
    y: (max.y-min.y)/2
  };

  const scaleMap=Math.min(2/range.x,2*aspect/range.y);
  const strokeWidth = stroke/scaleMap/scaleScreen

  const countries = props.countries.split(' ').filter(a=>a.length>0)

  const onMouseDown = downEvent=>{
    const startX = downEvent.pageX - offset.x
    const startY = downEvent.pageY - offset.y

    const handler = moveEvent=>{
      if (!moveEvent) return
      setOffset({x:moveEvent.pageX-startX, y:moveEvent.pageY-startY});
    }

    document.addEventListener('mousemove', handler)
    dragState.onMouseMove = handler
  }

  const onMouseUp = upEvent=>{
    if (dragState.onMouseMove) {
      document.removeEventListener('mousemove', dragState.onMouseMove);
      dragState.onMouseMove = null
    }
  }


  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onDragStart={()=>false}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill={colors.water} id="background" width={width+2} height={height+2} y="-1" x="-1"/>
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
