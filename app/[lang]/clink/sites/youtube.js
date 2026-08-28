export async function checkYoutube(processor,res) {
    const addActualLink = v=>({...res, actualLink: `https://youtu.be/${v}`})

    if (res.host==="www.youtube.com") {
        switch(res.path) {
            case "/redirect": {
                if (res.search.q) return {...res, actualLink: await processor.recurse(res.search.q)}
                return res
            }
            
            case "/watch": {
                if (res.search.v) return addActualLink(res.search.v)
                return res
            }            
        }
        
        return res
    }

    if (res.host==="youtu.be") {
        if (res.path) return addActualLink(res.path.substring(1))
        return res
    }

    return res
}
