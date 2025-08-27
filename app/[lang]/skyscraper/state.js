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

