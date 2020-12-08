import React from 'react';
import FileSaver from 'file-saver'

import BasePage from '~/components/base-page'
import {
  useForm, useSubForm,
  TextField,
  FloatField,
  FormLabel,
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
  const {data} = props

  if (!data) return <div>none</div>

  return (
    <div>
      {data.iso_a2} : {data.name}
    </div>
  )
}

function Home(props) {
  const mapCtrl = Map.useMapController({
    center: {lng:7.0698281,lat:43.5823383},
    zoomLevel: 0
  })

  const form = useForm({
    countries:"",
    center: mapCtrl.center,
    zoomLevel: mapCtrl.zoomLevel
  })

  const [current,setCurrent] = React.useState(null)

  const onToggle = country=>{
    form.updateData({countries: toggleCountry(form.data.countries, country.iso_a2)})
  }

  const onExport = ()=>{
    const svgText = mapCtrl.generateSvg()
    const blob = new Blob([svgText], {type:'image/svg+xml;charset=utf-8'});
    FileSaver.saveAs(blob, 'map.svg');
  }

  const onChangeSlider = e=>mapCtrl.setZoomLevel(e.currentTarget.value/100)

  return (
    <BasePage>
      <h1>Maps</h1>

      <FormLine>
        <TextField form={form} field="countries" filter={a=>a.toUpperCase()} />
      </FormLine>

      <FormLine>
        <FormLabel>Zoom level: </FormLabel>
        <input type="range" min={0} max={800} value={mapCtrl.zoomLevel*100} id="zoom-slider" onChange={onChangeSlider}/> {mapCtrl.zoomLevel.toFixed(2)}
      </FormLine>

      <AreaInfo data={current} onToggle={onToggle}/>
      <button onClick={onExport}>Export...</button>
      <Map
        controller={mapCtrl}
        countries={form.data.countries}
        onClick={country=>setCurrent(country)}
        onDoubleClick={country=>onToggle(country)}
      />
    </BasePage>
  );
}

export default Home
