"use client"

import React from "react"
import { XIcon, Loader2Icon } from "lucide-react"

import { NarrowPageBody } from "@/components/narrow-body"

import {unobfuscate} from "./unobfuscate"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"

function ActualLink({href}) {
    if (!href) return
    return <a className="link text-sm" href={href} target="_blank" rel="noopener noreferrer">{href}</a>
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
    const [val, setVal] = React.useState("")
    const [decoded, setDecoded] = React.useState({})
    const [loading, setLoading] = React.useState(false)

    const onChange = React.useCallback(e => {
        const s = e.currentTarget.value
        setDecoded({})
        setVal(s)
        if (!s) return

        setLoading(true)
        unobfuscate(s)
            .then(newValue => setDecoded(newValue))
            .catch(e => setDecoded({ Error: e }))
            .finally(() => setLoading(false))
    })

    const onClear = React.useCallback(() => {
        setDecoded({})
        setVal("")
    })

    return (
        <NarrowPageBody>

            <div className="flex flex-col gap-4 mb-4">
                <InputGroup>
                    <InputGroupInput
                        type="text"
                        placeholder="paste url here"
                        value={val}
                        onChange={onChange}
                        disabled={loading}
                    />
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton
                            aria-label="Clear"
                            title="Clear"
                            size="icon-xs"
                            onClick={onClear}
                        >
                            <XIcon />
                        </InputGroupButton>
                    </InputGroupAddon>
                    {loading && (
                        <div className="ml-2 flex items-center">
                            <Loader2Icon className="animate-spin text-muted-foreground" size={16} />
                        </div>
                    )}
                </InputGroup>
                <ActualLink href={decoded.actualLink} />
                    {decoded?.Error && (
                        <div className="text-sm text-red-500 mt-2">
                            Error: {String(decoded.Error)}
                        </div>
                    )}
                </div>

            <div>
                <PreJson data={decoded} />
            </div>
        </NarrowPageBody>
    )
}

export default ClinkPage