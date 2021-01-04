const fs = require('fs')
const path = require('path')
const {processCountries} = require('./countries')

async function importIso3166() {
  const dstPath = path.join(__dirname,'..','dst')

  const items = await processCountries('https://en.wikipedia.org/wiki/ISO_3166-2')
  const data = items.reduce(
    (cur,a)=>{
      const {id,...info} = a
      cur[a.id] = info
      return cur
    },
    {}
  )

  await fs.promises.writeFile( path.join(dstPath,'iso3166-wikipedia.json'), JSON.stringify(data))

  return data
}


module.exports = {
  importIso3166
}
