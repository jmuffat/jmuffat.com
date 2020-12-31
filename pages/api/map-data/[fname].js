const fs = require('fs')
const path = require('path')

function endpointMapData(req, res) {
  const {
    query: { fname },
  } = req

  const filepath = path.join(process.env.ROOT,'map-gen','dst',fname)
  if (!fs.existsSync(filepath)) {
    res.status(500)
    res.json({ error: 'data not found' })
    return
  }

  return new Promise((resolve,reject)=>{
    const readStream = fs.createReadStream(filepath)

    readStream.on('open',  ()=>{
      res.statusCode = 200
      readStream.pipe(res)
      resolve()
    } )

    readStream.on('error', err=>{
      readStream.close()
      res.status(500)
      res.json(err)
      resolve()
    } )

  })
}


export default endpointMapData
