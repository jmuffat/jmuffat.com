const fs = require('fs')
const path = require('path')


class Parser {
  constructor(data) {
    this.data = data
    this.idx  = 0
    this.done = false
  }

  more() {
    return this.idx < this.data.length
  }

  popRecord() {
    const data = this.data
    const res = []

    if (data[this.idx]!=='(') throw new Error("expected '('")

    do {
      ++this.idx // skip '(' or ','
      res.push( this.popValue() )
    } while (data[this.idx]!==')')

    ++this.idx // skip ')'
    this.done = data[this.idx]===';'
    ++this.idx // skip ',' or ';'

    return {
      ID : res[0],
      post_author : res[1],
      post_date : res[2],
      post_date_gmt : res[3],
      post_content : res[4],
      post_title : res[5],
      post_excerpt : res[6],
      post_status : res[7],
      comment_status : res[8],
      ping_status : res[9],
      post_password : res[10],
      post_name : res[11],
      to_ping : res[12],
      pinged : res[13],
      post_modified : res[14],
      post_modified_gmt : res[15],
      post_content_filtered : res[16],
      post_parent : res[17],
      guid : res[18],
      menu_order : res[19],
      post_type : res[20],
      post_mime_type : res[21],
      comment_count : res[22]
    }
  }

  popValue() {
    const data  = this.data
    const start = this.idx

    /* numeric value */
    if (/[0-9]/.test(data[this.idx])) {
      do {
        ++this.idx
      } while (/[0-9]/.test(data[this.idx]))
      return data.substring(start,this.idx)
    }

    /* string value */
    if (data[this.idx]!=="'") throw new Error(`Expected "'"`)
    ++this.idx
    while (data[this.idx]!=="'") {
      if (data[this.idx]==='\\') ++this.idx
      ++this.idx
    }
    ++this.idx

    const s = data.substring(start+1,this.idx-1)
    const quotesUnescaped = s.replace(/\\\'/g,"'")
    const jsoned = `"${quotesUnescaped}"`
    return JSON.parse(jsoned)
  }
}

async function makePost(a) {
  const text = `---
title: '${a.post_title}'
date: '${a.post_date.substring(0,10)}'
author: jmm
id:${a.ID}
---
${a.post_content}
`
  const filepath = path.join(__dirname,'data','wp-export',`${a.ID}.md`)
  await fs.promises.writeFile(filepath,text)
  return text
}

async function work() {
  const filepath = path.join(__dirname,'data','wordpress-backup')
  console.log(filepath)

  const data = await fs.promises.readFile(filepath,{encoding:'utf8'})
  console.log({length:data.length})

  const parser = new Parser(data)
  const res = []
  while (!parser.done) {
    const record = parser.popRecord()
    if (record.post_status==='publish') {
      const post = await makePost(record)
      res.push(record)
    }
  }

  console.log(res)

}

work()
.then(()=>console.log('\ndone.\n'))
