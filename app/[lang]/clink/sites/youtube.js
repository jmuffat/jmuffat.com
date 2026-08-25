export async function checkYoutube(processor,res) {
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
