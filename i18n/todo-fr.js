const fs = require('fs')
const path = require('path')

async function loadJson(a) {
  const filepath = path.join(__dirname,a)
  const res = await fs.promises.readFile(filepath,{encoding:'utf-8'})
  return JSON.parse(res)
}

async function work() {
  const current = await loadJson('fr-FR/lang.json')
  const needed  = await loadJson('lang.json')

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
