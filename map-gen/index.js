require('dotenv').config()

const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const fetch = require('node-fetch')

const {importIso3166} = require('./iso3166-wikipedia-import')
const {loadDB} = require('./process-data')


async function run() {
  const dstPath = path.join(__dirname,'dst')

  await fs.promises.rmdir(dstPath,{recursive:true})
  await mkdirp(dstPath)

  var directory = {}

  const iso3166 = await importIso3166()

  await loadDB(dstPath,110,directory,iso3166)
  await loadDB(dstPath, 50,directory,iso3166)
  await loadDB(dstPath, 10,directory,iso3166)

  await fs.promises.writeFile( path.join(dstPath,'directory.json'), JSON.stringify(directory))
}

run()
