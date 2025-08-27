import {candidateMask,setCell,pencilCell} from '../state'

function impossibleList(sz,vis) {
    let res=[]

    while (vis>1) {
        let mask=0
        for(let i=0; i<vis-1; i++) {
            mask |= candidateMask(sz-i)
        }

        res.push(~mask)
        vis--
    }
    return res
}

function impossibleListN(s) {
    const {sz,N} = s
    const res = []

    for(let col=0; col<sz; col++) {
        const X = impossibleList(sz, N[col])
        let change = 0
        for(let j=0; j<X.length; j++) {
            change += pencilCell(s, j, col, X[j])
        }

        if (change) res.push({
            label: `basic visibility N${col+1}`,
            state: structuredClone(s)
        })
    }
    
    return res
}

function impossibleListE(s) {
    const {sz,E} = s
    const res = []

    for(let row=0; row<sz; row++) {
        const X = impossibleList(sz, E[row])
        let change = 0
        for(let j=0; j<X.length; j++) {
            change += pencilCell(s, row, sz-j-1, X[j])
        }

        if (change) res.push({
            label: `basic visibility E${row+1}`,
            state: structuredClone(s)
        })
    }

    return res
}

function impossibleListS(s) {
    const {sz,S} = s
    const res = []

    for(let col=0; col<sz; col++) {
        const X = impossibleList(sz, S[col])
        let change = 0
        for(let j=0; j<X.length; j++) {
            change += pencilCell(s, sz-j-1, col, X[j])
        }

        if (change) res.push({
            label: `basic visibility S${col+1}`,
            state: structuredClone(s)
        })
    }

    return res
}

function impossibleListW(s) {
    const {sz,W} = s
    const res = []

    for(let row=0; row<sz; row++) {
        const X = impossibleList(sz, W[row])
        let change = 0
        for(let j=0; j<X.length; j++) {
            change += pencilCell(s, row, j, X[j])
        }

        if (change) res.push({
            label: `basic visibility W${row+1}`,
            state: structuredClone(s)
        })
    }

    return res
}

function ones(state) {
    const {sz, N,E,S,W} = state
    let changed = false

    for(let i=0; i<sz; i++) {
        if (N[i]==1) {setCell(state,    0,    i, sz); changed=true}
        if (E[i]==1) {setCell(state,    i, sz-1, sz); changed=true}
        if (S[i]==1) {setCell(state, sz-1,    i, sz); changed=true}
        if (W[i]==1) {setCell(state,    i,    0, sz); changed=true}
    }

    if (changed) return [{
        label: 'visibility of 1',
        state: structuredClone(state)
    }]
}

export function pencilBasicVisibility(state) {
    // all steps returned at once, as this is ran first
    // and won't be needed again

    let res = []
    res = res.concat( ones(state) )
    res = res.concat( impossibleListN(state) )
    res = res.concat( impossibleListE(state) )
    res = res.concat( impossibleListS(state) )
    res = res.concat( impossibleListW(state) )

    return res
}