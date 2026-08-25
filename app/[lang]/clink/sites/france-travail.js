import {hostDomain, parseMetaRefresh} from '../util'

export async function checkFranceTravail(processor,res) {
    const domain = hostDomain(res.host,3)

    if (domain==="email.francetravail.fr") {
        const redirect = await parseMetaRefresh(res.href)
        if (redirect) return {...res, actualLink: await processor.recurse(redirect)}

        return res
    }

    return res
}