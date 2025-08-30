import {isSolved,verifyVisibility,solveStep} from '../state'
import {pencilBasicVisibility}  from './s00-basic-visibility'
import {findSingleCandidate}    from './s01-obvious'
import {checkOnlyCandidates}    from './s02-last-one-standing'
import {findNakedPair}          from './s03-naked-pair'
import {findHiddenPair}         from './s04-hidden-pair'
import {findXWing}              from './s05-xwing'
import {pencilForVisibility}    from './s06-visibility'
import {guess}                  from './s99-guess'

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

    let guessed = false
    for(;;) {
        verifyVisibility(state)
        if (state.error) break
        
        let step = solverStep(state)
        if (!step) {
            guessed = true
            res.push( solveStep(state,"don't know how to solve further, will try with one guess"))
            step = guess(state,solverStep)
            if (!step) break;
        }

        if (Array.isArray(step)) {
            console.log(`*** ${step[0]?.label??"empty steps list"} ***`)
            res = res.concat(step)
        }
        else {
            console.log(`*** ${step.label} ***`)
            res.push(step)
        }

        const finalState = res[res.length-1].state
        if (isSolved(finalState)) {
            res.push( solveStep(finalState,guessed? "Guessed !" : "Solved !") )
            return res;
        }

        if (guessed) break;
    }

    if (!state.error) state.error = ["don't know how to solve further"]

    res.push( solveStep(state, "ERROR: "+state.error.join("; ")) )
    return res;
}