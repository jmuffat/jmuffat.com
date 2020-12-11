const fs = require('fs')
const path = require('path')
const parseDBF = require('parsedbf')
const {loadShapes} = require('./shpfile')

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

  if (!D[iso]) D[iso]={scales:[],subdivisions:[]}
  D[iso].scales.push(scale)
}

function addProvincesToDir(D,iso,scale) {
  if (iso="-99") return
  if (!D[iso]) D[iso]={scales:[],subdivisions:[]}

  D[iso].subdivisions.push(scale)
}

async function loadDB(dstFolder,scale,directory) {

  console.log(`processing countries at ${scale}`)
  const countryData = await loadShapes(
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
    const data = provinceByCountry[iso]
    addProvincesToDir(directory,iso,scale)
    console.log(`  - ${iso}: ${data[0].admin}`)
    work.push(
      fs.promises.writeFile( path.join(dstFolder,`provinces-${iso}-${scale}m.json`), JSON.stringify(data))
    )
  }

  await Promise.all(work)
}

module.exports = {
  loadDB
}
