import { FormRenderProps } from "react-final-form";
import { Setting } from "./settingsTypes";
import { Taxon } from "DataObjects";

/** Поля настроек отображения. */
export interface FormPresentationFields {
	csv: boolean;
}

/** Поля настроек даты. */
export interface FormDataFields {
	d1: string;
	d2: string;
	date_created: boolean;
	date_any: boolean;
}

/** Прочие настройки форм. */
export interface FormOtherFields {
	/** Лимит. */
	limit: number;
	/** Скачивать только виды. */
	species_only: boolean;
	/** Статус наблюдения. */
	quality_grade: string;
	/** Дополнительные параметры API. */
	additional: string;
}

/** Настройки фильтрации. */
export interface FormFilterFields {
	project_id: string;
	user_id: string;
	place_id: number;
	taxon: Taxon;
}

/** Общие поля всех форм. */
export interface StandartFormFields extends FormPresentationFields, FormDataFields, FormFilterFields, FormOtherFields {};

/** Общие поля настроек отображения. */
export interface PresentationSettingsList extends Pick<FormPresentationFields, 'csv'> { };

export interface StandartFormProps<T, P = PresentationSettingsList> extends FormRenderProps<T> {
	setPresentation?: React.Dispatch<React.SetStateAction<P>>;
	usedSettings?: Record<keyof Partial<T>, Setting<unknown>>;
	optionValues?: Record<string, Map<string | number, string>>;
	onChangeHandler(name: string, value: string | boolean): void;
	loading?: boolean;
}