import * as cheerio from 'cheerio'
import { hostRules, testHostRules, loadText } from "../util"

const rulesRedirect = hostRules([
    "cta.narvar.com",
    "c.gle",
    "share.google"
])

const rulesMetaRefresh = hostRules([
    "okt.to",
    "one-time-offer.com",
    {any:"email.francetravail.fr"}
]) 

async function parseMetaRefresh(txt) {
    //const $ = cheerio.load(txt, {xmlMode: true, lowerCaseAttributeNames:true, })
    const $ = cheerio.load(txt, {scriptingEnabled: false})    
    const el = $.extract({
        refresh: {selector:'meta[http-equiv="refresh"]',value:'content'},
    })

    {
        const re = /(?:^|;)url=(.*?)(?:$|;)/i
        const x = re.exec(el.refresh)
        if (x) return x[1]
    }

    {
        const re = /\d+(?:.\d*);(.*?)(?:$|;)/
        const x = re.exec(el.refresh)
        if (x) return x[1]
    }

    return null
}

export async function checkRedirectors(processor,res) {
    const {url,txt} = await loadText(res.href)

    const redirect = await parseMetaRefresh(txt)
    if (redirect) return {...res, actualLink: await processor.recurse(redirect)}

    if (url!==res.href) return {...res, actualLink: await processor.recurse(url)}

    return res
}

