import React, { FormEventHandler, ReactNode, useCallback, useState } from 'react';
import 'assets/Form.scss';
import I18n from 'classes/I18n';
import { useFormState } from 'react-final-form';
import { useHistory, useLocation } from 'react-router-dom';
import { iLookupTaxon } from 'interfaces';
import { CopyIcon } from 'mixins/icons';
import { Panel } from 'mixins/panel';

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
	const [showSavedUrl, setshowSavedUrl] = useState<boolean>(false);

	const handleSaveState = useCallback(() => {

		const convertedValues: Record<string, string> = {};

		Object.keys(values).filter(key => {
			if (key === 'csv') return false;
			if (values.date_any === true && ['d1', 'd2', 'date_created'].includes(key)) return false;
			if (key === 'taxon' && values[key].id === 0) return false;

			return true;
		}).forEach((key) => {
			if (typeof values[key] === 'object') {
				convertedValues[key] = JSON.stringify(values[key]);
			} else if (values[key] !== '') {
				convertedValues[key] = values[key];
			}
		}, {});

		history.replace({
			pathname: pathname,
			search: new URLSearchParams(convertedValues).toString()
		});
		setshowSavedUrl(true);

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
			{showSaveButton && showSavedUrl && (
				<Panel className='copy-url' title={I18n.t('Форма сохранена')} onClick={() => setshowSavedUrl(false)}>
					<input readOnly className='url-field' type='text' value={window.location.href} onFocus={e => e.currentTarget.select()} />
					<CopyIcon handleClick={() => { navigator.clipboard.writeText(window.location.href) }} />
				</Panel>
			)}
		</form>
	)
};
FormWrapper.displayName = 'FormWrapper';
