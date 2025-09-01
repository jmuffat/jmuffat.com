import {pencilCell,candidateMask,solveStep, gridCoords} from '../state'
import { popCount } from '../util'

function getCandidates(mask) {
    // we know there are only two bits set
    const res = []
    
    for(let i=0; i<10; i++) {
        if (mask&(1<<i)) res.push(i)
    }

    return res
}

function pencilXWing(state, a, rowA,colA,rowB,colB) {
    const {sz} = state
    const mask = candidateMask(a)
    let change=0

    for(let row=0; row<sz; row++) {
        if (row==rowA || row==rowB) continue
        change += pencilCell(state, row,colA, ~mask)
        change += pencilCell(state, row,colB, ~mask)
    }

    for(let col=0; col<sz; col++) {
        if (col==colA || col==colB) continue
        change += pencilCell(state, rowA,col, ~mask)
        change += pencilCell(state, rowB,col, ~mask)
    }
    
    if (!change) return
    
    const   AA = gridCoords(rowA,colA),
            AB = gridCoords(rowA,colB),
            BA = gridCoords(rowB,colA),
            BB = gridCoords(rowB,colB)
    return solveStep(
        state, 
        `X-wing of ${a}'s, at ${AA}-${AB}-${BA}-${BB}`,
        [
            AA,AB,BA,BB,
            `${AA}.${a+1}`,
            `${AB}.${a+1}`,
            `${BA}.${a+1}`,
            `${BB}.${a+1}`,
        ]
    )
}

function findXWingByRow(state, a) {
    const {sz,c} = state
    const mask = candidateMask(a)
    const where = []

    // for each row, find which columns are possible
    for(let row=0; row<sz; row++) {
        where[row]=0
        for(let col=0; col<sz; col++) {
            const m = c[col+row*sz]
            if (m&mask) where[row]|=1<<col
        }
    }

    // check for two rows with same 2x candidate colums
    for(let rowA=0; rowA<sz-1; rowA++) {
        if (popCount(where[rowA])!=2) continue

        for(let rowB=rowA+1; rowB<sz; rowB++) {
            if (where[rowB]!=where[rowA]) continue

            const [colA,colB] = getCandidates(where[rowA])

            const change = pencilXWing(state, a, rowA,colA, rowB,colB)
            if (change) return change
        }
    }
}

function findXWingByCol(state, a) {
    const {sz,c} = state
    const mask = candidateMask(a)
    const where = []

    // for each column, find which rows are possible
    for(let col=0; col<sz; col++) {
        where[col]=0
        for(let row=0; row<sz; row++) {
            const m = c[col+row*sz]
            if (m&mask) where[col]|=1<<col
        }
    }

    // check for two columns with same 2x candidate rows
    for(let colA=0; colA<sz-1; colA++) {
        if (popCount(where[colA])!=2) continue

        for(let colB=colA+1; colB<sz; colB++) {
            if (where[colB]!=where[colA]) continue

            const [rowA,rowB] = getCandidates(where[colA])

            const change = pencilXWing(state, a, rowA,colA, rowB,colB)
            if (change) return change
        }
    }
}

export function findXWing(state) {
    const {sz} = state

    for(let a=0; a<=sz; a++) {
        const change = (
            findXWingByRow(state,a)
         ?? findXWingByCol(state,a)
        )
        
        if (change) return change 
    }
}