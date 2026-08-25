import { parseMetaRefresh } from "../util"

export async function checkOkt(processor,res) {
    if (res.host==="okt.to") {
        const redirect = await parseMetaRefresh(res.href)
        if (redirect) return {...res, actualLink: await processor.recurse(redirect)}

        return res
    }

    return res
}

