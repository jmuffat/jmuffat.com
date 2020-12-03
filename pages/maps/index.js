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

function Home(props) {
  const form = useForm({
    countries:"",
    minCoord: {lng:-180,lat:-90},
    maxCoord: {lng: 180,lat: 90}
  })

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

      <Map {...form.data}/>
    </BasePage>
  );
}

export default Home
