import React, { ChangeEvent, ReactNode } from 'react'
import I18n from '../../classes/I18n';
import { FormControl, FormControlCheckbox } from './FormControl';

interface DataControlsBlockProps {
	checkHandler: (e: ChangeEvent<HTMLInputElement>) => void,
	changeHandler: (e: ChangeEvent<HTMLInputElement>) => void,
	state: { d1: string, d2: string, date_any?: boolean, date_created: boolean },
	children: ReactNode
}

export const DataControlsBlock: React.FC<DataControlsBlockProps> = ({
	checkHandler, changeHandler, state, children
}) => {
	const { d1, d2, date_any, date_created } = state;
	return <fieldset>
		<legend>{I18n.t("Настройки даты")}</legend>
		{typeof date_any === 'boolean' && <FormControlCheckbox label={I18n.t("За всё время")} name='date_any' onChange={checkHandler}
			checked={date_any} />}
		<fieldset className={"noborder" + (date_any ? " hidden" : "")}>
			<FormControl label={I18n.t("Наблюдения после")} type='date' name='d1' onChange={changeHandler}
				value={d1}>
			</FormControl>
			<FormControl label={I18n.t("Наблюдения до")} type='date' name='d2' onChange={changeHandler}
				value={d2}>
			</FormControl>
			<FormControlCheckbox label={I18n.t("Дата загрузки")} name='date_created' onChange={checkHandler}
				comment={I18n.t("Иначе дата рассматривается как дата наблюдения")}
				checked={date_created} />
		</fieldset>
		{children}
	</fieldset>;
};
DataControlsBlock.displayName = 'DataControlsBlock';
