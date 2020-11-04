import React, { ChangeEvent, ReactElement } from 'react'

export interface FormControlCheckboxProps {
	label: string
	name: string
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	checked: boolean
	children?: React.ReactChildren
}
export default ({ label, name, onChange, checked, children }: FormControlCheckboxProps) : ReactElement => {
	return (
		<label>
			<span>{label}</span> <span className='form-control'>
				<input type='checkbox' name={name} onChange={onChange} value='1' checked={checked} />
				{children}
			</span>
		</label>
	)
}