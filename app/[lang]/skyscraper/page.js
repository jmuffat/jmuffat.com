"use client"
import React from 'react'
import { useSearchParams } from 'next/navigation'

import { NarrowPageBody } from '@/components/narrow-body'
import { SkyscraperGrid } from './grid'
import { skyscraperStringDecode } from './decode'
import { skyscraperSolve } from './solve'

function Step({index,step,onClick}) {
    return (
        <div 
            className="cursor-pointer px-2 text-xs hover:text-accent-foreground hover:bg-accent" 
            onClick={onClick}
        >
            {index+1} - {step.label}
        </div>
    )
}

function SkyscraperPage() {
    const searchParams = useSearchParams()
    const str = searchParams.get('s') // "03004.02020.32200.00224.D32" 
    
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
                <h1>Skyscraper solver</h1>
            </div>
            
            <SkyscraperGrid data={steps[current].state} prev={steps[prev].state}/>
            
            <div className="flex flex-col gap-2 border py-4 px-2">
            {steps.map((step,i)=><Step index={i} step={step} onClick={()=>setCurrent(i)}/>)}
            </div>
        </NarrowPageBody>
    )
}

export default SkyscraperPage