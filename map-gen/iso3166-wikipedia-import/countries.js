const {fetchPage} = require('./fetch-page')
const {processProvinces} = require('./provinces')

function processCountry(rows,$,a) {
  const column = $(a).find('td')
  if (!column.length) return

  const id      = $(column[0]).text()
  const isoPage = $(column[0]).find('a').attr('href')
  const name    = $(column[1]).text()
  const link    = $(column[1]).find('a').attr('href')

  rows.push({
    id,
    name,
    link,isoPage
  })
}

async function processCountries(url) {
  const $ = await fetchPage(url)
  const tables = $('table.wikitable')
  if (!tables) throw(new Error(`can't find countries table`))

  const table = tables[0]
  const rows = []
  $(table).find('tbody > tr').each( (i,a)=>processCountry(rows,$,a) )

  const data=[]
  for(i in rows) {
    const a = rows[i]
    const provinces = await processProvinces(a.id, a.isoPage)

    data.push({
      id:   a.id,
      name: a.name,
      link: a.link
    })

    for(j in provinces) data.push(provinces[j])
  }

  return data
}

module.exports = {
  processCountries
}
