export * from './hooks'
export * from './text-field'
export * from './number-field'
export * from './checkbox-field'
export * from './radio-field'
export * from './colors'

export function FormLine(props){
  const {label} = props

  return (
    <div className="flex flex-row min-h-8 w-full mb-2 items-center">
      <div className="flex flex-none w-28">{label}</div>
      <div className="flex grow flex-row px-2 gap-4 items-center">
        {props.children}
      </div>
    </div>
  )
}
