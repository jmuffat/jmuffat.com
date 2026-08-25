import * as cheerio from 'cheerio'
import { loadText } from "../util"

export async function checkLinkedIn(processor,res) {
    if (res.host==="www.linkedin.com") {
        if (res.path==="/safety/go/") {
            if (!res.search.url) return res
            return {...res, actualLink: await processor.recurse(res.search.url)}
        }

        return res
    }

    if (res.host==="lnkd.in") {
        const loaded = await loadText(res.href)
        const $ = cheerio.load(loaded.txt)
        const el = $.extract({
            link: {selector:'a[data-tracking-control-name="external_url_click"]',value:'href'}
        })
        if (el.link) return {...res, actualLink: await processor.recurse(el.link)}
        if (loaded.url) return {...res, actualLink: loaded.url}
        return res
    }

    return res
}
