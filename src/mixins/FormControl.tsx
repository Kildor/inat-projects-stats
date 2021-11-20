import React, { ChangeEvent, FunctionComponent, ReactElement, useEffect, useState } from 'react'
import I18n from '../classes/I18n';
import { FormControlProps, FormControlCheckboxProps, BooleanControlProps, NumberControlProps, FormControlRadioProps, FormControlSelectProps, FormControlTaxonProps } from '../interfaces/FormControlTypes'
import LookupTaxon from '../interfaces/LookupTaxon';
import { setTaxon } from './API';
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
	
export const FormControlCheckbox: FunctionComponent<FormControlCheckboxProps> = ({ label, name, className, comment, onChange, checked, children }: FormControlCheckboxProps): ReactElement => {
	return (
		<label className={className}>
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
					{[...props.values].map(entry => <option key={entry[0]} value={entry[0]}>{I18n.t(entry[1])}</option>)}
				</select>
			</span>
		</label>
	)
}
	
export const FormControlTaxon: FunctionComponent<FormControlTaxonProps> = (props: FormControlTaxonProps) => {
	const {updateState, value, ...attr} = props;
	const [taxonName, setTaxonName] = useState(value.name);
	useEffect(() => {
		setTaxonName(props.value.name)
	}, [props.value])
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setTaxonName(e.target.value);
		const newTaxon : LookupTaxon = {id: 0, name: e.target.value};
		updateState({taxon: newTaxon});
	}
	let children = null;
	if (value.id !== 0 && value.name !== "" + value.id) {
		if (value.lookupSuccess) {
			children = <a href={`https://www.inaturalist.org/taxa/${value.id}`} target='_blank' rel='noopener noreferrer'><span role='img' aria-label={I18n.t("Успешно")}>✅{!!value.commonName && <span className='common-name'>{value.commonName}</span>}</span></a>
		} else {
			children = <span role='img' aria-label={I18n.t("Неуспешно")}>⚠️</span>
		}
	}
	return (
	// list={props.list} clearDatalistHandler={props.clearDatalistHandler} listName={props.listName}
		<FormControl type='text' {...attr} onChange={onChange} onBlur={()=>{setTaxon(props.value, updateState)}} value={taxonName}>
			{children}
		</FormControl>
	
	);
}

export const FormControlCSV: FunctionComponent<BooleanControlProps> = ({ handler, value }: BooleanControlProps) => {
	return (
		<FormControlCheckbox label={I18n.t('Выводить в CSV')} name='csv' onChange={handler} checked={value}></FormControlCheckbox>
	);
}
	
export const FormControlLimit: FunctionComponent<NumberControlProps> =  ({ handler, value }: NumberControlProps) => {
	return (
		<FormControl label={I18n.t('Лимит')} type='number' name='limit' onChange={handler}
			value={value} min="0" step="1" />
	);
}
/*
export const FormControlPlace: FunctionComponent<FormControlPlaceProps> = (props: FormControlPlaceProps) => {
	const {updateState, value, ...attr} = props;
	console.dir(props);
	const [placeName, setPlaceName] = useState(value.name);
	const [placeId, setPlaceId] = useState(value.id);

	useEffect(() => {
		setPlaceName(value.name)
		setPlaceId(value.id)
	}, [value])
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPlaceName(e.target.value);
		const newPlace : LookupPlace = {id: 0, name: e.target.value};
		updateState({place: newPlace});
	}
	let children = null;
	if (value.id !== 0 && value.name !== "" + value.id) {
		if (value.lookupSuccess) {
			children = <a href={`https://www.inaturalist.org/taxa/${value.id}`} target='_blank' rel='noopener noreferrer'><span role='img' aria-label={I18n.t("Успешно")}>✅{!!value.displayName && <span className='common-name'>{value.displayName}</span>}</span></a>
		} else {
			children = <span role='img' aria-label={I18n.t("Неуспешно")}>⚠️</span>
		}
	}
	return (
	// list={props.list} clearDatalistHandler={props.clearDatalistHandler} listName={props.listName}
		<FormControl type='text' {...attr} onChange={onChange} onBlur={()=>{setTaxon(props.value, updateState)}} value={placeName}>
			{children}
		</FormControl>
	
	);
}
*/
