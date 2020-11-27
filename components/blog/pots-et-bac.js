import React from 'react'
import {useRouter} from 'next/router'


function SimulSVG(props) {
  const {width,height} = props
  const dim = Math.max(width,height)
  const canvasDim = 1.05*dim
  const scale = 512/canvasDim
  const x = (canvasDim-width)/2
  const y = (canvasDim-height)/2

  return (
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
     <g>
      <rect x="-1" y="-1" width="514" height="514" id="canvas_background" fill="#ccc"/>
     </g>
     <g transform={`scale(${scale}) translate(${x},${y})`}>
      <rect width={width} height={height} x={0} y={0} fillOpacity="null" strokeOpacity="null" strokeWidth="0.01" stroke="#000" fill="#fff"/>
      {props.circles.map((a,i)=>(
          <ellipse key={i} rx={0.5} ry={0.5} cx={a.cx} cy={a.cy} fillOpacity="null" strokeOpacity="null" strokeWidth="0.01" stroke="#000" fill="#eee"/>
      ))}
     </g>
    </svg>
  )
}


function fitCircles_square(width,height) {
  var circles = []

  for(var cy=0.5; cy<=height-0.5; cy++) {
    for(var cx=0.5; cx<=width-0.5; cx++) {
      circles.push({cx,cy})
    }
  }

  return circles
}

function fitCircles_hex(width,height) {
  var circles = []
  var dy = Math.sqrt(3)/2

  var offset = 0
  for(var cy=0.5; cy<=height-0.5; cy+=dy) {
    for(var cx=0.5+offset; cx<=width-0.5; cx++) {
      circles.push({cx,cy})
    }
    offset = 0.5-offset
  }

  return circles
}

function fitCircles(width,height, method) {
  const square = fitCircles_square(width,height)
  const hex1   = fitCircles_hex(width,height)
  const hex2   = fitCircles_hex(height,width).map(a=>({cx:a.cy,cy:a.cx}))

  switch (method) {
    case '1': return square;
    case '2': return hex1;
    case '3': return hex2;
  }

  if (square.length>=hex1.length) {
    if (square.length>=hex2.length) return square
    else return hex2
  }
  else {
    if (hex1.length>=hex2.length) return hex1
    else return hex2
  }
}


function MethodButton(props) {
  const {id,value} = props
  const [state,setState] = props.stateMgr

  const onChangeMethod = e=>setState({...state,method:id})

  return (
    <>
      <input
        type="radio"
        id={`method-${id}`}
        name="method"
        value={id}
        checked={state.method===id}
        onChange={onChangeMethod}/>
      <label htmlFor={`method-${id}`}>{props.children}</label>
      &nbsp;
    </>
  )
}

function Simul(props) {
  const router = useRouter()
  const stateMgr = React.useState({
    width: "3.666",
    height: "5.666",
    method: "best"
  })

  const [state,setState] = stateMgr
  const onChangeSlider = e=>setState({...state,[e.currentTarget.id]: (e.currentTarget.value/1000).toString() })
  const onChange = e=>setState({...state,[e.currentTarget.id]:e.currentTarget.value})

  const width  = parseFloat(state.width)
  const height = parseFloat(state.height)
  const circles = fitCircles(width,height,state.method)

  const maxDensity = 0.9069 // cf https://fr.wikipedia.org/wiki/Empilement_compact
  const circleSurface = Math.PI/4 // because radius=0.5
  const rectSurface = width*height
  const discsSurface = circles.length * circleSurface/maxDensity
  const spaceLeft = (rectSurface - discsSurface)*maxDensity/circleSurface

  return (
    <div>
      <p>
        <input type="range" min="1000" max="10000" value={width*1000} className="slider" id="width" onChange={onChangeSlider}/>&nbsp;
        Largeur <input type="edit" id="width" value={state.width} onChange={onChange}/>
      </p>
      <p>
        <input type="range" min="1000" max="10000" value={height*1000} className="slider" id="height" onChange={onChangeSlider}/>&nbsp;
        Longueur <input type="edit" id="height" value={state.height} onChange={onChange}/>
      </p>
      <p>Nombre: <strong>{circles.length}</strong>, disponibilité: <strong>{spaceLeft.toFixed(1)}</strong> (pots)</p>

      <p>
        Méthode:&nbsp;
        <MethodButton id="best" stateMgr={stateMgr}>Meilleure</MethodButton>
        <MethodButton id="1"    stateMgr={stateMgr}>1</MethodButton>
        <MethodButton id="2"    stateMgr={stateMgr}>2</MethodButton>
        <MethodButton id="3"    stateMgr={stateMgr}>3</MethodButton>
      </p>

      <div style={{display:"flex",justifyContent:"center"}}>
        <SimulSVG width={width} height={height} circles={circles}/>
      </div>
    </div>
  )
}

export default {
  Simul
}
