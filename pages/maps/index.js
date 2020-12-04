import React from 'react';

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

  return (
    <>
      <FormLabel>{label}</FormLabel>
      <FloatField form={form} field="lng" label="longitude"/>
      <FloatField form={form} field="lat" label="latitude"/>
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
  const form = useForm({
    countries:"",
    minCoord: {lng:-180,lat:-90},
    maxCoord: {lng: 180,lat: 90}
  })

  const [current,setCurrent] = React.useState(null)

  const onToggle = country=>{
    form.updateData({countries: toggleCountry(form.data.countries, country.iso_a2)})
  }

  return (
    <BasePage>
      <h1>Maps</h1>

      <FormLine>
        <TextField form={form} field="countries" filter={a=>a.toUpperCase()}/>
      </FormLine>

      <FormLine>
        <FieldLatLon form={form} field="minCoord"/>
      </FormLine>

      <FormLine>
        <FieldLatLon form={form} field="maxCoord"/>
      </FormLine>

      <AreaInfo data={current} onToggle={onToggle}/>
      <Map
        {...form.data}
        onClick={country=>setCurrent(country)}
        onDoubleClick={country=>onToggle(country)}
      />
    </BasePage>
  );
}

export default Home
