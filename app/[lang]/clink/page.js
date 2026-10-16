"use client"

import React from "react"
import { XIcon, Loader2Icon, ChevronsUpDownIcon } from "lucide-react"

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { NarrowPageBody } from "@/components/narrow-body"
import { unobfuscate } from "./unobfuscate"

function ActualLink({ href }) {
    if (!href) return null
    const url = React.useMemo(() => new URL(href), [href])
    const [exclude, setExclude] = React.useState([])
    const finalUrl = React.useMemo(
        () =>{
            const res = new URL(url)
            for(const key of exclude) res.searchParams.delete(key)
            return res.href
        },
        [url,exclude]
    )

    return (
        <div>
            <a className="link text-sm" href={finalUrl} target="_blank" rel="noopener noreferrer">{finalUrl}</a>
            <FieldGroup className="mt-2 ml-4 gap-2">
                {url.searchParams && Array.from(url.searchParams.entries()).map(([key, value]) => (
                    <Field key={key} orientation="horizontal" >
                        <Checkbox 
                            id={key} name={key} 
                            checked={!exclude.includes(key)} 
                            onCheckedChange={checked => {
                                if (checked) setExclude(exclude.filter( k => k!==key ))
                                else         setExclude([...exclude, key])
                            }}
                        />
                        <FieldLabel htmlFor={key} className="font-normal text-sm">
                            <em>{key}</em>: {value}
                        </FieldLabel>
                    </Field>
                ))}
            </FieldGroup>
        </div>
    )
}

function PreJson({ data }) {
    if (!data) return
    if (Object.keys(data).length < 1) return

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

            {Object.keys(decoded).length > 0 && (
                <Collapsible>
                    <CollapsibleTrigger><Button variant="outline"><ChevronsUpDownIcon/> debug information</Button></CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                        <PreJson data={decoded} />
                    </CollapsibleContent>
                </Collapsible>
            )}
        </NarrowPageBody>
    )
}

export default ClinkPage