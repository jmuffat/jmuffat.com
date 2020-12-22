import React from 'react';
import Head from 'next/head';
import FileSaver from 'file-saver'

import BasePage from '~/components/base-page'
import {
  useForm, useSubForm,
  TextField,
  FloatField,
  IntField,
  FormColors,
  FormLine
} from '~/components/form'
import Map from '~/components/map'

function FieldLatLon(props) {
  const form = useSubForm(props.form,props.field)
  const label = props.label || props.field

  const onChange = props.onChange || (a=>a)

  return (
    <>
      <FormLabel>{label}</FormLabel>
      <FloatField form={form} field="lng" label="longitude" onChange={lng=>onChange({lng,lat:form.data.lat})}/>
      <FloatField form={form} field="lat" label="latitude"  onChange={lat=>onChange({lng:form.data.lng,lat})}/>
    </>
  )
}

function toggleCountry(countries, iso) {
  const list = countries.split(' ').filter(a=>a.length>0)
  const i = list.findIndex(a=>a===iso)

  if (i<0) list.push(iso)
  else list.splice(i,1)

  list.sort()

  return list.join(' ')
}

function AreaInfo(props) {
  if (!props.data) return <div className="area-info">none</div>

  return (
    <div className="area-info">
      {props.data}
    </div>
  )
}

const colorLabels = {
  water: "Water",
  land:  "Land",
  sel:   "Selection",
  countryBorder: "Country borders",
  provinceBorder: "Province borders"
}


function Home(props) {
  const mapCtrl = Map.useMapController({
    center: {lng:7.0698281,lat:43.5823383},
    zoomLevel: 0
  })

  const defaultData = {
    name:'map',
    countries:'',
    detailed: '',
    provinces:'',
    center: mapCtrl.center,
    zoomLevel: mapCtrl.zoomLevel,
    width: 1024,
    height: 512,

    colors: {
      water: "#f0f0f0", //"#cceeff",
      land:  "#ffffff", //"#f8f8f8",
      sel:   "#cc0000",
      countryBorder: "#000000",
      provinceBorder: "#aaaaaa"
    }
  }

  const form = useForm(defaultData)

  const [current,setCurrent] = React.useState(null)

  const onToggleCountry = country=>{
    form.updateData({countries: toggleCountry(form.data.countries, country.iso_a2)})
  }

  const onToggleProvince = province=>{
    form.updateData({provinces: toggleCountry(form.data.provinces, province.iso_3166_2)})
  }

  const onSave = ()=>{
    const data = {
      ...form.data,
      center: mapCtrl.center,
      zoomLevel: mapCtrl.zoomLevel
    }
    const text = JSON.stringify(data)
    const blob = new Blob([text], {type:'application/json;charset=utf-8'});
    FileSaver.saveAs(blob, `${form.data.name}-parm.json`);
  }

  const onLoad = async e=>{
    const f = e.target.files[0]
    if (!f) return

    const url = window.URL.createObjectURL(f)
    const res = await fetch(url)
    const data = await res.json()

    const upgraded = {
      ...defaultData,
      ...data
    }

    form.setData(upgraded)
    mapCtrl.setCenter(data.center)
    mapCtrl.setZoomLevel(data.zoomLevel)

    window.URL.revokeObjectURL(url)
  }

  const onExport = ()=>{
    const svgText = mapCtrl.generateSvg()
    const blob = new Blob([svgText], {type:'image/svg+xml;charset=utf-8'});
    FileSaver.saveAs(blob, `${form.data.name}.svg`);
  }

  const onChangeSlider = e=>mapCtrl.setZoomLevel(e.currentTarget.value/100)

  return (
    <BasePage title="SVG Maps Generator">

    <Head>
      <meta property="og:type" content="article" />
      <meta property="article:author" content="https://www.facebook.com/jmuffat" />
      <meta property="og:title" content="SVG Maps Generator" />
      <link rel="canonical" href="https://jmuffat.com/maps" />
      <meta property="og:url" content="https://jmuffat.com/maps" />

      <meta property="og:image" content="https://jmuffat.com/img/map-page.png" />
      <meta property="og:image:secure_url" content="https://jmuffat.com/img/map-page.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="627" />
    </Head>

      <h1>Maps</h1>

      <p>I needed simple maps to illustrate a friend's web pages and
      realized it wasn't as easy to find as I would have expected. So I made
      this page, as I'm sure it can be useful to others too. Drag the map to
      position it, zoom using the slider (avoids confusion between zoom and
      scroll). Double clicking a country adds it to the selection (or removes
      it). Don't hesitate to provide feedback ! </p>

      <FormLine label="Name">
        <TextField form={form} field="name" placeholder="used when saving/exporting" className="wide" />
      </FormLine>

      <FormLine label="Dimensions">
        <IntField form={form} field="width"  label="w"/>
        <IntField form={form} field="height" label="h"/>
      </FormLine>

      <FormLine label="Countries">
        <TextField form={form} field="countries" placeholder="ISO codes" filter={a=>a.toUpperCase()} className="wide" />
      </FormLine>

      <FormLine label="Detailed">
        <TextField form={form} field="detailed" placeholder="ISO code" filter={a=>a.toUpperCase()} />
        <TextField form={form} field="provinces" filter={a=>a.toUpperCase()} placeholder="ISO-3166-2 codes" className="wide" />
      </FormLine>

      <FormLine label="Zoom level">
        <div className="form-range">
          <div className="range-slider"> <input type="range" min={0} max={800} value={mapCtrl.zoomLevel*100} id="zoom-slider" onChange={onChangeSlider}/> </div>
          <div className="range-value"> {mapCtrl.zoomLevel.toFixed(2)}</div>
        </div>
      </FormLine>

      <AreaInfo data={current}/>

      <button onClick={onExport} className="map-button">Generate SVG</button>
      <button onClick={onSave}   className="map-button">Save</button>

      <label htmlFor="file-upload" className="map-button-load">Load</label>
      <input id="file-upload" type="file" style={{display:"none"}} onChange={onLoad}/>

      <Map
        controller={mapCtrl}
        width= {Math.max(32,form.data.width)}
        height={Math.max(32,form.data.height)}
        colors={form.data.colors}
        countries={form.data.countries}
        detailed={form.data.detailed}
        provinces={form.data.provinces}

        onClickCountry={a=>setCurrent( <span><strong>{a.iso_a2}</strong> - {a.name}</span> )}
        onDoubleClickCountry={country=>onToggleCountry(country)}

        onClickProvince={a=>setCurrent( <span><strong>{a.iso_3166_2}</strong> - {a.name}</span> )}
        onDoubleClickProvince={province=>onToggleProvince(province)}
      />

      <FormColors form={form} field="colors" colors={form.data.colors} labels={colorLabels} />
    </BasePage>
  );
}

export default Home
