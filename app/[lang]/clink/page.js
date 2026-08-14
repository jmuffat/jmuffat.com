"use client"
// curl -w "%{url_effective}\n" -I -L -s -S $URL -o /dev/null

import React from "react"
import { ClipboardPasteIcon } from "lucide-react"

import { NarrowPageBody } from "@/components/narrow-body"
import { Button } from "@/components/ui/button"

import {unobfuscate} from "./unobsfuscate"

function ActualLink({href}) {
    if (!href) return
    return <a className="link text-sm" href={href}>{href}</a>
}

function ClinkPage() {
    const [decoded,setDecoded] = React.useState({})

    async function onClick() {
        setDecoded({})
        const url = await navigator.clipboard.readText()
        const newValue = await unobfuscate(url)
        setDecoded(newValue)
    }

    return (
        <NarrowPageBody>

            <div className="flex flex-row gap-4 items-center mb-4">
                <Button variant="outline" onClick={onClick}><ClipboardPasteIcon/> Paste url</Button>
                <ActualLink href={decoded.actualLink}/>
            </div>
            
            <div>
                <pre className="text-xs overflow-hidden">
                    {JSON.stringify(decoded, null, 2)}
                </pre>
            </div>
        </NarrowPageBody>
    )
}

export default ClinkPage