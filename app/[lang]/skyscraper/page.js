"use client"
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import { NarrowPageBody } from '@/components/narrow-body'
import { SkyscraperGrid } from './grid'
import { skyscraperStringDecode } from './decode'
import { skyscraperSolve } from './solve'

function Step({index,sel,step,onClick}) {
    const {label,state={error:"null step"}} = step
    return (
        <div 
            className={cn(
                "cursor-pointer px-2 text-xs",
                sel && "bg-accent",
                state.error && "font-bold text-red-700"
            )}
            onClick={onClick}
        >
            {index+1} - {label} 
        </div>
    )
}

function SkyscraperPage() {
    const searchParams = useSearchParams()
    const str = searchParams.get('s') ?? "0030400.0056000.0600050.0000040"
    
    const steps = React.useMemo(
        ()=>{
            const data  = skyscraperStringDecode(str)
            const steps = skyscraperSolve(data)
            return steps
        }, 
        [str] 
    )

    const [current,setCurrent] = React.useState(0) 
    const prev = Math.max(current-1,0)
    const next = Math.min(current+1, steps.length-1)

    return (
        <NarrowPageBody>
            <div className='markdown'>
                <h1>Skyscraper solver <span className="text-sm">(wip)</span></h1>
            </div>
            
            <SkyscraperGrid data={steps[current].state} prev={steps[prev].state}/>
            
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
            {steps.map((step,i)=><Step key={i} index={i} sel={i==current} step={step} onClick={()=>setCurrent(i)}/>)}
            </div>
        </NarrowPageBody>
    )
}

export default SkyscraperPage