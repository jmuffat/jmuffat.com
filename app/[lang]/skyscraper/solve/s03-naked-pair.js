import { popCount } from '../util'
import {gridCoords, knownMask, pencilCell,solveStep} from '../state'


export function findNakedPair(state) {
    const {sz,c} = state

    // rows
    for(let row=0; row<sz; row++) {
        for(let colA=0; colA<sz-1; colA++) {
            const maskA = c[colA+row*sz]
            if (maskA&knownMask) continue;
            if (popCount(maskA)!=2) continue

            for(let colB=colA+1; colB<sz; colB++) {
                const maskB = c[colB+row*sz]
                if (maskA==maskB) {
                    // found pair, remove candidates from rest of row
                    let change=0
                    for(let col=0; col<sz; col++) {
                        if (col==colA || col==colB) continue
                        change += pencilCell(state, row, col, ~maskA)
                    }

                    if (change) {
                        const A = gridCoords(row,colA)
                        const B = gridCoords(row,colB)
                        return solveStep(state, `naked pair ${A}/${B}`, [A,B])
                    }
                }
            }
        }
    }

    // cols
    for(let col=0; col<sz; col++) {
        for(let rowA=0; rowA<sz-1; rowA++) {
            const maskA = c[col+rowA*sz]
            if (maskA&knownMask) continue;
            if (popCount(maskA)!=2) continue

            for(let rowB=rowA+1; rowB<sz; rowB++) {
                const maskB = c[col+rowB*sz]
                if (maskA==maskB) {
                    // found pair, remove candidates from rest of col
                    let change=0
                    for(let row=0; row<sz; row++) {
                        if (row==rowA || row==rowB) continue
                        change += pencilCell(state, row, col, ~maskA)
                    }
                    
                    if (change) {
                        const A = gridCoords(rowA,col)
                        const B = gridCoords(rowB,col)
                        return solveStep(state, `naked pair ${A}/${B}`, [A,B])
                    }
                }
            }
        }
    }
}
