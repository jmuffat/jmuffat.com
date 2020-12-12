const fs = require('fs')
const path = require('path')
const {githubFetchText} = require('./github')

function parseCSV(data,processLine) {
  var i = 0
  var headers = null

  const res = {}

  while (i<data.length) {
    var j = data.indexOf('\n',i)
    if (j<0) j=data.length
    const line = data.slice(i,j)
    i = j+1

    const a = line.split(';')
    if (!headers) {headers=a; continue}

    const rec = a.reduce(
      (cur,s,i)=>{
        cur[headers[i]] = s
        return cur
      },
      {}
    )

    processLine(rec)
  }
}

async function loadWikipediaDivisions(dstFolder) {
  const owner = 'Tigrov'
  const repo  = 'wikipedia-divisions'
  const [dataDivisions,dataSubdivisions] = await Promise.all([
    githubFetchText(owner, repo, 'result/divisions.csv'),
    githubFetchText(owner, repo, 'result/subdivisions.csv')
  ])

  const regions = {}

  parseCSV(dataDivisions, a=>{
    const id     = a['ISO-3166-1']+'-'+a['ISO-3166-2']
    regions[id] = {
      name:a.Name2,
      wikipedia:a.Wikipedia,
      subdivisions:[]
    }
  })

  const subdivisions = {}

  parseCSV(dataSubdivisions, a=>{
    const id     = a['ISO-3166-1']+'-'+a['ISO-3166-2']
    const region = a['ISO-3166-1']+'-'+a['"ISO Region"']
    subdivisions[id] = {
      name:a.Name2,
      wikipedia:a.Wikipedia
    }

    if (regions[region]) regions[region].subdivisions.push(id)
    else console.log(a)
  })

  const res = {
    regions,
    subdivisions
  }

  fs.promises.writeFile( path.join(dstFolder,`wikipedia.json`), JSON.stringify(res))
}

module.exports  = {
  loadWikipediaDivisions
}
