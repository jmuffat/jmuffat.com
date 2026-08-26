import { loadText } from "../util"

export async function checkWLServices(processor,res) {
    if (res.host==="banners.wlservices.fr") {
        const {txt} = await loadText(res.href)    
    
        {
            const x = /document.location.href=['"](.*?)['"]/.exec(txt)
            if (x) return {...res, actualLink: await processor.recurse(x[1])}
        }
        
        return res
    }

    return res
}