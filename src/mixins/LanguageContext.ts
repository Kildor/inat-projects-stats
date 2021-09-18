import React from "react";
import { getLanguage } from "../classes/I18n";

const context = {
	code: getLanguage().code,
	changeLanguage: (languageCode: string) => {}
}
export const LanguageContext = React.createContext(context);