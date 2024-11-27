const fs = require('fs')
const path = require('path')

const {extract} = require('@formatjs/ts-transformer')

async function loadJson(a) {
  const filepath = path.join(__dirname,a)
  const res = await fs.promises.readFile(filepath,{encoding:'utf-8'})
  return JSON.parse(res)
}

const reIsJS = /\.js$/

async function walk(dir) {
  var results = [];
  const list = await fs.promises.readdir(dir,{withFileTypes:true})

  const files = (
    list
    .filter(dirent=> reIsJS.test(dirent.name) && !dirent.isDirectory() )
    .map(dirent=>path.resolve(dir,dirent.name))
  )

  const foldersFiles = await Promise.all(
    list
    .filter(dirent=> dirent.isDirectory())
    .map(dirent=>walk(path.resolve(dir,dirent.name)))
  )

  const flatFoldersFiles = foldersFiles.reduce((cur,a)=>cur.concat(a),[])

  return files.concat(flatFoldersFiles);
};

async function extractMessages() {
  const pages      = await walk(path.resolve(__dirname,'..','app'))
  const components = await walk(path.resolve(__dirname,'..','components'))
  const fileset    = pages.concat(components)

  const resultAsString = await extract(
    fileset,
    {
      idInterpolationPattern: '[sha512:contenthash:base64:6]'
    }
  )

  return JSON.parse(resultAsString)
}

async function work() {
  const needed  = await extractMessages()
  const current = await loadJson('fr-FR/lang.json')

  const toAdd = Object.keys(needed).reduce(
    (cur,a)=>{
      if (!current[a]) {
        const x = needed[a]
        cur = cur + `"${a}": "${x.defaultMessage} (${x.description})",\n`
      }
      return cur
    },
    ""
  )

  const toRemove = Object.keys(current).reduce(
    (cur,a)=>{
      if (!needed[a]) {
        const x = current[a]
        cur = cur + `"${a}": "${current[a]}",\n`
      }
      return cur
    },
    ""
  )

  console.log("___ to add:")
  console.log(toAdd)
  console.log("")
  console.log("___ to remove:")
  console.log(toRemove)
}

work()
