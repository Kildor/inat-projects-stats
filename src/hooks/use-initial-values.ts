import { DEFAULTS } from "../constants";
import defaultSettingsList from 'assets/settings.json';
import { Settings } from "classes/settings";
import { Setting } from "interfaces";
import { useHistory } from "react-router-dom";

/**
 * Получить изначальные данные скрипта.
 * 
 * @param settingsList Список используемых параметров.
 * @param defaultValues Значения по умолчанию.
 * @param overrideSettings Настройки параметров, отсутствующих в стандартном списке, либо требующие переопределения.
 */
export function useInitialValues<T>(settingsList: Array<keyof T>, defaultValues: Partial<Record<keyof T, any>> = {}, overrideSettings: Partial<Record<keyof T, any>> = {}) {
	const usedSettings: Record<keyof T, any> = {} as Record<keyof T, any>;
	const values: Record<keyof T, any> = {} as Record<keyof T, any>;
	const optionValues: Partial<Record<keyof T, any>> = {}

	const { location } = useHistory();
	const urlSearchParams = new URLSearchParams(location.search);


	settingsList.forEach((name: keyof T) => {
		const setting = overrideSettings[name] || (defaultSettingsList as Record<keyof T, Setting<unknown>>)[name] || { setting: name, save: false };

		const defValue = urlSearchParams.get(name.toString()) ?? (DEFAULTS as Record<keyof T, any>)[name] ?? defaultValues[name] ?? setting.default ?? "";

		values[name] = !urlSearchParams.has(name.toString()) && setting.save ? Settings.get(name as string, defValue) : Boolean(defValue) && defValue[0] === '{' ? JSON.parse(defValue) : defValue;


		if (!!setting.values) {
			optionValues[name] = new Map(Object.entries(setting.values));
		}
		usedSettings[name] = setting;
	});

	const onChangeHandler = (fieldName: string, value: string | boolean) => {
		if (usedSettings && !!usedSettings[fieldName as keyof T] && usedSettings[fieldName as keyof T].save) {
			Settings.set(fieldName, value);
		}
	};

	return { usedSettings, values, optionValues, onChangeHandler };
};
