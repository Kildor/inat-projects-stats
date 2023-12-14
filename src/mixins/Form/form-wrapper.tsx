import React, { FormEventHandler, ReactNode, useCallback } from 'react';
import 'assets/Form.scss';
import I18n from 'classes/I18n';
import { useFormState } from 'react-final-form';
import { useHistory, useLocation } from 'react-router-dom';
import { iLookupTaxon } from 'interfaces';

interface FormProps {
	onSubmit?: FormEventHandler<HTMLFormElement>;
	disabled: boolean;
	children: ReactNode;
	submitTitle?: string;
	showSaveButton?: boolean;
}

export const FormWrapper: React.FC<FormProps> = ({ onSubmit = () => { }, disabled, children, submitTitle = I18n.t("Запустить"), showSaveButton = true }) => {
	const { values } = useFormState();
	const history = useHistory();
	const { pathname } = useLocation();

	const handleSaveState = useCallback(() => {

		const convertedValues: Record<string, string> = {};

		Object.keys(values).forEach((key) => {
			if (typeof values[key] === 'object') {
				if (key !== 'taxon' || (values[key] as iLookupTaxon).id !== 0) {
					convertedValues[key] = JSON.stringify(values[key]);
				}
				return;
			}
			if (values[key] !== '') {
				convertedValues[key] = values[key];
			}
		}, {});

		history.replace({
			pathname: pathname,
			search: new URLSearchParams(convertedValues).toString()
		});
	}, [history, pathname, values]);

	return (
		<form onSubmit={onSubmit}>
			<fieldset>
				{children}
			</fieldset>
			<fieldset className='buttons'>

				<button disabled={disabled} type='submit' className="btn-submit">{submitTitle}</button>
				{showSaveButton && <button type='button' className="btn-save" onClick={handleSaveState}>{I18n.t("Сохранить форму")}</button>}
			</fieldset>
		</form>
	)
};
FormWrapper.displayName = 'FormWrapper';
