import React from 'react'

export function TextField(props) {
  const {form, field, label, filter, className} = props

  const onChange = (
    filter?
      e=>{
        form.updateData({
          [field]: filter(e.currentTarget.value)
        })
      }
    : form.onChange
  )

  return (
    <>
      {label && <label htmlFor={field}>{label}</label>}
      <input type="text" field={field} value={form.data[field]} className={className} onChange={onChange} />
    </>
  )
}
