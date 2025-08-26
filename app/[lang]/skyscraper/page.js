"use client"
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import { NarrowPageBody } from '@/components/narrow-body'
import { skyscraperStringDecode } from './decode'
import { SkyscraperGrid } from './grid'

function SkyscraperPage() {
    const searchParams = useSearchParams()
    const str = searchParams.get('s')
    // const parm = "03004.02020.32200.00224.D32" // N.S.E.W.knownValues
    const data = useMemo(
        ()=>skyscraperStringDecode(str), 
        [str] 
    )

    return (
        <NarrowPageBody>
            <div className='markdown'>
                <h1>Skyscraper solver</h1>
            </div>
            
            <SkyscraperGrid data={data}/>
        </NarrowPageBody>
    )
}

export default SkyscraperPage