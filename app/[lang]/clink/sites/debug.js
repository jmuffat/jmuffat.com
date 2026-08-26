import { hostRules, loadText, testHostRules } from "../util"

const rules = hostRules([
])

export async function checkDebug(processor,res) {
    if (testHostRules(rules,res.host)) {
        const {url,txt} = await loadText(res.href)
        console.log(txt)
        console.log({url})
        return res
    }

    return res
}