import { iLanguage } from "../interfaces/LanguageInterface";
import Settings from "../mixins/Settings";

const appLanguages: any = {
	"en": { "language": "English", "code": "en" },
	"ru": { "language": "Русский", "code": "ru" }
};

declare global {
	interface Window {
		I18n: any;
	}
}

let DICTIONARY = !!window.I18n && !!window.I18n.DICTIONARY ? window.I18n.DICTIONARY : {};
const I18n = {
	SETTING_NAME: 'LANGUAGE',
	DICTIONARY,
	t(key: string, replace: Array<string|number> = []) {
		key = DICTIONARY.hasOwnProperty(key) ? DICTIONARY[key] : key;
		if (Array.isArray(replace)) {
			replace.forEach((item, index) => {
				key = key.replace(new RegExp("(\\{" + (index + 1) + "\\}|%" + (index + 1) + ")", 'g'), ''+item);
			});
		}
		return key;
	},

	init(strings: object) {
		DICTIONARY = strings;
	},
	initDefault( code: string ) {
		if (code !== 'ru') I18n.init({
			"Загружается": "Loading",
			"Загружается язык приложения": "App language is loading"
		});
	},
};

export default I18n;

export const applicationLanguage: iLanguage[] = Object.keys(appLanguages).map(language => appLanguages[language]);

export const getLanguage = () => {
	const savedLanguage = Settings.get(I18n.SETTING_NAME,'');
	if (appLanguages[savedLanguage]) return appLanguages[savedLanguage];

	for (const language of navigator.languages) {
		if (appLanguages[language]) return appLanguages[language];
	}
	return appLanguages['ru'];
}

export const saveLanguage = (language: string): void => {
	if (appLanguages[language]) Settings.set(I18n.SETTING_NAME, language);
	// window.location.reload();
}