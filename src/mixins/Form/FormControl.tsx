import { Field, FieldRenderProps, useField } from 'react-final-form';
import I18n from 'classes/I18n';
import { StatusMessageContext } from 'contexts/status-message-context';
import { BooleanControlProps, FormControlCheckboxFieldProps, FormControlCheckboxProps, FormControlFieldProps, FormControlProps, FormControlRadioProps, FormControlSelectFieldProps, FormControlSelectProps, FormControlTaxonFieldProps, FormControlTaxonProps, iDataListItem, iLookupTaxon, MultilineControlFieldProps, MultilineControlProps, NumberControlProps } from 'interfaces';
import { lookupTaxon, setTaxon } from 'mixins/API';
import cn from 'classnames';
import DataList from 'mixins/DataList';
import React, { ChangeEvent, FunctionComponent, memo, ReactElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export const FormControl: FunctionComponent<FormControlProps> = ({ label, type, name, comment, className, onChange, value, list, clearDatalistHandler, listName, children, ...attr }): JSX.Element => {
	const datalistId = (!!list && list.length > 0) ? `form-control-dl-${name}-${new Date().getMilliseconds()}` : undefined;

	return (
		<label className={className}>
			<span>{label}</span> <span className='form-control'>
				<input type={type} name={name} onChange={onChange} value={value} list={datalistId} {...attr} />
				{children}
				{!!datalistId && <DataList list={list} id={datalistId} clearDatalistHandler={clearDatalistHandler} listName={listName} />}
			</span>
			{!!comment && <small className="comment">{comment}</small>}
		</label>
	)
};
export const FormControlField: FunctionComponent<FormControlFieldProps> = memo(({ label, type, name, comment, className, changeHandler, value, list, clearDatalistHandler, listName, datalistId, children, field, ...attr }): JSX.Element => {
	datalistId = datalistId ?? (!!list && list.length > 0) ? `form-control-dl-${name}-${new Date().getMilliseconds()}` : undefined;

	const { input } = useField(name);

	const onBlurHandler = useCallback(() => {
		if (!changeHandler) return;
		changeHandler(name, input.value);
	}, [input.value, name, changeHandler]);

	return (
		<label className={className}>
			<span>{label}</span> <span className='form-control'>
				<Field
					component={type !== 'custom' ? 'input' : undefined}
					type={type !== 'custom' ? type : undefined}
					name={name}
					onBlur={onBlurHandler}
					list={datalistId}
					{...attr}
				>{field}</Field>
				{children}
				{!!datalistId && <DataList list={list} id={datalistId} clearDatalistHandler={clearDatalistHandler} listName={listName} />}
			</span>
			{!!comment && <small className="comment">{comment}</small>}
		</label>
	)
});

export const FormControlCheckboxField: FunctionComponent<FormControlCheckboxFieldProps> = ({ label, name, className, comment, children, handler }): ReactElement => {

	const { input: { value, onChange } } = useField<boolean>(name, { subscription: { value: true } });

	const onChangeHandler = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		onChange(event);

		if (handler) {
			handler(name, !value);
		}
	}, [onChange, name, handler, value]);

	return (
		(<label className={cn(className, value ? 'checked' : '')}>
			<span>{label}</span> <span className='form-control fc-checkbox'>
				<Field
					name={name}
					type="checkbox"
					component="input"
					onChange={onChangeHandler}
				/>
				{children}
			</span>
			{!!comment && <small className="comment">{comment}</small>}
		</label>)
	);
};

export const FormControlCheckbox: FunctionComponent<FormControlCheckboxProps> = ({ label, name, className, comment, onChange, checked, children, disabled = false }): ReactElement => {
	return (
		<label className={cn(className, checked ? 'checked' : '', disabled && 'disabled')}>
			<span>{label}</span> <span className='form-control fc-checkbox'>
				<input type='checkbox' name={name} onChange={onChange} value='1' checked={checked} disabled={disabled} />
				{children}
			</span>
			{!!comment && <small className="comment">{comment}</small>}
		</label>
	)
};

export const FormControlRadio: FunctionComponent<FormControlRadioProps> = (props) => {
	return (
		<div className='label'>
			{props.label}
			<div className="radios">
				{[...props.values].map(entry => <label key={entry[0]}><input name={props.name} type='radio' value={entry[0]} checked={props.value === entry[0]} onChange={props.onChange} />{entry[1]}</label>)}
			</div>
		</div>
	)

}
export const FormControlSelect: FunctionComponent<FormControlSelectProps> = (props) => {
	return (
		<label className={props.className}>
			<span>{props.label}</span>
			<span className="form-control">
				<select name={props.name} onChange={props.onChange} value={props.value}>
					{[...props.values].map(entry => <option key={entry[0]} value={entry[0]}>{I18n.t(entry[1])}</option>)}
				</select>
			</span>
		</label>
	)
}

export const FormControlSelectField: FunctionComponent<FormControlSelectFieldProps> = ({ name, ...props }) => {
	return (
		<label className={props.className}>
			<span>{props.label}</span>
			<span className="form-control">
				<Field
					component="select"
					name={name}
					// onBlur={onBlurHandler}
					{...props} >
					{[...props.values].map(entry => <option key={entry[0]} value={entry[0]}>{I18n.t(entry[1])}</option>)}
				</Field>
			</span>
		</label>
	)
}

export const FormControlTaxon: FunctionComponent<FormControlTaxonProps> = (props) => {
	const { updateState, value, ...attr } = props;
	const [taxonName, setTaxonName] = useState(value.name);
	useEffect(() => {
		setTaxonName(props.value.name)
	}, [props.value])
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setTaxonName(e.target.value);
		const newTaxon: iLookupTaxon = { id: 0, name: e.target.value };
		updateState({ taxon: newTaxon });
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
		(<FormControl type='text' {...attr} label={I18n.t("Таксон")} name="taxon" onChange={onChange} onBlur={() => { setTaxon(props.value, updateState) }} value={taxonName}>
			{children}
		</FormControl>)
	);
}

export const FormControlTaxonField: FunctionComponent<FormControlTaxonFieldProps> = ({ name, changeHandler, list, ...attr }) => {
	const { input: { value: taxonValue, onChange, onBlur } } = useField<iLookupTaxon | string>(name, { subscription: { value: true } });

	const { setStatus, setShow } = useContext(StatusMessageContext);
	const datalistId = (!!list && list.length > 0) ? `form-control-dl-${name}-${new Date().getMilliseconds()}` : undefined;

	let children = useMemo(() => {
		if (typeof taxonValue !== 'string' && taxonValue.id !== 0 && taxonValue.name !== "" + taxonValue.id) {
			if (taxonValue.lookupSuccess) {
				return (
					<a href={`https://www.inaturalist.org/taxa/${taxonValue.id}`} target='_blank' rel='noopener noreferrer'>
						<span role='img' aria-label={I18n.t("Успешно")}>✅
							{!!taxonValue.commonName && <span className='common-name'>{taxonValue.commonName}</span>}
						</span>
					</a>);

			} else {
				return (<span role='img' aria-label={I18n.t("Неуспешно")}>⚠️</span>);
			}
		}
		return null;
	}, [taxonValue]);

	const onBlurHandler = useCallback(async (event: React.FocusEvent<HTMLInputElement>) => {
		onBlur(event)
		const taxon = await lookupTaxon(taxonValue, setStatus, setShow);

		onChange(taxon);
	}, [onChange, onBlur, setShow, setStatus, taxonValue]);

	const field = useCallback(
		({ input, onBlur }: { input: FieldRenderProps<any, HTMLElement, any>, onBlur: React.FocusEventHandler<HTMLInputElement> }) => {
			const value = typeof input.value === 'string' ?
				input.value :
				input.value.lookupSuccess ?
					`${input.value.commonName} (${input.value.name})` : (
						typeof taxonValue === 'string' ? taxonValue : taxonValue.name
					);

			return (
				<input type='text' name={input.name} value={value} list={datalistId} onChange={input.onChange} onBlur={onBlur} onFocus={(e) => {
					e.target.focus();
				}} />
			);
		}, [datalistId, taxonValue]
	);

	return (
		<FormControlField
			type='text'
			{...attr}
			list={list}
			datalistId={datalistId}
			label={I18n.t("Таксон")}
			name="taxon"
			changeHandler={changeHandler}
			onBlur={onBlurHandler}
			field={field}
		>
			{children}
		</FormControlField>

	);
}

export const FormControlCSV: FunctionComponent<Omit<BooleanControlProps, 'label' | 'name'>> = ({ handler, value }) => {
	return (
		<FormControlCheckbox label={I18n.t('Выводить в CSV')} name='csv' onChange={handler} checked={value}></FormControlCheckbox>
	);
}
export const FormControlCSVField: FunctionComponent<Pick<FormControlCheckboxFieldProps, 'handler'>> = ({ handler }) => {
	return (
		<FormControlCheckboxField label={I18n.t('Выводить в CSV')} name='csv' handler={handler} />
	);
}

export const FormControlLimit: FunctionComponent<NumberControlProps> = ({ handler, value }) => {
	return (
		<FormControl label={I18n.t('Лимит')} type='number' name='limit' onChange={handler}
			value={value} min="0" step="1" />
	);
}

export const FormControlLimitField: FunctionComponent<Pick<FormControlFieldProps, 'changeHandler'>> = ({ changeHandler }) => (
	<FormControlField label={I18n.t('Лимит')} type='number' name='limit' min="0" step="1" changeHandler={changeHandler} />
);

export const FormControlAdditionalParamsField: React.FC = () => (
	<FormControlField
		label={I18n.t("Дополнительные параметры")}
		type='text'
		name='additional'
	/>
);
FormControlAdditionalParamsField.displayName = 'FormControlAdditionalParamsField';

export const FormControlMultiline: FunctionComponent<MultilineControlProps> = (props) => {
	const { value: defValue = '' } = props;
	const [value, setValue] = useState('');

	useEffect(() => {
		setValue(typeof defValue === 'string' ? defValue : defValue?.reduce((value, item) => value += item.name + (!!item.title && item.title !== item.name ? ': ' + item.title : '') + '\n', '').trim())
	}, [defValue])

	return (
		<label className={props.className}>
			<span>{props.label}
				{!!props.comment && <div className="comment"><small>{props.comment}</small></div>}
			</span> <span className='form-control'>
				<textarea name={props.name} value={value} onChange={(e) => setValue(e.target.value)} onBlur={props.handler} />
			</span>
		</label>
	)
}

export const FormControlMultilineField: FunctionComponent<MultilineControlFieldProps> = (props) => {
	const { name } = props;

	const { input } = useField(name);

	const onBlurHandler = useCallback(() => {
		if (!props.handler) return;
		props.handler(name, input.value);
	}, [input.value, name, props]);

	return (
		<label className={props.className}>
			<span>
				{props.label}
				{!!props.comment && <><br /><small className="comment">{props.comment}</small></>}
			</span>
			<span className='form-control fc-multiline'>
				<Field
					// component='textarea'
					name={name}
					onBlur={onBlurHandler}
				>{
						({ input, onBlur }) => {
							const value = typeof input.value === 'string' ?
								input.value :
								input.value?.reduce((v: string, item: iDataListItem) => v += item.name + (!!item.title && item.title !== item.name ? ': ' + item.title : '') + '\n', '').trim();

							return (
								<textarea name={input.name} value={value} onChange={input.onChange} onBlur={onBlur} />
							);
						}
					}
				</Field>
			</span>
		</label>
	)
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
