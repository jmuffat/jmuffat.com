export const knownMask = 0x8000 
export const candidateMask = value => 1<<(value-1)
export const gridCol = col=>String.fromCharCode( 'A'.charCodeAt(0) + col )
export const gridCoords = (row,col)=> `${gridCol(col)}${row+1}`

export function setError(state,err) {
    if (state.error)
         state.error.push(err)
    else state.error = [err]
}

export function singleCandidate(mask) {
    switch (mask) {
        case 0x0001: return 1
        case 0x0002: return 2
        case 0x0004: return 3
        case 0x0008: return 4
        case 0x0010: return 5
        case 0x0020: return 6
        case 0x0040: return 7
        case 0x0080: return 8
        case 0x0100: return 9
    }

    return 0
}

export function getKnownCell(mask) {
    if (mask&knownMask) return singleCandidate(mask&0x01ff)
    return 0
}

export function setCell(s, row, col, value) {
    const mask = candidateMask(value)
    const notMask = ~mask
    const oldMask = s.c[col+row*s.sz]

    if (oldMask&knownMask) {
        if (oldMask==value|knownMask) return

        setError(s, `${gridCoords(row,col)}=${getKnownCell(oldMask)}, can't also be ${value}`)
        return
    }

    // actually set cell
    s.c[col+row*s.sz] = mask | knownMask;

    // remove candidates on same line|column
    for(let i=0; i<s.sz; i++) pencilCell(s,row,i,  notMask)
    for(let i=0; i<s.sz; i++) pencilCell(s,i,  col,notMask)
}

export function pencilCell(s, row, col, mask) {
    // this function returns an int rather than a bool because
    // multiple pencil marks will be combined using `+` rathen
    // than '||' to avoid short-circuiting evaluation optimisation

    const offset = col+row*s.sz
    if (s.c[offset]&knownMask) return 0

    const oldVal = s.c[offset]
    const newVal = oldVal & mask
    if (oldVal == newVal) return 0

    s.c[offset] = newVal
    if (!newVal) setError(s, `${gridCoords(row,col)} has no candidates left`)
    return 1
}


export function verifyVisibility(state) {
    const {sz,c, N,E,S,W} = state
    const n=sz-1 // last row|column

    function verify(label,vis, row,col, dr,dc) {
        if (!vis) return
        let min=0
        let n=0
        for(let i=0; i<sz; i++) {
            const a = getKnownCell( c[col+row*sz])
            if (!a) return
            if (min<a) {
                min=a
                n++
            }
            row+=dr
            col+=dc
        }
        if (vis!=n) {
            setError(state, `visibility ${label} = ${n}`)
        }
    }

    for(let i=0; i<sz; i++) {
        verify(`N${i+1}`, N[i], 0, i,  1,  0)
        verify(`E${i+1}`, E[i], i, n,  0, -1)
        verify(`S${i+1}`, S[i], n, i, -1,  0)
        verify(`W${i+1}`, W[i], i, 0,  0,  1)
    }
}

export function isSolved(state) {
    if (state.error) return false

    const x = state.c.reduce(
        (cur,a) => cur&a,
        knownMask
    )

    return !!(x&knownMask)
}

export const solveStep = (state, label)=> ({
    label,
    clock: performance.now(), 
    state: structuredClone(state)
})

