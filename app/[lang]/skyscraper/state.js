export const knownMask = 0x8000 
export const candidateMask = value => 1<<(value-1)

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
    // remove candidates on same line|column
    const mask = candidateMask(value)
    const notMask = ~mask
    for(let i=0; i<s.sz; i++) pencilCell(s,row,i,  notMask)
    for(let i=0; i<s.sz; i++) pencilCell(s,i,  col,notMask)

    // actually set cell
    s.c[col+row*s.sz] = mask | knownMask;
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
    return 1
}

export const gridCol = col=>String.fromCharCode( 'A'.charCodeAt(0) + col )
export const gridCoords = (row,col)=> `${gridCol(col)}${row+1}`

export function isSolved(state) {
    // TODO: verify solution is actually correct...
    const x = state.c.reduce(
        (cur,a) => cur&a,
        knownMask
    )

    return !!(x&knownMask)
}
