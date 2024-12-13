import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function FloatField(props) {
  const {form, field} = props
  const label = props.label || field

  const [text,setText] = React.useState(form.data[field].toString())

  const onChange = e=>{
    const s = e.currentTarget.value
    if (!/^-?\d*\.?\d*$/.test(s)) return

    setText(s)

    form.updateData({
      [field]: parseFloat(s)
    })
  }

  return (
    <>
      {label && <label htmlFor={field}>{label}</label>}
      <input type="text" field={field} value={text} onChange={onChange} />
    </>
  )
}

export function IntField(props) {
  const {form, field} = props
  const label = props.label || field

  const [text,setText] = React.useState(form.data[field].toString())

  const onChange = e=>{
    const s = e.currentTarget.value
    if (!/^-?\d*$/.test(s)) return

    setText(s)

    form.updateData({
      [field]: parseFloat(s)
    })
  }

  return (
    <>
      {label && <Label htmlFor={field}>{label}</Label>}
      <Input type="text" field={field} value={text} onChange={onChange} />
    </>
  )
}
