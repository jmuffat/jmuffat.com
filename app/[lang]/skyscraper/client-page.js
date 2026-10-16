"use client"
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import { NarrowPageBody } from '@/components/narrow-body'
import { SkyscraperGrid } from './grid'
import { skyscraperStringDecode } from './decodeSkyscraperString'
import { skyscraperSolve } from './solve'

function Step({index,sel,step,t0,onClick}) {
    const {label,state={error:"null step"},clock} = step

    const sClock = (clock-t0).toLocaleString('en-US', {minimumFractionDigits: 0, useGrouping:false})

    return (
        <div 
            className={cn(
                "flex flex-row gap-4 cursor-pointer px-2 text-xs",
                sel && "bg-accent",
                state.error && "font-bold text-red-700"
            )}
            onClick={onClick}
        >
            <div className="w-16 text-right">{index+1}</div>
            <div className="w-16 text-right">{sClock}ms</div>
            <div>{label}</div> 
        </div>
    )
}

export function SkyscraperClientPage() {
    const searchParams = useSearchParams()
    const gridStr = React.useMemo(
        () =>  searchParams.get('s') ?? "0030400.0056000.0600050.0000040",
        [searchParams]
    )
    const startGrid = React.useMemo(
        () => skyscraperStringDecode(gridStr), 
        [gridStr]
    )

    const [steps, setSteps] = React.useState([])
    React.useEffect( 
        // useEffect to avoid running the solver on the server side, so we get a consistent clock time for the first step
        ()=>{
            // decode the grid again (solving mutates it)
            const grid = skyscraperStringDecode(gridStr)
            const steps = skyscraperSolve(grid)
            setSteps(steps)
        }, 
        [gridStr] 
    )

    const [current,setCurrent] = React.useState(steps.length-1) 
    const prev = Math.max(current-1,0)
    const next = Math.min(current+1, steps.length-1)
    const t0 = steps[0]?.clock
    const highlights = new Set( steps[current]?.highlights )

    
    return (
        <NarrowPageBody>
            <div className='markdown'>
                <h1>Skyscraper solver <span className="text-sm">(wip)</span></h1>
            </div>
            
            <SkyscraperGrid 
                data={steps[current]?.state ?? startGrid} 
                prev={steps[prev]?.state}
                highlights={highlights}
            />
            
            <div className='flex flex-row justify-center text-muted-foreground mb-2'>
                <div>{steps[current]?.label}</div>
            </div>

            <div className="flex flex-row gap-4 mb-4 justify-center">
                <Button variant="outline" className="w-24" onClick={()=>setCurrent(0)}>First</Button>
                <Button variant="outline" className="w-24" onClick={()=>setCurrent(prev)}>Prev</Button>
                <Button variant="outline" className="w-24" onClick={()=>setCurrent(next)}>Next</Button>
                <Button variant="outline" className="w-24" onClick={()=>setCurrent(steps.length-1)}>Last</Button>
            </div>

            <div className="flex flex-col gap-2 border py-4 px-2">
            {steps.map((step,i)=>(
                <Step key={i} 
                    index={i} 
                    sel={i==current} 
                    step={step} 
                    t0={t0} 
                    onClick={()=>setCurrent(i)}
                />
            ))}
            </div>
        </NarrowPageBody>
    )
}

