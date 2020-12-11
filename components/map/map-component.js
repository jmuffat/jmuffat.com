import React from 'react'
import {PanZoom} from './pan-zoom'
import {loadMap} from './map-load'
import {useMapController} from './map-controller'
import {generateSvg} from './map-export'

import countryCodes from '~/data/countries.json'

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


export class Map extends React.Component {

  constructor(props) {
    super(props)

    this.colors = {
      water: "#f6f6f6", //"#cceeff",
      land:  "#ffffff", //"#f8f8f8",
      sel:   "#c00",
      countryBorder: "#000",
      provinceBorder: "#aaa"
    }

    this.data110  = null
    this.data50   = null
    this.data10   = null
    this.dataDetailed = null

    this.svgRef  = React.createRef()
    this.panZoom = null

    const C = this.props.controller
    if (!C) throw new Error('map must have controller')

    C.component = this
  }

  componentDidMount() {
    this.panZoom = new PanZoom(this.svgRef.current, this)

    loadMap('countries-110m.json',mercator)
    .then( a=>{this.data110=a;this.forceUpdate()})
    .then(()=>loadMap('countries-50m.json',mercator))
    .then( a=>{this.data50=a;this.forceUpdate()})
    .then(()=>loadMap('countries-10m.json',mercator))
    .then( a=>{this.data10=a;this.forceUpdate()})
  }

  componentWillUnmount(){
    if (this.panZoom) {
      this.panZoom.close()
      this.panZoom = null
    }
  }

  checkedDetailedData() {
    const {detailed} = this.props

    if ( !detailed
      || detailed!=this.dataDetailedId
      || !countryCodes.find(a=>a===detailed) ) {

      return null
    }

    return detailed
  }

  computerRenderParameters() {
    const C = this.props.controller

    const width = this.props.width  || defaultWidth
    const height= this.props.height || defaultHeight
    const scaleScreen = Math.min(width,height)/2;

    const center = mercator(C.center)
    const scaleMap = Math.pow(2,C.zoomLevel)/180
    const countries = this.props.countries.split(' ').filter(a=>a.length>0)

    const scl = scaleMap*scaleScreen
    const trn = {
      x:   width/2/scl - center.x,
      y: -height/2/scl - center.y
    }

    const stroke   = this.props.stroke || 0.5
    const strokeWidth = stroke/scl

    const minLatLon = invMercator({x:    0/scl-trn.x, y:-height/scl-trn.y})
    const maxLatLon = invMercator({x:width/scl-trn.x, y:      0/scl-trn.y})
    const bbox = {
      xMin: minLatLon.lng,
      yMin: minLatLon.lat,
      xMax: maxLatLon.lng,
      yMax: maxLatLon.lat,
    }

    const dlngPerPix = (maxLatLon.lng-minLatLon.lng)/width
    // console.log({dlngPerPix})

    const dataCountries = (
      (!!this.data10 && dlngPerPix<=0.03) ?   this.data10
     :(!!this.data50 && dlngPerPix<=0.18) ?   this.data50
     :                                        this.data110
    )

    const detailed = this.checkedDetailedData()


    return {
      dataCountries,
      dataDetailed : detailed? this.dataDetailed : null,
      detailed,
      width,height, bbox,
      scl,trn,
      strokeWidth,
      colors:this.colors,
      countries
    }
  }

  render() {
    const C = this.props.controller
    if (!C) return <p>[ (!) Map without controller]</p>

    const P = this.computerRenderParameters()

    return (
      <svg
        ref={this.svgRef}
        viewBox={`0 0 ${P.width} ${P.height}`}
        draggable={false}
        style={{userSelect:"none",touchAction:"none"}}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect fill={P.colors.water} id="background" width={P.width+2} height={P.height+2} y="-1" x="-1" onClick={this.props.onClick && (()=>this.props.onClick(null))}/>

        <g
          transform={`scale(${P.scl} ${-P.scl}) translate(${P.trn.x} ${P.trn.y})`}
          stroke="#000" strokeWidth={P.strokeWidth} fill="none" >
          {this.renderDetailed(P)}
          {this.renderCountries(P)}
        </g>

      </svg>
    );
  }

  renderCountries(P) {
    const data = P.dataCountries
    if (!data) return null

    const computeFill = part => {
      if (part.iso_a2===P.detailed) return null
      return this.props.countries.includes(part.iso_a2)? this.colors.sel : this.colors.land
    }

    return data.map( (part,i)=>(
      <path
        key={i}
        d={part.geometry.svgPath}
        fill={computeFill(part)}
        stroke={this.colors.countryBorder}
        onClick={this.props.onClickCountry && (()=>this.props.onClickCountry(part))}
        onDoubleClick={this.props.onDoubleClickCountry && (()=>this.props.onDoubleClickCountry(part))}
      />
    ))
  }

  renderDetailed(P){
    if (!P.dataDetailed) return null

    const computeFill = part => this.props.provinces.includes(part.iso_3166_2)? this.colors.sel : this.colors.land

    return P.dataDetailed.map( (part,i)=>(
      <path
        key={i}
        d={part.geometry.svgPath}
        fill={computeFill(part)}
        stroke={this.colors.provinceBorder}
        onClick={this.props.onClickProvince && (()=>this.props.onClickProvince(part))}
        onDoubleClick={this.props.onDoubleClickProvince && (()=>this.props.onDoubleClickProvince(part))}
      />
    ))
  }

  onPan(delta) {
    const C = this.props.controller
    const width = this.props.width  || defaultWidth
    const height= this.props.height || defaultHeight
    const scaleScreen = Math.min(width,height)/2
    const center = mercator(C.center)
    const scaleMap = Math.pow(2,C.zoomLevel)/180
    const scl = scaleMap*scaleScreen

    const offsetCenter = {
      x: center.x-delta.x/scl,
      y: center.y+delta.y/scl
    }

    C.center = invMercator(offsetCenter)
    this.forceUpdate()
  }

  componentDidUpdate(oldProps) {
    if (oldProps.detailed !== this.props.detailed) this.changeDetailedCountry()
  }

  changeDetailedCountry(){
    const iso = this.props.detailed.trim()
    if (countryCodes.findIndex(a=>a===iso)<0) return

    loadMap(`provinces-${iso}-10m.json`,mercator)
    .then(a=>{console.log(`provinces-${iso}-10m.json`);return a})
    .then( a=>{
      this.dataDetailed=a;
      this.dataDetailedId=iso;
      this.forceUpdate()
    })
  }

  generateSvg() {
    const P = this.computerRenderParameters()
    return generateSvg(P)
  }

  static useMapController(a) {return useMapController(a)}
}
