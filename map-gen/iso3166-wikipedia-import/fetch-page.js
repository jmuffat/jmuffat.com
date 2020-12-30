const cheerio = require('cheerio');
const fetch = require('node-fetch')

async function fetchPage(url) {
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
  return cheerio.load(txt)
}

module.exports = {
  fetchPage
}
