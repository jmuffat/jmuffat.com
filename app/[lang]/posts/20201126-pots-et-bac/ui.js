export function SimulSVG(props) {
	const { width, height } = props
	const dim = Math.max(width, height)
	const canvasDim = 1.05 * dim
	const scale = 512 / canvasDim
	const x = (canvasDim - width) / 2
	const y = (canvasDim - height) / 2

	return (
		<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
			<g>
				<rect x="-1" y="-1" width="514" height="514" id="canvas_background" fill="#ccc" />
			</g>
			<g transform={`scale(${scale}) translate(${x},${y})`}>
				<rect width={width} height={height} x={0} y={0} fillOpacity="null" strokeOpacity="null" strokeWidth="0.01" stroke="#000" fill="#fff" />
				{props.circles.map((a, i) => (
					<ellipse key={i} rx={0.5} ry={0.5} cx={a.cx} cy={a.cy} fillOpacity="null" strokeOpacity="null" strokeWidth="0.01" stroke="#000" fill="#eee" />
				))}
			</g>
		</svg>
	)
}

export function MethodButton(props) {
	const { id, value, sel } = props
	const [state, setState] = props.stateMgr

	const onChangeMethod = e => setState({ ...state, method: id })

	return (
		<div>
			<input
				className="mx-1"
				type="radio"
				id={`method-${id}`}
				name="method"
				value={id}
				checked={state.method === id}
				onChange={onChangeMethod} />
			<label htmlFor={`method-${id}`}>
				{id === sel ?
					<strong>{props.children}</strong>
					: props.children
				}
			</label>
		</div>
	)
}
