import { DEFAULTS } from "../constants";
import defaultSettingsList from 'assets/settings.json';
import { Settings } from "classes/settings";
import { useCallback } from "react";

/** Получить обработчик удаления сохранённых данных в даталисте. */
export const useClearDatalistHandler = () => {
	return useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
		e.preventDefault();
		const name = e.currentTarget.dataset['clear'];
		if (!name) {
			return;
		}

		Settings.set(name, []);
	}, []);
};

/**
 * Получить сохранённые даталисты и обработчик удаления данных в них.
 */
export const useDatalist = (list: Array<keyof typeof defaultSettingsList>, defaultValues: Record<string, any> = {}) => {
	const datalists: Record<string, any> = {}
	list.forEach(state => {
		const setting = (defaultSettingsList as Record<string, any>)[state] || { setting: state, save: true };
		const defValue = defaultValues[state] || DEFAULTS[state] || setting.default || [];
		datalists[state] = setting.save ? Settings.get(state, defValue) : defValue;
	});

	const clearDatalistHandler = useClearDatalistHandler();

	return { datalists, clearDatalistHandler };
};
