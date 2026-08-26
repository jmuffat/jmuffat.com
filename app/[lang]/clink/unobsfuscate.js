"use server"

import { checkDebug } from './sites/debug'
import { checkLinkedIn }from './sites/linkedin'
import { checkYoutube } from './sites/youtube'
import { checkRedirectors } from './sites/redirectors'
import { checkWLServices } from './sites/wlservices'
import { checkAwsTrackMe } from './sites/aws-track-me'

const checks = [
    checkLinkedIn,
    checkYoutube,
    checkRedirectors,
    checkWLServices,
    checkAwsTrackMe,
    checkDebug
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
                /^utm_/.test(key)
            ||  ignoreParm(key, "www.linkedin.com", ['lipi','trk','li_source','trackingId'])
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

export async function unobfuscate(url) {return processUrl(url)}