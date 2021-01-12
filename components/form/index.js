export * from './hooks'
export * from './text-field'
export * from './number-field'
export * from './checkbox-field'
export * from './radio-field'
export * from './colors'

export function FormLine(props){
  const {label} = props

  return (
    <div className="form-line">
      <div className="form-line-label">{label}</div>
      <div className="form-line-content">
        {props.children}
      </div>
    </div>
  )
}
