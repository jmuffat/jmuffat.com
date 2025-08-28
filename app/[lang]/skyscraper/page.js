"use client"
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

import { NarrowPageBody } from '@/components/narrow-body'
import { SkyscraperGrid } from './grid'
import { skyscraperStringDecode } from './decode'
import { skyscraperSolve } from './solve'

function Step({index,sel,step,onClick}) {
    return (
        <div 
            className={cn(
                "cursor-pointer px-2 text-xs",
                sel && "text-accent-foreground bg-accent"
            )}
            onClick={onClick}
        >
            {index+1} - {step?.label ?? "?null step?"}
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

    return (
        <NarrowPageBody>
            <div className='markdown'>
                <h1>Skyscraper solver <span className="text-sm">(wip)</span></h1>
            </div>
            
            <SkyscraperGrid data={steps[current].state} prev={steps[prev].state}/>
            
            <div className="flex flex-col gap-2 border py-4 px-2">
            {steps.map((step,i)=><Step key={i} index={i} sel={i==current} step={step} onClick={()=>setCurrent(i)}/>)}
            </div>
        </NarrowPageBody>
    )
}

export default SkyscraperPage