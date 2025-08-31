import {knownMask,pencilCell,getKnownCell,candidateMask,solveStep, gridCoords} from '../state'
import { popCount } from '../util'

function getColumns(mask) {
    // we know there are only two bits set
    const res = []
    
    for(let i=0; i<10; i++) {
        if (mask&(1<<i)) res.push(i)
    }

    return res
}

export function findXWing(state) {
    const {sz,c} = state


    for(let a=0; a<=sz; a++) {
        const valMask = candidateMask(a+1)

        const where = []
        // for each row, find which column are possible
        for(let row=0; row<sz; row++) {
            where[row]=0
            for(let col=0; col<sz; col++) {
                const m = c[col+row*sz]
                if (m&valMask) where[row]|=1<<col
            }
        }

        // check for two rows with same 2x candidate colums
        for(let rowA=0; rowA<sz-1; rowA++) {
            if (popCount(where[rowA])!=2) continue

            for(let rowB=rowA+1; rowB<sz; rowB++) {
                if (where[rowB]!=where[rowA]) continue

                const [colA,colB] = getColumns(where[rowA])

                let change=0
                for(let row=0; row<sz; row++) {
                    if (row==rowA || row==rowB) continue
                    change += pencilCell(state, row,colA, ~valMask)
                    change += pencilCell(state, row,colB, ~valMask)
                }

                for(let col=0; col<sz; col++) {
                    if (col==colA || col==colB) continue
                    change += pencilCell(state, rowA,col, ~valMask)
                    change += pencilCell(state, rowB,col, ~valMask)
                }
                
                if (change) {
                    const   AA = gridCoords(rowA,colA),
                            AB = gridCoords(rowA,colB),
                            BA = gridCoords(rowB,colA),
                            BB = gridCoords(rowB,colB)
                    return solveStep(
                        state, 
                        `X-wing of ${a+1}'s, at ${AA}-${AB}-${BA}-${BB}`,
                        [
                            AA,AB,BA,BB,
                            `${AA}.${a+1}`,
                            `${AB}.${a+1}`,
                            `${BA}.${a+1}`,
                            `${BB}.${a+1}`,
                        ]
                    )
                }
            }
        }
    }
}