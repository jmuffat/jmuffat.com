import React from 'react'

export function TextField(props) {
  const {form, field, label, className} = props
  const filter = props.filter || (a=>a)

  const onChange = e=>{
    form.updateData({
      [field]: filter(e.currentTarget.value)
    })
  }

  return (
    <>
      {label && <label htmlFor={field}>{label}</label>}
      <input type="text" field={field} value={form.data[field]} placeholder={props.placeholder} className={className} onChange={onChange} />
    </>
  )
}
