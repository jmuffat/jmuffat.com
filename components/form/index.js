export * from './hooks'
export * from './text-field'
export * from './number-field'
export * from './checkbox-field'
export * from './radio-field'
export * from './colors'

export function FormLine(props){
  const {label} = props

  return (
    <div className="flex flex-row min-h-8 w-full mb-2">
      <div className="flex grow-1">{label}</div>
      <div className="flex fex-row px-2 gap-2 grow-[4]">
        {props.children}
      </div>
    </div>
  )
}
