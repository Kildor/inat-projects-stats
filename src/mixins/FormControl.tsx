import React, { FunctionComponent, ReactElement } from 'react'
import { FormControlProps, FormControlCheckboxProps, BooleanControlProps, NumberControlProps, FormControlRadioProps, FormControlSelectProps } from '../interfaces/FormControlTypes'
import DataList from './DataList'

export const FormControl: FunctionComponent<FormControlProps> = ({ label, type, name, comment, className, onChange, value, list, clearDatalistHandler, listName, children, ...attr }): JSX.Element => {
	const datalistId = (!!list && list.length > 0) ? `form-control-dl-${name}-${new Date().getMilliseconds()}` : undefined;

	return (
		<label className={className}>
			<span>{label}</span> <span className='form-control'>
				<input type={type} name={name} onChange={onChange} value={value} list={datalistId} {...attr} />
				{children}
				{(!!datalistId && !!list) &&
					<DataList list={list} id={datalistId} clearDatalistHandler={clearDatalistHandler} listName={listName} />}
			</span>
			{!!comment && <small className="comment">{comment}</small>}
		</label>
	)

}

export const FormControlCheckbox: FunctionComponent<FormControlCheckboxProps> = ({ label, name, comment, onChange, checked, children }: FormControlCheckboxProps): ReactElement => {
	return (
		<label>
			<span>{label}</span> <span className='form-control'>
				<input type='checkbox' name={name} onChange={onChange} value='1' checked={checked} />
				{children}
			</span>
			{!!comment && <small className="comment">{comment}</small>}
		</label>
	)
}
export const FormControlRadio: FunctionComponent<FormControlRadioProps> = (props: FormControlRadioProps) => {
	return (
		<div className='label'>
			{props.label}
			<div className="radios">
			{[...props.values].map(entry => <label key={entry[0]}><input name={props.name} type='radio' value={entry[0]} checked={props.value===entry[0]} onChange={props.onChange} />{entry[1]}</label>)}
			</div>
		</div>
	)

}
export const FormControlSelect: FunctionComponent<FormControlSelectProps> = (props: FormControlSelectProps) => {
	return (
		<label>
			<span>{props.label}</span>
			<span className="form-control">
				<select name={props.name} onChange={props.onChange} value={props.value}>
					{[...props.values].map(entry => <option key={entry[0]} value={entry[0]}>{entry[1]}</option>)}
				</select>
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
