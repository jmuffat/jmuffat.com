"use server"

import { checkDebug } from './sites/debug'
import { checkLinkedIn }from './sites/linkedin'
import { checkYoutube } from './sites/youtube'
import { checkRedirectors } from './sites/redirectors'
import { checkWLServices } from './sites/wlservices'
import { checkAwsTrackMe } from './sites/aws-track-me'
import { checkGoogle } from './sites/google'

const checks = [
    checkLinkedIn,
    checkYoutube,
    checkWLServices,
    checkAwsTrackMe,
    checkGoogle,
    checkDebug,
    checkRedirectors
]

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
                ['fbclid','gclid'].includes(key)
            ||  /^utm_/.test(key)   // Google Analytics
            ||  /^at_/.test(key)    // Piano Analytics
            ||  /^mtm_/.test(key)   // Matomo
            ||  ignoreParm(key, "www.linkedin.com", ['lipi','trk','li_source','trackingId','rcm'])
        ) {
            badparms.push(key)
            continue
        }

        res.search[key] = value
    }

    for(const key of badparms) url.searchParams.delete(key)

    const processor = {
        recurse: async (url) => {
            const res = await processUrl(url)
            if (res.actualLink) return res.actualLink
            return url
        }
    }

    for(const check of checks) {
        res = await check(processor,res)
    }
    
    if (!res.actualLink) res.actualLink = url.href
    
    return res
}

export async function unobfuscate(str) {
    const reURLs = /(https?):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/gm
    
    let array = []
    while ((array = reURLs.exec(str)) !== null) {
        // we process only the first url for now
        return processUrl(array[0])
    }

    return {error: "no url"}
}