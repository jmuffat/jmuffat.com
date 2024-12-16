import React from 'react'
import { cn } from '@/lib/utils'
import { SketchPicker, CustomPicker } from 'react-color'
import { EditableInput, Hue, Saturation } from 'react-color/lib/components/common'


const Slider = ({className,children}) => (
	<div className={cn('relative p-2 w-[90%]',className)}>
		{children}
	</div>
)

class PickerBase extends React.Component {
	render() {
		const { color, onChange } = this.props

		return (
			<div className="flex flex-col">
				<EditableInput {...this.props} label="hex" hideLabel value={color} onChange={a => onChange({ hex: a.hex })} />
				<Slider> <Hue {...this.props} /> </Slider>
				<Slider className="h-60"> <Saturation {...this.props} /> </Slider>
			</div>
		)
	}
}

const Picker = CustomPicker(PickerBase)

export function ColorField(props) {
	const [editing, setEditing] = React.useState(false)
	const { form, field } = props

	const onClickSwatch = () => setEditing(true)

	const onClickModal = e => {
		if (e.target.id === 'modal-background') setEditing(false)
	}

	const color = form.data[field]
	const onChangeColor = color => form.updateData({ [field]: color.hex })

	return (
		<>
			<div className="w-4 h-4 mx-auto mt-0 mb-1">
				<span>
					<div className="size-full relative rounded shadow" style={{ background: color }} onClick={onClickSwatch}></div>
				</span>
			</div>

			<Picker color={color} onChange={onChangeColor} />
		</>
	)
}

function Swatch(props) {
	const onClickSwatch = a => console.log(a)
	return (
		<div className="grow-0 size-4 m-2">
			<span>
				<div className="size-full relative border rounded shadow" style={{ background: props.value }} onClick={onClickSwatch}></div>
			</span>
		</div>
	)
}

function getLabel(name, labels) {
	const label = labels && labels[name]
	return label || name
}

const ColorLine = ({ sel, onClick, color, label }) => (
	<div
		className={cn({
			"p-1 cursor pointer flex flex-row gap-2 justify-start": true,
			"bg-secondary rounded": sel,
		})}
		onClick={onClick}
	>
		<Swatch value={color} />
		<div className='grow-1'>{label}</div>
	</div>
)

export function FormColors(props) {
	const { form, field, colors } = props
	const col = Object.keys(props.colors)

	const [cur, setCur] = React.useState(col[0])

	const onPickerChange = a => form.updateData({
		[field]: {
			...colors,
			[cur]: a.hex
		}
	})

	return (
		<div className="flex border rounded mt-4 p-4">
			<div className="flex-1">
				{col.map(a => <ColorLine key={a} color={colors[a]} sel={a == cur} label={getLabel(a, props.labels)} onClick={() => setCur(a)} />)}
			</div>
			<div className="flex-auto p-2">
				<Picker color={colors[cur]} onChange={onPickerChange} />
			</div>
		</div>
	)
}
