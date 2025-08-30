import {isSolved,verifyVisibility,solveStep} from '../state'
import {pencilBasicVisibility}  from './s00-basic-visibility'
import {findSingleCandidate}    from './s01-obvious'
import {checkOnlyCandidates}    from './s02-last-one-standing'
import {findNakedPair}          from './s03-naked-pair'
import {findHiddenPair}         from './s04-hidden-pair'
import {findXWing}              from './s05-xwing'
import {pencilForVisibility}    from './s06-visibility'

const solverStep = state => (
    findSingleCandidate(state)
 ?? checkOnlyCandidates(state)
 ?? findNakedPair(state)
 ?? findHiddenPair(state)
 ?? findXWing(state)
 ?? pencilForVisibility(state)
) 

export function skyscraperSolve(state) {
    let res = []

    res.push( solveStep(state,"Initial hints") )
    
    res = res.concat( pencilBasicVisibility(state) )

    for(;;) {
        verifyVisibility(state)
        if (state.error) break;
        
        const step = solverStep(state)
        if (!step) break;

        console.log(`*** ${step.label} ***`)
        if (Array.isArray(step)) {
            res = res.concat(step)
        }
        else {
            res.push(step)
        }
    }

    if (state.error) {
        res.push( solveStep(state, "ERROR: "+state.error.join("; ")) )
    }
    else if (isSolved(state)) {
        res.push( solveStep(state,"Solved !") )
    }
    else {
        res.push( solveStep(state,"Don't know how to solve further") )
    }

    return res;
}