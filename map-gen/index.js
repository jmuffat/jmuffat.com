const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const fetch = require('node-fetch')

const {loadDB} = require('./process-data')

async function run() {
  const dstPath = path.join(__dirname,'dst')

  await fs.promises.rmdir(dstPath,{recursive:true})
  await mkdirp(dstPath)

  var directory = {}

  await loadDB(dstPath,110,directory)
  await loadDB(dstPath, 50,directory)
  await loadDB(dstPath, 10,directory)

  fs.promises.writeFile( path.join(dstPath,'directory.json'), JSON.stringify(directory))
}

run()
