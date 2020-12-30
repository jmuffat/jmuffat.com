const fs = require('fs')
const path = require('path')
const {processCountries} = require('./countries')

async function getCountries() {
  const dstPath = path.join(__dirname,'..','dst')

  const countries = await processCountries('https://en.wikipedia.org/wiki/ISO_3166-2')
  // console.log(countries)
  await fs.promises.writeFile( path.join(dstPath,'iso3166-wikipedia.json'), JSON.stringify(countries))
}


getCountries()
