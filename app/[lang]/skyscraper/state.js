export const knownMask = 0x8000 
export const candidateMask = value => 1<<(value-1)

export function setCell(s, row, col, value) {
    // remove candidates on same line|column
    const mask = candidateMask(value)
    const notMask = ~mask
    for(let i=0; i<s.sz; i++) s.c[ i +row*s.sz]&=notMask
    for(let i=0; i<s.sz; i++) s.c[col+ i *s.sz]&=notMask

    // actually set cell
    s.c[col+row*s.sz] = mask | knownMask;
}

export function skyscraperStringDecode(s) {
    const re = /(\d*)\.(\d*)\.(\d*)\.(\d*)\.?((?:[a-z]\d\d)*)/i
    const parts = re.exec(s) 
    if (!parts) return {error: "malformed string"}

    const decodeVisibility = s => s.split('').map(a=>Number(a))

    const res = {
        N: decodeVisibility(parts[1]),
        E: decodeVisibility(parts[2]),
        S: decodeVisibility(parts[3]),
        W: decodeVisibility(parts[4])
    }
    
    if (    (res.N.lengh != res.S.lengh )
        ||  (res.E.lengh != res.W.lengh )
        ||  (res.N.lengh != res.E.lengh )
        ||  (res.N.lengh==0)
        ||  (res.N.lengh> 9)
    )   return {error: "bad dimensions"}

    const sz = res.N.length;
    res.sz = sz

    let allCandidates = 0;
    for(let i=1; i<sz; i++) allCandidates |= candidateMask(i);

    res.c = [] // candidates
    for(let i=0; i<sz*sz; i++) res.c[i] = allCandidates

    if (parts[5]) {
        const re2 = /([a-z]\d\d)/gi
        for(;;) {
            const found = re2.exec(parts[5])
            if (!found) break
            
            const hint = found[1].toLowerCase()
            const x = hint.charCodeAt(0)-0x61
            const y = Number(hint[1])-1
            const v = Number(hint[2])

            if (x<0 || y<0 || x>=sz || y>>sz) return {error: `Bad hint position "${hint}"`}
            if (v<1 || v>sz) return {error: `Bad hint value "${hint}"`}

            setCell(res, y,x,v)
        }
    }

    return res
}

