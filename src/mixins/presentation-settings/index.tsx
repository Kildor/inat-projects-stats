import I18n from 'classes/I18n';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { PropsWithChildren } from 'react';
import { FormControlCSV, FormControlCheckbox } from '../Form/FormControl';

import './styles.scss';

interface PresentationSettingsProps {
	setPresentation?: Function;
	onChangeHandler: Function;
	values: Record<string, boolean | string | number>;
	settings?: Array<{ label: string, name: string, hidden?: boolean }>;
}
export const PresentationSettings: React.FC<PropsWithChildren & PresentationSettingsProps> = ({
	children,
	setPresentation,
	values,
	settings,
	onChangeHandler,
}) => {

	const [csv, setCsv] = useState(values.csv);

	const changeHandler = useCallback(
		({ target }: ChangeEvent<HTMLInputElement>) => {
			onChangeHandler(target.name, target.checked);
			if (setPresentation) {
				setPresentation((currentSettings: Record<string, boolean>) => ({ ...currentSettings, [target.name]: target.checked }));
			}
			if (target.name === 'csv') {
				setCsv(target.checked);
			}

		}, [onChangeHandler, setPresentation]);


	return (<>
		<fieldset className='presentationSettings'>
			<legend>{I18n.t("Настройки отображения")}</legend>
			<div>
				{typeof values.csv !== 'undefined' && <FormControlCSV handler={changeHandler} value={Boolean(csv)} />}
				{settings && settings.map(({ label, name, hidden }) => (
					<FormControlCheckbox key={name} label={label} disabled={hidden} name={name} onChange={changeHandler} checked={Boolean(values[name])} />
				))
				}
				{children}
			</div>
		</fieldset>
	</>);
}
