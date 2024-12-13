import React from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function CheckboxField(props) {
  const {form, field} = props
  const label = props.label || field

  return (
    <div className="form-checkbox">
      <Checkbox
        id={props.id}
        disabled={props.disabled}
        checked={form.data[field]}
        onChange={()=>form.updateData({[field]:!form.data[field]})}
      />
      <Label htmlFor={props.id} disabled={props.disabled}>{label}</Label>
    </div>
  )
}
