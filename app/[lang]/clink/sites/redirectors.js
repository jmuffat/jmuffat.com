import * as cheerio from 'cheerio'
import { hostRules, testHostRules, loadText } from "../util"

const rulesRedirect = hostRules([
    "cta.narvar.com"
])

const rulesMetaRefresh = hostRules([
    "okt.to",
    "one-time-offer.com",
    {any:"email.francetravail.fr"}
]) 

async function parseMetaRefresh(href) {
    const {txt} = await loadText(href)
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
    if (testHostRules(rulesRedirect,res.host)) {
        const {url} = await loadText(res.href)
        if (url) return {...res, actualLink: await processor.recurse(url)}
        
        return res
    }

    if (testHostRules(rulesMetaRefresh,res.host)) {
        const redirect = await parseMetaRefresh(res.href)
        if (redirect) return {...res, actualLink: await processor.recurse(redirect)}

        return res
    }

    return res
}

