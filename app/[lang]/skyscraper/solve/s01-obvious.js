import {setCell,gridCoords,singleCandidate} from '../state'


export function findSingleCandidate(state) {
    const {sz,c} = state

    for(let row=0; row<sz; row++) {
        for(let col=0; col<sz; col++) {
            const x = singleCandidate(c[col+row*sz])
            if (x) {
                setCell(state, row, col, x)
                return {
                    label: `${gridCoords(row,col)} can only be ${x}`,
                    state: structuredClone(state)
                }
            }
        }
    }
}
