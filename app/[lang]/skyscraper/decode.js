import {candidateMask,setCell} from './state'

export function skyscraperStringDecode(s) {
    const re = /(\d*)\.(\d*)\.(\d*)\.(\d*)\.?((?:[a-z]\d\d)*)/i
    const parts = re.exec(s) 
    if (!parts) return {error: "malformed string"}

    const decodeVisibility = s => s.split('').map(a=>Number(a))

    const state = {
        N: decodeVisibility(parts[1]),
        E: decodeVisibility(parts[2]),
        S: decodeVisibility(parts[3]),
        W: decodeVisibility(parts[4])
    }
    
    if (    (state.N.lengh != state.S.lengh )
        ||  (state.E.lengh != state.W.lengh )
        ||  (state.N.lengh != state.E.lengh )
        ||  (state.N.lengh==0)
        ||  (state.N.lengh> 9)
    )   return {error: "bad dimensions"}

    const sz = state.N.length;
    state.sz = sz

    let allCandidates = 0;
    for(let i=1; i<=sz; i++) allCandidates |= candidateMask(i);

    state.c = [] // candidates
    for(let i=0; i<sz*sz; i++) state.c[i] = allCandidates

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

            setCell(state, y,x,v)
        }
    }

    return state
}

