const fs = require('fs')
const path = require('path')
const parseDBF = require('parsedbf')

const {loadShapes} = require('./shpfile')
const {mergeGeometry} = require('./merge-geometry')

const countryDataset  = 'ne_10m_admin_0_countries'
const provinceDataset = 'ne_10m_admin_1_states_provinces'

async function loadGeometry(dataset,key,fixup) {
  const data= await loadShapes(dataset,key,fixup)
  const svg=svgMap({data})
  await fs.promises.writeFile(path.join(__dirname,`${dataset}.svg`), svg)

  const log = data

  await fs.promises.writeFile(path.join(__dirname,`${dataset}.json`), JSON.stringify(log.map(a=>({...a,geometry:undefined}))))
  return data
}

function addCountryToDir(D,country,scale) {
  const iso = country.iso_a2
  if (iso==="-99") return

  if (!D[iso]) D[iso]={scales:[],divisions:[]}
  D[iso].scales.push(scale)
}

function addProvincesToDir(D,opt) {
  const {iso,scale,subdivisions} = opt
  if (iso==="-99") return
  if (!D[iso]) D[iso]={scales:[],divisions:[]}

  D[iso].divisions.push(scale)
  D[iso].subdivisions = subdivisions
}

function wikipediaPageTitle(a) {
  if (!a) return
  return a.replace(/^\/wiki\//,'')
}

async function loadIsoRemap() {
  const txt = await fs.promises.readFile( path.join(__dirname,'iso-remap.json'), {encoding: 'utf8'})
  return JSON.parse(txt)
}

async function saveIsoRemap(data) {
  const txt = JSON.stringify(data)
  await fs.promises.writeFile( path.join(__dirname,'iso-remap.json'), txt)
}

async function loadDB(dstFolder,scale,directory,iso3166) {
  var isoRemap = await loadIsoRemap()

  console.log(`processing countries at ${scale}`)
  const countryBaseData = await loadShapes(
    `${scale}m_cultural/ne_${scale}m_admin_0_countries`,
    [
      'NAME',
      'ADMIN',
      'ISO_A2',
      'NE_ID',
      'WIKIDATAID',
      'WOE_ID'
    ],
    a=>{
      if (a.NE_ID==1159320637) return {...a, ISO_A2:'FR'}
      if (a.NE_ID==1159321109) return {...a, ISO_A2:'NO'}
      return a
    }
  )

  const countryData = countryBaseData.map(a=>{
    const iso = iso3166[a.iso_a2]
    if (!iso) {return a}

    return {
      ...a,
      wikipediaName: iso.name,
      wikipediaPage: wikipediaPageTitle(iso.link)
    }
  })

  countryData.forEach( a=>addCountryToDir(directory,a,scale) )

  await fs.promises.writeFile(path.join(dstFolder,`countries-${scale}m.json`), JSON.stringify(countryData))

  console.log(`processing provinces at ${scale}`)
  const province = await loadShapes(
    `${scale}m_cultural/ne_${scale}m_admin_1_states_provinces`,
    [
      'name',
      'admin',
      'iso_a2',
      'iso_3166_2',
      'ne_id',
      'wikidataid',
      'woe_id'
    ]
  )

  const provinceByCountry = province.reduce(
    (cur,a)=>{
      if (!cur[a.iso_a2]) cur[a.iso_a2] = []
      cur[a.iso_a2].push(a)
      return cur
    },
    {}
  )

  var work = []

  for(var iso in provinceByCountry) {
    if (iso==="-1") continue;

    const baseData = provinceByCountry[iso]

    const data = baseData.map(a=>{
      const iso_3166_2 = isoRemap[a.iso_3166_2] || a.iso_3166_2
      const iso = iso3166[iso_3166_2]
      if (!iso) {isoRemap[a.iso_3166_2]=null;return a}

      return {
        ...a,
        iso_3166_2,
        wikipediaName: iso.name,
        wikipediaPage: wikipediaPageTitle(iso.link),
        parent:iso.parent
      }
    })

    // check if any province has a parent that isn't the country
    const hasSubdivisions = !!data.find(a => a.parent && a.parent!==iso)

    const _divisions = !hasSubdivisions? [] : data.reduce(
      (cur,a)=>{
        if (a.parent) {
          if (!cur[a.parent]) {
            const isoDiv = iso3166[a.parent]
            if (isoDiv) {
              cur[a.parent] = {
                 name: isoDiv.name,
                 // "admin": "Andorra",
                 iso_a2: iso,
                 iso_3166_2: a.parent,
                 // "ne_id": 1159315979,
                 // "wikidataid": "Q24272",
                 // "woe_id": 20070556,
                 geometry: a.geometry,
                 wikipediaName: isoDiv.name,
                 wikipediaPage: wikipediaPageTitle(isoDiv.link),
               }
            }
            else console.log(`can't find code ${a.parent}`)
          }
          else {
            cur[a.parent].geometry = mergeGeometry(cur[a.parent].geometry, a.geometry)
          }
        }

        return cur
      },
      {}
    )

    const divisions = Object.keys(_divisions).map(a=>_divisions[a])

    if (hasSubdivisions) {
      work.push(
        fs.promises.writeFile( path.join(dstFolder,`divisions-${iso}-${scale}m.json`), JSON.stringify(divisions))
      )
      work.push(
        fs.promises.writeFile( path.join(dstFolder,`subdivisions-${iso}-${scale}m.json`), JSON.stringify(data))
      )
      addProvincesToDir(directory,{iso,scale,subdivisions:true})
    }
    else {
      work.push(
        fs.promises.writeFile( path.join(dstFolder,`divisions-${iso}-${scale}m.json`), JSON.stringify(data))
      )
      addProvincesToDir(directory,{iso,scale,subdivisions:false})
    }
  }

  saveIsoRemap(isoRemap)

  await Promise.all(work)
}

module.exports = {
  loadDB
}
