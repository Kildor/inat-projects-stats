import I18n, { saveLanguage } from "classes/I18n";
import { iLanguage } from "interfaces";
import { useEffect, useState } from "react";

export const useLanguageContext = (language: iLanguage) => {
	const [currentLanguage, setCurrentLanguage] = useState(language.code);
	const [languageLoaded, setLanguageLoaded] = useState(false);
	useEffect(() => {
		setLanguageLoaded(false);
		fetch(`languages/${currentLanguage}.json`).then((response) => response.json()).then(json => {
			I18n.init(json.strings);
		}).finally(() => {
			setLanguageLoaded(true);
		})
	}, [currentLanguage]);

	const context = {
		changeLanguage: (languageCode: string) => {
			I18n.initDefault(languageCode);
			setCurrentLanguage(languageCode);
			saveLanguage(languageCode);
		},
		code: currentLanguage
	};
	return {
		context,
		languageLoaded,
	}
}
