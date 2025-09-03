import { popCount } from '../util'
import { pencilCell,candidateMask,solveStep, gridCoords } from '../state'

export function findHiddenPair(state) {
    const {sz,c} = state

    function findPairs(where, row,col, dr, dc) {

        function gotPair(a,b, loc) {
            const mask = candidateMask(a)|candidateMask(b)
            let change = 0
            let cells = []
            for(let i=0; i<sz; i++) {
                const ir = row+i*dr
                const ic = col+i*dc

                if (loc&(1<<i)) {
                    // cell can only be either candidates ("hidden pair")
                    change += pencilCell(state,ir,ic,mask) 
                    cells.push(gridCoords(ir,ic))
                }
                else {
                    // cell cannot be either candidate ("naked pair")
                    change += pencilCell(state,ir,ic,~mask)
                }
            }

            if (change) {
                const A = cells[0]
                const B = cells[1]
                return solveStep(state, `hidden pair ${A}/${B}`, [A,B])
            }
        }

        for(let i=0; i<sz-1; i++) {
            const a = where[i]
            if (popCount(a)!=2) continue
            for(let j=i+1; j<sz; j++) {
                if (where[j]==a) {
                    const change = gotPair(i+1,j+1,a)
                    if (change) return change
                }
            }
        }
    }

    // rows
    for(let i=0; i<sz; i++) {
        const where = Array(sz).fill(0)
        // find where each value might sit
        for(let j=0; j<sz; j++) {
            const mask = c[j+i*sz]
            for(let a=0; a<sz; a++) {
                if (mask&candidateMask(a+1)) where[a]|=1<<j
            }
        }
        // find pairs
        const change = findPairs(where, i,0, 0,1)
        if (change) return change
    }

    // cols
    for(let i=0; i<sz; i++) {
        const where = Array(sz).fill(0)
        // find where each value might sit
        for(let j=0; j<sz; j++) {
            const mask = c[i+j*sz]
            for(let a=0; a<sz; a++) {
                if (mask&candidateMask(a+1)) where[a]|=1<<j
            }
        }
        // find pairs
        const change = findPairs(where, 0,i, 1,0)
        if (change) return change
    }
}