import React, { ReactNode } from 'react'
import I18n from 'classes/I18n';
import { FormControlAdditionalParamsField, FormControlCheckboxField, FormControlField, FormControlLimitField, FormControlSelectField } from './FormControl';
import { useField } from 'react-final-form';

interface CommonControlsBlockProps {
	handler?: (name: string, value: boolean | string) => void
	children?: ReactNode;
}

interface DataControlsBlockProps extends CommonControlsBlockProps {
	showDateAny?: boolean;
}

interface OtherControlsBlockProps extends CommonControlsBlockProps {
	limit?: boolean;
	optionValues: Record<string, Map<string | number, string>>;
}


export const DataControlsBlock: React.FC<DataControlsBlockProps> = ({
	handler, children, showDateAny = false
}) => {
	const { input: { value: date_any } } = useField<boolean>('date_any');

	return <fieldset>
		<legend>{I18n.t("Настройки даты")}</legend>
		{showDateAny && <FormControlCheckboxField label={I18n.t("За всё время")} name='date_any' handler={handler} />}
		<fieldset className={"noborder" + (!!date_any ? " hidden" : "")}>
			<FormControlField label={I18n.t("Наблюдения после")} type='date' name='d1' changeHandler={handler} />
			<FormControlField label={I18n.t("Наблюдения до")} type='date' name='d2' changeHandler={handler} />
			<FormControlCheckboxField label={I18n.t("Дата загрузки")} name='date_created' handler={handler}
				comment={I18n.t("Иначе дата рассматривается как дата наблюдения")}
			/>
		</fieldset>
		{children}
	</fieldset>;
};
DataControlsBlock.displayName = 'DataControlsBlock';

export const OtherControlsBlock: React.FC<OtherControlsBlockProps> = ({
	handler: onChangeHandler,
	limit = true,
	optionValues,
	children
}) => (
	<fieldset>
		<legend>{I18n.t("Прочее")}</legend>
		{children}
		{limit && <FormControlLimitField changeHandler={onChangeHandler} />}
		<FormControlCheckboxField label={I18n.t("Выводить только виды")} name='species_only' handler={onChangeHandler} />
		<FormControlSelectField label={I18n.t("Статус наблюдения")} name="quality_grade"
			values={optionValues['quality_grade']} />
		<FormControlAdditionalParamsField />

	</fieldset>
);