const {fetchPage} = require('./fetch-page')

function processLine($,a) {
  const columns = $(a).find('td')
  if (!columns.length) return null

  const res = []
  columns.each( (i,c)=>{
    const t = $(c).text().trim()
    const l = $(c).find('a').attr('href')
    res.push(l?{t,l}:{t})
  })

  return res
}

function processContent(data,id,$,contents) {
  contents.each((i,el)=>{
    if (el.type!=='tag' || el.name!=='table') return

    // const titles = []
    // $(el)
    // .find('tbody > tr > th')
    // .each( (i,a)=>titles.push($(a).text().trim()) )

    $(el)
    .find('tbody > tr')
    .each( (i,a)=>{
      row = processLine($,a)
      if (row) {
        const item = {
          id   : row[0].t,
          name : row[1].t,
          link : row[1].l,
          parent: id
        }

        for(var i=2; i<row.length; i++) {
          if (row[i].l && row[i].t.length>0 && row[i].t.length<4) {
            item.parent = item.id.slice(0,3)+row[i].t
            break
          }
        }

        data.push(item)
      }
    })
  })

}

async function processProvinces(id, wikiPage) {
  const data = []

  if (!wikiPage) return data

  const url = 'https://en.wikipedia.org'+wikiPage
  const $ = await fetchPage(url)

  $('h2').each( (i,el)=>{
    const self=$(el)
    const title = self.find('.mw-headline').text().trim()
    if (title!=='Current codes') return

    const contents = self.nextUntil('h2')
    processContent(data,id,$,contents)
  } )

  return data
}

module.exports = {
  processProvinces
}
