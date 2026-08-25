"use client"
// curl -w "%{url_effective}\n" -I -L -s -S $URL -o /dev/null

import React from "react"
import { XIcon } from "lucide-react"

import { NarrowPageBody } from "@/components/narrow-body"

import {unobfuscate} from "./unobsfuscate"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"

function ActualLink({href}) {
    if (!href) return
    return <a className="link text-sm" href={href} target="_blank">{href}</a>
}

function PreJson({data}) {
    if (!data) return 
    if (Object.keys(data).length<1) return

    return (
        <pre className="text-xs overflow-hidden text-muted-foreground">
            {JSON.stringify(data, null, 2)}
        </pre>
    )
}

function ClinkPage() {
    const [val,setVal] = React.useState("")
    const [decoded,setDecoded] = React.useState({})

    function onChange(e) {
        const s = e.currentTarget.value
        setDecoded({})
        setVal(s)
        if (!s) return

        unobfuscate(s)
        .then( newValue=>setDecoded(newValue) )
        .catch( e=>setDecoded({Error:e}))
    }

    function onClear() {
        setDecoded({})
        setVal("")
    }

    return (
        <NarrowPageBody>

            <div className="flex flex-col gap-4 mb-4">
                 <InputGroup>
                    <InputGroupInput type="text" placeholder="url" value={val} onChange={onChange}/>
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton
                            aria-label="Clear"
                            title="Clear"
                            size="icon-xs"
                            onClick={onClear}
                        >
                            <XIcon/>
                        </InputGroupButton>
                    </InputGroupAddon>
                 </InputGroup>
                <ActualLink href={decoded.actualLink}/>
            </div>
            
            <div>
                <PreJson data={decoded}/>
            </div>
        </NarrowPageBody>
    )
}

export default ClinkPage