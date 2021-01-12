import React from 'react'

export function RadioField(props) {
  const {form,field,options} = props

  const onChange = a=>form.updateData({[field]: a.value})
  const formValue = form.data[field]

  return (
    <>
    {options.map(a=>(
      <span key={a.value} className="form-radio">
        <input
          type="radio"
          id={`${field}.${a.value}`}
          name={field}
          value={a.value}
          checked={a.value==formValue}
          onChange={()=>onChange(a)}/> <label htmlFor={`${field}.${a.value}`}>{a.label}</label>
      </span>
    ))}
    </>
  )
}
