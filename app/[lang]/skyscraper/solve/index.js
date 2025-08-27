import {pencilBasicVisibility}  from './s00-basic-visibility'
import {checkOnlyCandidates}    from './s01-last-one-standing'

const solverStep = state => (
    checkOnlyCandidates(state)
) 

export function skyscraperSolve(state) {
    let res = []

    res.push({
        label: "Initial hints",
        state: structuredClone(state)
    })
    
    res = res.concat( pencilBasicVisibility(state) )

    for(;;) {
        const step = solverStep(state)
        if (!step) break;

        if (Array.isArray(step)) {
            res = res.concat(step)
        }
        else {
            res.push(step)
        }
    }

    res.push({
        label: "Final state",
        state: structuredClone(state)
    })
    return res;
}