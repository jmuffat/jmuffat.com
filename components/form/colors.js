import React from 'react'
import {SketchPicker,CustomPicker} from 'react-color'
import {EditableInput,Hue,Saturation} from 'react-color/lib/components/common'


const Slider = props=>(
  <div className='slider-outer' style={{height:props.height}}>
    <div className='slider-inner'>
    {props.children}
    </div>
  </div>
)

class PickerBase extends React.Component {
  render() {
    const {color,onChange} = this.props

    const styles = {
      hue:{
        position: 'relative',
        //height: '4px',
        overflow: 'hidden'
      }
    }

    return (
      <div className="color-picker">
        <EditableInput {...this.props} label="hex" hideLabel value={color} onChange={a=>onChange({hex:a.hex})} />
        <Slider height="0.5em"> <Hue {...this.props} style={styles.hue}/> </Slider>
        <Slider height="8em"> <Saturation {...this.props} style={styles.saturation}/> </Slider>
      </div>
    )
  }
}

const Picker = CustomPicker(PickerBase)

export function ColorField(props) {
  const [editing,setEditing] = React.useState(false)
  const {form, field} = props

  const onClickSwatch = ()=>setEditing(true)

  const onClickModal = e=>{
    if (e.target.id==='modal-background') setEditing(false)
  }

  const color = form.data[field]
  const onChangeColor= color=>form.updateData({[field]: color.hex})

  return (
    <>
      <div className="colorswatch-outer">
        <span>
          <div className="colorswatch-inner" style={{background: color}} onClick={onClickSwatch}></div>
        </span>
      </div>

      <Picker color={color} onChange={onChangeColor} />
    </>
  )
}

function Swatch(props) {
  const onClickSwatch = a=>console.log(a)
  return (
    <div className="colorswatch-outer">
      <span>
        <div className="colorswatch-inner" style={{background: props.value}} onClick={onClickSwatch}></div>
      </span>
    </div>
  )
}

function getLabel(name,labels) {
  const label = labels && labels[name]
  return label || name
}

const ColorLine = props=>(
  <div className={props.sel?"form-colors-line-sel":"form-colors-line"} onClick={props.onClick}>
    <Swatch value={props.color} /> {props.label}
  </div>
)

export function FormColors(props) {
  const {form,field,colors} = props
  const col = Object.keys(props.colors)

  const [cur,setCur] = React.useState(col[0])

  const onPickerChange= a=>form.updateData({
    [field]: {
      ...colors,
      [cur]: a.hex
    }
  })

  return (
    <div className="form-colors">
      <div className="form-colors-list">
      {col.map(a=><ColorLine key={a} color={colors[a]} sel={a==cur} label={getLabel(a,props.labels)} onClick={()=>setCur(a)}/> )}
      </div>
      <div className="form-colors-editor">
        <Picker color={colors[cur]} onChange={onPickerChange}/>
      </div>
    </div>
  )
}
