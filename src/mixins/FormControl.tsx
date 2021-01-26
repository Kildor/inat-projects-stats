import React, { FunctionComponent, ReactElement } from 'react'
import { FormControlProps, FormControlCheckboxProps, BooleanControlProps, NumberControlProps } from '../interfaces/FormControlTypes'
import DataList from './DataList'

export const FormControl: FunctionComponent<FormControlProps> = ({ label, type, name, onChange, value, list, children, ...attr }) => {
	const dlId = (!!list && list.length > 0) ? `form-control-dl-${name}-${new Date().getMilliseconds()}` : undefined;

	return (
		<label>
			<span>{label}</span> <span className='form-control'>
				<input type={type} name={name} onChange={onChange} value={value} list={dlId} {...attr} />
				{children}
				{(!!dlId && !!list) && <DataList list={list} id={dlId} />}
			</span>
		</label>
	)

}

export const FormControlCheckbox: FunctionComponent<FormControlCheckboxProps> = ({ label, name, onChange, checked, children }: FormControlCheckboxProps): ReactElement => {
	return (
		<label>
			<span>{label}</span> <span className='form-control'>
				<input type='checkbox' name={name} onChange={onChange} value='1' checked={checked} />
				{children}
			</span>
		</label>
	)
}

export const FormControlCSV: FunctionComponent<BooleanControlProps> = ({ handler, value }: BooleanControlProps) => {
	return (
		<FormControlCheckbox label='Выводить в CSV' name='csv' onChange={handler} checked={value}></FormControlCheckbox>
	);
}

export const FormControlLimit: FunctionComponent<NumberControlProps> =  ({ handler, value }: NumberControlProps) => {
	return (
		<FormControl label='Лимит:' type='number' name='limit' onChange={handler}
			value={value} min="0" step="1" />

	)
}