import {pencilBasicVisibility} from './basic-visibility'

export function skyscraperSolve(state) {
    let res = []

    res.push({
        label: "Initial hints",
        state: structuredClone(state)
    })
    
    res = res.concat( pencilBasicVisibility(state) )

    res.push({
        label: "Final state",
        state: structuredClone(state)
    })
    return res;
}