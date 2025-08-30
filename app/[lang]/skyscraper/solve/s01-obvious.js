import {setCell,gridCoords,singleCandidate,solveStep} from '../state'


export function findSingleCandidate(state) {
    const {sz,c} = state

    for(let row=0; row<sz; row++) {
        for(let col=0; col<sz; col++) {
            const x = singleCandidate(c[col+row*sz])
            if (x) {
                setCell(state, row, col, x)
                return solveStep(state, `${gridCoords(row,col)} can only be ${x}`)
            }
        }
    }
}
