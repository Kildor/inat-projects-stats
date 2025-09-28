import { I18n } from 'classes';
import { StatusMessageContext } from 'contexts/status-message-context';
import { FormControlTaxonFieldProps, iLookupTaxon } from 'interfaces';
import { lookupTaxon } from 'mixins/API';
import React, { FunctionComponent, useContext, useMemo, useCallback } from 'react';
import { useField, FieldRenderProps } from 'react-final-form';
import { FormControlField } from '../FormControl';

const defaultTaxonValue: iLookupTaxon = { "id": 0, "name": "", "commonName": "", "lookupSuccess": false };

export const FormControlTaxonField: FunctionComponent<FormControlTaxonFieldProps> = ({ name, changeHandler, list, label = I18n.t("Таксон"), ...attr }) => {
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
		onBlur(event);
		const taxon = await lookupTaxon(taxonValue, setStatus, setShow);

		onChange(taxon);
	}, [onChange, onBlur, setShow, setStatus, taxonValue]);

	const field = useCallback(
		({ input, onBlur }: { input: FieldRenderProps<any, HTMLElement, any>; onBlur: React.FocusEventHandler<HTMLInputElement>; }) => {
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

	console.log(taxonValue);

	return (
		<FormControlField
			type='text'
			{...attr}
			list={list}
			datalistId={datalistId}
			label={label}
			name={name}
			changeHandler={changeHandler}
			defaultValue={defaultTaxonValue}
			onBlur={onBlurHandler}
			field={field}
		>
			{children}
		</FormControlField>

	);
};
