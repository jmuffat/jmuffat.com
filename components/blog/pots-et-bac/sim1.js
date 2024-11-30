"use client"
import React from 'react'
import {
  SimulSVG,
  MethodButton
} from './ui'
import {
  fitCircles
} from './sim-base'

export function Simul(props) {
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
    <div className='bg-secondary p-4 rounded'>
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

      <div className="flex justify-center">
        <SimulSVG width={width} height={height} circles={circles}/>
      </div>
    </div>
  )
}

