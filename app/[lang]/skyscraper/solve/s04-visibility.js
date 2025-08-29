import {knownMask,pencilCell,getKnownCell,candidateMask} from '../state'

function prepSeq(state,seq) {
    const {sz,c} = state
    let {row,col,dr,dc} = seq
    
    let n = 0
    for(let i=0; i<sz; i++) {
        const ir = row+i*dr
        const ic = col+i*dc
        const mask = c[ic+sz*ir]
        if (mask&knownMask) n++
    }
    
    seq.known = n
    return seq
}

function visibilityDone(state,seq) {
    const {sz,c} = state
    let {row,col,dr,dc,vis} = seq

    let min=0
    let n=0
    for(let i=0; i<sz; i++) {
        const ir = row+i*dr
        const ic = col+i*dc
        const mask = c[ic+sz*ir]
        const val = getKnownCell(mask)
        if (!val) return false 
        if (val<min) continue
        min=val
        n++
        if (n==vis) return true
    }

    console.log("SHOULD NEVER REACH HERE")
    return true
}

function generateOptions(sz,line,vis,min,usedMask) {
    const [mask,...rest] = line

    function recurse(val) {
        const newMin = Math.max(min,val)
        const newVis = (newMin==min) ? vis : vis-1
        const newMsk = usedMask | candidateMask(val)
        
        if (newVis) {
            const subOptions = generateOptions(sz,rest,newVis,newMin,newMsk)
            return subOptions.map(a => [val, ...a])
        }
        
        if (val==sz) return [[val]]
        return []
    }

    const known = getKnownCell(mask)
    if (known) {
        return recurse(known)
    }
    else {
        let res = []
        const fullMask = mask & ~usedMask
        for(let a=1; a<10; a++) {
            const bit=candidateMask(a)
            if (bit&fullMask) res = res.concat( recurse(a) )
        }
        return res
    }
}

function processSeq(state,seq) {
    const {sz,c} = state
    let {row,col,dr,dc} = seq

    const line=[]
    for(let i=0; i<sz; i++) {
        const ir = row+i*dr
        const ic = col+i*dc
        line.push( c[ic+sz*ir] )
    }

    let options = generateOptions(sz,line,seq.vis, 0,0)

    // TODO: generate options directly as bitfields
    let optionsMask = options.reduce(
        (cur,a)=>{
            for(let i=0; i<sz; i++) {
                cur[i] |= a[i]? candidateMask(a[i]) : 0x1ff
            }
            return cur
        },
        Array(sz).fill(0)
    )

    // console.log('----------')
    // console.log(seq)
    // console.log(options)

    // apply constraints
    let change = 0
    for(let i=0; i<sz; i++) {
        const m = optionsMask[i]
        if (i==0x1ff) continue
        
        change += pencilCell(state, row+i*dr, col+i*dc, m)
    }

    // if it changes anything, it is a step forward
    if (change) return({
        label: `visibility ${seq.label}`,
        state: structuredClone(state)
    })
}

export function pencilForVisibility(state) {
    const {sz, N,E,S,W} = state
    let seq = []
    const n=sz-1 // last row|column

    // gather sequences
    for(let i=0; i<sz; i++) {
        if (N[i]) seq.push({label:`N${i+1}`, vis:N[i], row:0, col:i, dr: 1, dc: 0})
        if (E[i]) seq.push({label:`E${i+1}`, vis:E[i], row:i, col:n, dr: 0, dc:-1})
        if (S[i]) seq.push({label:`S${i+1}`, vis:S[i], row:n, col:i, dr:-1, dc: 0})
        if (W[i]) seq.push({label:`W${i+1}`, vis:W[i], row:i, col:0, dr: 0, dc: 1})
    }

    // prepare sequences
    seq = seq
        .filter( s=>!visibilityDone(state,s))   // remove done
        .map( s=>prepSeq(state,s) )             // count known cells
        .sort( (a,b)=> a.vis-b.vis || b.known-a.known) // sort (vis ASC, known DESC)

    // process sequences
    for(let i=0; i<seq.length; i++) {
        const res = processSeq(state,seq[i])
        if (res) return res // return, so easier steps can improve solution
    }
}
