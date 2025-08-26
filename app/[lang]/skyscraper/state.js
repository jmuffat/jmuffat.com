export const knownMask = 0x8000 
export const candidateMask = value => 1<<(value-1)

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
    const offset = col+row*s.sz
    if (s.c[offset]&knownMask) return

    s.c[offset] &= mask
}

