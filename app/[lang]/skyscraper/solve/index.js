import {isSolved}               from '../state'
import {pencilBasicVisibility}  from './s00-basic-visibility'
import {findSingleCandidate}    from './s01-obvious'
import {checkOnlyCandidates}    from './s02-last-one-standing'
import {findPair}               from './s03-pairs'
import {pencilForVisibility}    from './s04-visibility'

const solverStep = state => (
    findSingleCandidate(state)
 ?? checkOnlyCandidates(state)
 ?? findPair(state)
 ?? pencilForVisibility(state)
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

        console.log(step)
        if (Array.isArray(step)) {
            res = res.concat(step)
        }
        else {
            res.push(step)
        }
    }

    if (isSolved(state)) {
        res.push({
            label: "Solved !",
            state: structuredClone(state)
        })
    }
    else {
        res.push({
            label: "Don't know how to solve further",
            state: structuredClone(state)
        })
    }
    return res;
}