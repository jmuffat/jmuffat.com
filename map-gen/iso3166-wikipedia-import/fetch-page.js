const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const mkdirp = require('mkdirp')


async function _fetchPage(url, cachePath) {
  var res
  var retry = true

  while (retry) {
    res = await fetch(url)

    switch (res.status) {
      case 429: /* Too Many Requests */
        await new Promise(r => setTimeout(r, 1000));
        break;

      default:
        retry=false
    }
  }

  const txt = await res.text()

  await fs.promises.writeFile(cachePath, txt)

  return txt
}

async function fetchPage(url) {
  const cacheFolder = path.join(__dirname,'cache')
  await mkdirp(cacheFolder)

  const hash = crypto.createHash("md5").update(url).digest('hex')
  const cachePath = path.join(cacheFolder,`${hash}.txt`)

  const promise = fs.existsSync(cachePath)?
      fs.promises.readFile(cachePath)
    : _fetchPage(url, cachePath)

  const txt = await promise
  return cheerio.load(txt)
}

module.exports = {
  fetchPage
}
