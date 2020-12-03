import React from 'react'

export function TextField(props) {
  const {form, field, filter} = props
  const label = props.label || field

  const onChange = (
    filter?
      e=>{
        form.updateData({
          [e.currentTarget.field]: filter(e.currentTarget.value)
        })
      }
    : form.onChange
  )

  return (
    <>
      <label htmlFor={field}>{label}</label>
      <input type="text" field={field} value={form.data[field]} onChange={onChange} />
    </>
  )
}
