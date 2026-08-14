"use server"

import * as cheerio from 'cheerio'

async function recurse(url) {
    const res = await processUrl(url)
    if (res.actualLink) return res.actualLink
    return url
}

async function loadText(src) {
    const res = await fetch(src)
    return {
        url: res.url ?? src,
        txt: await res.text()
    }
}

async function checkLinkedIn(res) {
    if (res.host==="www.linkedin.com") {
        if (res.path==="/safety/go/") {
            if (!res.search.url) return res
            return {...res, actualLink: await recurse(res.search.url)}
        }

        return res
    }

    if (res.host==="lnkd.in") {
        const loaded = await loadText(res.href)
        const $ = cheerio.load(loaded.txt)
        const el = $.extract({
            link: {selector:'a[data-tracking-control-name="external_url_click"]',value:'href'}
        })
        if (el.link) return {...res, actualLink: await recurse(el.link)}
        if (loaded.url) return {...res, actualLink: loaded.url}
        return res
    }

    return res
}

async function checkYoutube(res) {
    const addActualLink = v=>({...res, actualLink: `https://youtu.be/${v}`})

    if (res.host==="www.youtube.com") {
        if (res.search.v) return addActualLink(res.search.v)
        return res
    }

    if (res.host==="youtu.be") {
        if (res.path) return addActualLink(res.path.substring(1))
        return res
    }

    return res
}

async function checkOkt(res) {
    if (res.host==="okt.to") {
        const {txt} = await loadText(res.href)
        const $ = cheerio.load(txt)
        const el = $.extract({
            refresh: {selector:'meta[http-equiv="refresh"]',value:'content'}
        })
        const re = /(?:^|;)url=(.*?)(?:$|;)/
        const x = re.exec(el.refresh)
        if (x) return {...res, actualLink: await recurse(x[1])}

        return res
    }

    return res
}

async function processUrl(text) {
    const url = new URL(text)

    let res = {
        href: url.href,
        host: url.hostname,
        path: url.pathname,
        search: {}
    }

    const ignoreParm = (key, host, parameters) => (host===url.hostname) && parameters.includes(key)

    const badparms = []

    for (const [key, value] of url.searchParams) {
        if (
                /^utm_/.test(key)
            ||  ignoreParm(key, "www.linkedin.com", ['lipi','trk','li_source'])
        ) {
            badparms.push(key)
            continue
        }

        res.search[key] = value
    }

    for(const key of badparms) url.searchParams.delete(key)

    res = await checkLinkedIn(res)
    res = await checkYoutube(res)
    res = await checkOkt(res)
    
    if (!res.actualLink) res.actualLink = url.href
    
    return res
}

export async function unobfuscate(url) {return processUrl(url)}