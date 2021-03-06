import React from 'react';
import Head from 'next/head';
import {FormattedMessage,useIntl} from 'react-intl'
import FileSaver from 'file-saver'

import BasePage from '~/components/base-page'
import {
  useForm, useSubForm,
  TextField,
  FloatField,
  IntField,
  CheckboxField,
  RadioField,
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

function toggleSelection(selection, iso) {
  const list = selection.split(' ').filter(a=>a.length>0)
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

async function wikipediaPageURL(lang,wikipediaPage) {
  if (lang!=='en') {
    const api = `https://en.wikipedia.org/w/api.php?action=query&titles=${wikipediaPage}&prop=langlinks&lllang=${lang}&format=json&origin=*`
    const res = await fetch(api)
    if (res.status==200) {
      const data = await res.json()
      const pages = data?.query?.pages
      const ids = Object.keys(pages)
      if (ids.length) {
        const page = pages[ids[0]]
        if (page.langlinks && page.langlinks.length>0) {
          const link = page.langlinks[0]
          return `https://${link.lang}.wikipedia.org/wiki/${link['*']}`
        }
      }
    }
  }

  return `https://en.wikipedia.org/wiki/${wikipediaPage}`
}

async function openWikipedia(wikipediaPage) {
  const _language = navigator.language || "en"
  const language = _language.replace(/\-.*/,'')

  const url = await wikipediaPageURL(language,wikipediaPage)

  // console.log({language,url})
  const win = window.open(url, '_blank');
  win.focus();
}

function AreaData(props) {
  const a = props.data

  if (a.wikipediaPage) {
    return (
      <span>
        <a href="#" onClick={e=>{e.preventDefault();openWikipedia(a.wikipediaPage)}}>
          <strong>{a[props.id]}</strong> - {a.name}
        </a>
      </span>
    )
  }
  else {
    return <span><strong>{a[props.id]}</strong> - {a.name}</span>
  }
}

function googleMapURL(P) {
  // return `https://www.google.com/maps/@?api=1&map_action=map&parameters`
  return `https://www.google.com/maps/@${P.center.lat},${P.center.lng},${2+P.zoomLevel}z`
}

function Home(props) {
  const intl = useIntl()
  const mapCtrl = Map.useMapController({
    center: {lng:7.0698281,lat:43.5823383},
    zoomLevel: 0
  })

  const defaultData = {
    name:'map',
    countries:'',
    detailed: '', // country of interest
    subdivisionLevel:0,
    onlySelected:false,
    selection:'',
    center: mapCtrl.center,
    zoomLevel: mapCtrl.zoomLevel,
    width: 1024,
    height: 512,

    // subdivision:false, // obsolete, use subdivisionLevel

    colors: {
      water: "#cceeff", // "#e0e0e0",
      land:  "#f0e8d8", // "#f0f0f0"
      sel:   "#cc0000",
      countryBorder: "#000000",
      provinceLand:  "#ffffff", //"#f8f8f8",
      provinceSel:   "#cc0000",
      provinceBorder: "#aaaaaa"
    }
  }

  function upgradeParameters(data){
    var a = {
      ...defaultData,
      ...data
    }

    if (a.hasOwnProperty('subdivision')) {
      console.log('upgrading "subdivision"')
      a.subdivisionLevel = a.subdivision? 2 : 1
      delete a.subdivision
    }

    if (a.hasOwnProperty('provinces')) {
      console.log('upgrading "provinces"')
      a.selection = a.provinces
      delete a.provinces
    }

    console.log(a)
    return a
  }

  const form = useForm(defaultData)

  const [current,setCurrent] = React.useState(null)

  const onClickCountry = country=>{
    console.log(country)
    form.updateData({detailed: country.iso_a2})
    setCurrent( <AreaData id="iso_a2" data={country}/> )
  }

  const onToggleSelection = country=>{
    form.updateData({selection: toggleSelection(form.data.selection, country.iso_a2)})
  }

  const onToggleProvince = province=>{
    form.updateData({selection: toggleSelection(form.data.selection, province.iso_3166_2)})
  }

  const onChangeDetail = e=>{
    form.updateData({subdivisionLevel: e.currentTarget.value})
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

    const upgraded = upgradeParameters(data)

    form.setData(upgraded)
    mapCtrl.setCenter(data.center)
    mapCtrl.setZoomLevel(data.zoomLevel)

    window.URL.revokeObjectURL(url)
  }

  const onExportSvg = ()=>{
    const svgText = mapCtrl.generateSvg()
    const blob = new Blob([svgText], {type:'image/svg+xml;charset=utf-8'});
    FileSaver.saveAs(blob, `${form.data.name}.svg`);
  }

  const onExportEmf = ()=>{
    const bufEMF = mapCtrl.generateEmf()
    const data = [new Uint8Array(bufEMF, 0, bufEMF.byteLength)]
    const blob = new Blob(data, {type:'image/x-emf'});
    FileSaver.saveAs(blob, `${form.data.name}.emf`);
  }

  const onChangeSlider = e=>mapCtrl.setZoomLevel(e.currentTarget.value/100)
  const soloDisabled = !form.data.detailed

  const msg = {
    name: intl.formatMessage({description:"in maps page", defaultMessage:"Name"}),
    namePlaceholder: intl.formatMessage({description:"in maps page, name placeholder", defaultMessage:"used when saving/exporting"}),
    dimensions: intl.formatMessage({description:"in maps page", defaultMessage:"Dimensions"}),
    widthLabel: intl.formatMessage({description:"in maps page, width label", defaultMessage:"w"}),
    heightLabel: intl.formatMessage({description:"in maps page, height label", defaultMessage:"h"}),
    country: intl.formatMessage({description:"in maps page", defaultMessage:"Country"}),
    countryIso: intl.formatMessage({description:"in maps page, country ISO", defaultMessage:"ISO"}),
    countryOnly: intl.formatMessage({description:"in maps page, country only", defaultMessage:"only"}),
    selection: intl.formatMessage({description:"in maps page", defaultMessage:"Selection"}),
    selectionPlaceholder: intl.formatMessage({description:"in maps page, selection placeholder", defaultMessage:"ISO codes"}),
    zoom: intl.formatMessage({description:"in maps page", defaultMessage:"Zoom"}),
  }

  const subdivisionOptions = [
    {label:intl.formatMessage({description:"in maps page, subdiv options", defaultMessage:"Country"}), value:0},
    {label:intl.formatMessage({description:"in maps page, subdiv options", defaultMessage:"Divisions"}), value:1},
    {label:intl.formatMessage({description:"in maps page, subdiv options", defaultMessage:"Subdivisions"}), value:2}
  ]

  const colorLabels = {
    water: intl.formatMessage({description:"in maps page, color labels", defaultMessage:"Water"}),
    land:  intl.formatMessage({description:"in maps page, color labels", defaultMessage:"Land"}),
    sel:   intl.formatMessage({description:"in maps page, color labels", defaultMessage:"Selected countries"}),
    countryBorder: intl.formatMessage({description:"in maps page, color labels", defaultMessage:"Country borders"}),
    provinceLand:  intl.formatMessage({description:"in maps page, color labels", defaultMessage:"Provinces"}),
    provinceSel:   intl.formatMessage({description:"in maps page, color labels", defaultMessage:"Selected provinces"}),
    provinceBorder: intl.formatMessage({description:"in maps page, color labels", defaultMessage:"Province borders"})
  }

  return (
    <BasePage title="SVG Maps Generator"  locales={"*"}>

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

      <h1><FormattedMessage
        description="in maps page"
        defaultMessage="SVG maps generator"
      /></h1>

      <p><FormattedMessage
        description="maps page intro"
        defaultMessage="Use this tool to generate static SVG images of maps that you can then include in your web pages and documents. Big thanks to {sampleLink}, who got me started on the idea."
        values={{
          sampleLink: <a href="https://dlicacy.com/filotea/" target="_blank">dlicacy.com</a>
        }}
      /></p>

      <FormLine label={msg.name}>
        <TextField form={form} field="name" placeholder={msg.namePlaceholder} className="wide" />
      </FormLine>

      <FormLine label={msg.dimensions}>
        <IntField form={form} field="width"  label={msg.widthLabel}/>
        <IntField form={form} field="height" label={msg.heightLabel}/>
      </FormLine>

      <FormLine label={msg.country}>
        <TextField form={form} field="detailed" placeholder={msg.countryIso} filter={a=>a.toUpperCase()} width="2em" />
        <CheckboxField form={form} field="onlySelected" label={msg.countryOnly} disabled={soloDisabled}/>
        <label><FormattedMessage description="in maps page, country LoD" defaultMessage="Detail level:"/></label>
        <RadioField form={form} field="subdivisionLevel" options={subdivisionOptions}/>
      </FormLine>

      <FormLine label={msg.selection}>
        <TextField form={form} field="selection" placeholder={msg.selectionPlaceholder} filter={a=>a.toUpperCase()} className="wide" />
      </FormLine>

      <FormLine label={msg.zoom}>
        <div className="form-range">
          <div className="range-slider"> <input type="range" min={0} max={800} value={mapCtrl.zoomLevel*100} id="zoom-slider" onChange={onChangeSlider}/> </div>
          <div className="range-value"> {mapCtrl.zoomLevel.toFixed(2)}</div>
        </div>
      </FormLine>

      <AreaInfo data={current}/>

      {/*<button onClick={onExportSvg} className="map-button">{form.data.name}.svg</button>
      <button onClick={onExportEmf} className="map-button">{form.data.name}.emf</button>*/}
      <button onClick={onSave}   className="map-button"><FormattedMessage description="in maps page" defaultMessage="Save"/></button>

      <label htmlFor="file-upload" className="map-button-load"><FormattedMessage description="in maps page" defaultMessage="Load"/></label>
      <input id="file-upload" type="file" style={{display:"none"}} onChange={onLoad}/>

      {form.data.name && <a href='#' className="mr-1" onClick={onExportSvg}>{form.data.name}.svg</a>}
      {form.data.name && <a href='#' className="mr-1" onClick={onExportEmf}>{form.data.name}.emf</a>}
      <a href={googleMapURL(mapCtrl)} className="mr-1" target="_blank">Google Maps</a>

      <Map
        controller={mapCtrl}
        width= {Math.max(32,form.data.width)}
        height={Math.max(32,form.data.height)}
        colors={form.data.colors}
        countries={form.data.countries}
        onlySelected={form.data.onlySelected}
        detailed={form.data.detailed}
        subdivisionLevel={form.data.subdivisionLevel}
        selection={form.data.selection}

        onClickCountry={onClickCountry}
        onDoubleClickCountry={country=>onToggleSelection(country)}

        onClickProvince={a=>setCurrent( <AreaData id="iso_3166_2" data={a}/> )}
        onDoubleClickProvince={province=>onToggleProvince(province)}
      />

      <FormColors form={form} field="colors" colors={form.data.colors} labels={colorLabels} />
    </BasePage>
  );
}

export default Home
