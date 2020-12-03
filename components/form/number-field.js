import React from 'react'

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
      <label htmlFor={field}>{label}: </label>
      <input type="text" field={field} value={text} onChange={onChange} />
    </>
  )
}
