const fetch = require('node-fetch')

const githubPath = (owner,repo,path)=>`https://raw.githubusercontent.com/${owner}/${repo}/master/${path}`

async function githubFetchBuffer(owner,repo,path){
  const url = githubPath(owner,repo,path)
  const res = await fetch(url)
  return res.buffer()
}

async function githubFetchJson(owner,repo,path){
  const url = githubPath(owner,repo,path)
  const res = await fetch(url)
  return res.json()
}

async function githubFetchText(owner,repo,path){
  const url = githubPath(owner,repo,path)
  const res = await fetch(url)
  return res.text()
}


module.exports = {
  githubPath,
  githubFetchBuffer,
  githubFetchJson,
  githubFetchText
}
