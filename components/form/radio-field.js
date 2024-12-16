import React from 'react'
import { cn } from '@/lib/utils'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function RadioField({ form, field, options, horizontal }) {
	const formValue = form.data[field]

	return (
		<RadioGroup 
			className={cn({
				'grid-flow-col': !!horizontal
			})}
			onValueChange={a=>form.updateData( {[field]: a} )}
		>
			{options.map(a => (
				<div key={a.value} className="flex items-center space-x-2">
					<RadioGroupItem 
						id={a.value}
						value={a.value}
						checked={a.value == formValue}
					/>
					<Label htmlFor={a.value}>{a.label}</Label>
				</div>
			))}
		</RadioGroup>
	)
}