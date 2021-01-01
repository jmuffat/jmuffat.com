import React from 'react'

export function CheckboxField(props) {
  const {form, field} = props
  const label = props.label || field

  return (
    <div>
      <input
        id={props.id}
        type="checkbox"
        disabled={props.disabled}
        checked={form.data[field]}
        onChange={()=>form.updateData({[field]:!form.data[field]})}
      />
      <label htmlFor={props.id} disabled={props.disabled}>{label}</label>
    </div>
  )
}
