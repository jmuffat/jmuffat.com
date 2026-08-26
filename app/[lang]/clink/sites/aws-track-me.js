import {hostRules, testHostRules} from '../util'

const rules = hostRules([
    {any:"awstrack.me"}
])

export async function checkAwsTrackMe(processor,res) {
    if (testHostRules(rules,res.host)) {
        const x = res.path.split('/')

        if (x[1]=="L0") {
            const actualLink = decodeURIComponent(x[2])
            if (actualLink) return {...res, actualLink} 

            return res
        }

        return res
    }

    return res
}