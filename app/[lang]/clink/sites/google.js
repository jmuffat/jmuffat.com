export async function checkGoogle(processor,res) {
    if (res.host==="www.google.com") {
        if (res.path==="/url") {
            if (!res.search.url) return res
            return {...res, actualLink: await processor.recurse(res.search.url)}
        }
    }

    return res
}