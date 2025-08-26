import {candidateMask,pencilCell} from '../state'

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
    for(let col=0; col<sz; col++) {
        const X = impossibleList(sz, N[col])
        for(let j=0; j<X.length; j++) {
            pencilCell(s, j, col, X[j])
        }
    }
}

function impossibleListE(s) {
    const {sz,E} = s
    for(let row=0; row<sz; row++) {
        const X = impossibleList(sz, E[row])
        for(let j=0; j<X.length; j++) {
            pencilCell(s, row, sz-j-1, X[j])
        }
    }
}

function impossibleListS(s) {
    const {sz,S} = s
    for(let col=0; col<sz; col++) {
        const X = impossibleList(sz, S[col])
        for(let j=0; j<X.length; j++) {
            pencilCell(s, sz-j-1, col, X[j])
        }
    }
}

function impossibleListW(s) {
    const {sz,W} = s
    for(let row=0; row<sz; row++) {
        const X = impossibleList(sz, W[row])
        for(let j=0; j<X.length; j++) {
            pencilCell(s, row, j, X[j])
        }
    }
}

export function pencilVisibility(state) {
    impossibleListN(state)
    impossibleListE(state)
    impossibleListS(state)
    impossibleListW(state)
}