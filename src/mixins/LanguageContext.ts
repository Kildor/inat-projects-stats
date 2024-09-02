import React from "react";
import { getLanguage } from "../classes/I18n";

const context = {
	/** Код выбранного языка. */
	code: getLanguage().code,
	/** Смена языка приложения. */
	changeLanguage: (languageCode: string) => {},
	/** Форматирование чисел согласно выбранной локали. */
		formatNumber: (n: number) => '',
}
export const LanguageContext = React.createContext(context);