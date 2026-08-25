import * as cheerio from 'cheerio'

export async function loadText(src) {
    const res = await fetch(src)
    return {
        url: res.url ?? src,
        txt: await res.text()
    }
}

export async function parseMetaRefresh(href) {
    const {txt} = await loadText(href)
    const $ = cheerio.load(txt, {xmlMode: true})
    const el = $.extract({
        refresh: {selector:'meta[http-equiv="refresh"]',value:'content'}
    })

    {
        const re = /(?:^|;)url=(.*?)(?:$|;)/
        const x = re.exec(el.refresh)
        console.log({el,x})
        if (x) return x[1]
    }

    {
        const re = /\d+(?:.\d*);(.*?)(?:$|;)/
        const x = re.exec(el.refresh)
        console.log({el,x})
        if (x) return x[1]
    }

    return null
}

export function hostDomain(hostname,num) {
    return (
        hostname
        .split('.')
        .slice(-num)
        .join('.')
    )
}
