"use client"
import React from 'react'
import {
  SimulSVG,
  MethodButton
} from './ui'
import {
  fitCircles2
} from './sim-base'

export function Simul2(props) {
  const stateMgr = React.useState({
    //width: "5.999",
    //height: "1.499",
    width:  "5.000",
    height: "1.600",
    method: "best"
  })

  const [state,setState] = stateMgr
  const onChangeSlider = e=>setState({...state,[e.currentTarget.id]: (e.currentTarget.value/1000).toString() })
  const onChange = e=>setState({...state,[e.currentTarget.id]:e.currentTarget.value})

  const width  = parseFloat(state.width)
  const height = parseFloat(state.height)
  const circles = fitCircles2(width,height,state.method)

  const maxDensity = 0.9069 // cf https://fr.wikipedia.org/wiki/Empilement_compact
  const circleSurface = Math.PI/4 // because radius=0.5
  const rectSurface = width*height
  const discsSurface = circles.length * circleSurface/maxDensity
  const spaceLeft = (rectSurface - discsSurface)*maxDensity/circleSurface

  const curMethod = circles[0].method

  return (
    <div className='flex flex-col p-4 gap-2 bg-secondary rounded'>
      <div className="flex flex-row gap-2">
        <input type="range" min="1000" max="10000" value={width*1000} id="width" onChange={onChangeSlider}/>&nbsp;
        Largeur <input className="px-2" type="edit" id="width" value={state.width} onChange={onChange}/>
      </div>
      <div className="flex flex-row gap-2">
        <input type="range" min="1000" max="10000" value={height*1000} id="height" onChange={onChangeSlider}/>&nbsp;
        Longueur <input className="px-2" type="edit" id="height" value={state.height} onChange={onChange}/>
      </div>
      <div>Nombre: <strong>{circles.length}</strong>, disponibilité: <strong>{spaceLeft.toFixed(1)}</strong> (pots)</div>

      <div className='flex flex-row gap-2'>
        <div>Méthode:</div>
        <MethodButton id="best" stateMgr={stateMgr} sel={curMethod}>Meilleure</MethodButton>
        <MethodButton id="1"    stateMgr={stateMgr} sel={curMethod}>1</MethodButton>
        <MethodButton id="2"    stateMgr={stateMgr} sel={curMethod}>2</MethodButton>
        <MethodButton id="3"    stateMgr={stateMgr} sel={curMethod}>3</MethodButton>
        <MethodButton id="4"    stateMgr={stateMgr} sel={curMethod}>4</MethodButton>
        <MethodButton id="5"    stateMgr={stateMgr} sel={curMethod}>5</MethodButton>
        <MethodButton id="6"    stateMgr={stateMgr} sel={curMethod}>6</MethodButton>
        <MethodButton id="7"    stateMgr={stateMgr} sel={curMethod}>7</MethodButton>
      </div>

      <div className="flex justify-center">
        <SimulSVG width={width} height={height} circles={circles}/>
      </div>
    </div>
  )
}
