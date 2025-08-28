import {knownMask,setCell} from '../state'

export function checkOnlyCandidates(state) {
    const {sz,c} = state
    let X = []

    function reset() {X=Array(sz).fill('')}

    function addCandidates(mask, i) {
        if (mask&knownMask) return

        const s = i.toString()
        for(let i=0; i<sz; i++) {
            if (mask&(1<<i)) X[i] = X[i].concat(s)
        }
    }

    for(let row=0; row<sz; row++) {
        reset()
        for(let col=0; col<sz; col++) addCandidates(c[col+row*sz], col)
        
        for(let i=0; i<sz; i++) {
            // if (X[i].length==0) verify we're here because this value is known
            if (X[i].length!=1) continue

            let col=Number(X[i])
            setCell(state, row, col, i+1)
            return {
                label: `only ${i+1} in row ${row+1}`,
                state: structuredClone(state)
            }
        }
    }
    
    for(let col=0; col<sz; col++) {
        reset()
        for(let row=0; row<sz; row++) addCandidates(c[col+row*sz], row)
        
        for(let i=0; i<sz; i++) {
            // if (X[i].length==0) verify we're here because this value is known
            if (X[i].length!=1) continue

            let row=Number(X[i])
            setCell(state, row, col, i+1)
            return {
                label: `only ${i+1} in column ${col+1}`,
                state: structuredClone(state)
            }
        }
    }     
}
