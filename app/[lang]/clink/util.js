export async function loadText(src) {
    const res = await fetch(src)
    return {
        url: res.url ?? src,
        txt: await res.text()
    }
}

export function hostDomain(hostname,num) {
    return (
        hostname
        .split('.')
        .slice(-num)
        .join('.')
    )
}

export function hostRules(a) {
    const rules={
        hosts:[],
        any:{}
    }

    for(const h of a) {
        if (typeof h === 'object') {
            if (h.any) {
                const partsCount = h.any.split('.').length
                if (!rules.any[partsCount]) rules.any[partsCount]=[]
                rules.any[partsCount].push(h.any)
            }
            else throw new Error("bad host rule")
        }
        else rules.hosts.push(h)
    }

    return rules
}

export function testHostRules(rules,hostname) {
    if (rules.hosts.includes(hostname)) return true

    for(const n in rules.any) {
        const domain = hostDomain(hostname,n)
        if (rules.any[n].includes(domain)) return true
    }

    return false
}