import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
 
export function TextField(props) {
  const {form, field, label, className} = props
  const filter = props.filter || (a=>a)

  const onChange = e=>{
    form.updateData({
      [field]: filter(e.currentTarget.value)
    })
  }

  const style = {
    width: props.width
  }

  return (
    <>
      {label && <Label htmlFor={field}>{label}</Label>}
      <Input
        type="text"
        field={field}
        value={form.data[field]}
        placeholder={props.placeholder}
        className={className}
        style={style}
        onChange={onChange} />
    </>
  )
}
