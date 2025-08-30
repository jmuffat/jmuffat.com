import { candidateMask, gridCoords, knownMask, solveStep, setCell, isSolved, verifyVisibility } from "../state"
import { popCount } from "../util"


function tryGuess(res, state, solverStep) {
    for(;;) {
        verifyVisibility(state)
        if (state.error) return false
        
        let step = solverStep(state)
        if (!step) return false

        if (Array.isArray(step)) {
            // console.log(`GUESS| *** ${step[0]?.label??"empty steps list"} ***`)
            res = res.concat(step)
        }
        else {
            // console.log(`GUESS| *** ${step.label} ***`)
            res.push(step)
        }

        if (isSolved(state)) return true
    }
}


export function guess(state, solverStep) {
    const {sz, c} = state

    // list options
    let options=[]
    for(let row=0; row<sz; row++) {
        for(let col=0; col<sz; col++) {
            const mask = c[col+row*sz]
            if (mask&knownMask) continue
            options.push({row,col,mask,pop:popCount(mask)})
        }
    }
    options.sort((a,b)=> a.pop-b.pop)

    // try something
    while (options.length) {
        const {row,col,mask} = options.shift()

        for(let val=0; val<sz; val++) {
            const valMask = candidateMask(val+1)
            if (!(valMask&mask)) continue

            const state2 = structuredClone(state)
            setCell(state2, row, col, val+1)

            const res=[]
            res.push(solveStep(state2, `<GUESSING ${val+1} at ${gridCoords(row,col)}>`))
            if (tryGuess(res,state2,solverStep)) return res
        }
    }

    const step = solveStep(state, 'tried to guess each cell and gave up')
    return [step]
}