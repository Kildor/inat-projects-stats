import React, { ChangeEvent, FunctionComponent } from 'react'
import DataList from './DataList'

export interface FormControlProps {
	label : string
	type: string
	name: string
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	value: string
	list?: Array<Object>
}
const FormControl: FunctionComponent<FormControlProps> = ({ label, type, name, onChange, value, list, children }) => {
	const dlId = (!!list && list.length > 0) ? `form-control-dl-${name}-${new Date().getMilliseconds()}` : undefined;

	return (
		<label>
			<span>{label}</span> <span className='form-control'>
				<input type={type} name={name} onChange={onChange} value={value} list={dlId} />
				{children}
				{(!!dlId && !!list) && <DataList list={list} id={dlId} />}
			</span>
		</label>
	)

}

export default FormControl;