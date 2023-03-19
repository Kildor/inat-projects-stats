import { iLanguage, iLanguageInfo } from 'interfaces';
import { Settings } from "mixins/Settings";

const appLanguages: Record<string, iLanguage> = {
	"en": { "language": "English", "code": "en" },
	"ru": { "language": "Русский", "code": "ru" }
};

declare global {
	interface Window {
		I18n: any;
	}
}

const pf_re = new RegExp('^s*(?:\\s|[-\\?\\|&=!<>+*/%:;n0-9_()])+');


let DICTIONARY = !!window.I18n && !!window.I18n.DICTIONARY ? window.I18n.DICTIONARY : {};
const I18n = {
	SETTING_NAME: 'LANGUAGE',
	DICTIONARY,
	plural: (i: number | string) => 0,
	nplurals: 0,

	t(key: string, replace: Array<string | number> = []) {
		let keyToTranslate = DICTIONARY?.hasOwnProperty(key) ? DICTIONARY[key] : key;
		if (Array.isArray(keyToTranslate)) {
			const index = Array.isArray(replace) ? this.plural(replace[0]) : 0;
			keyToTranslate = keyToTranslate[index];
		}
		if (Array.isArray(replace)) {
			replace.forEach((item, index) => {
				keyToTranslate = keyToTranslate.replace(new RegExp("(\\{" + (index + 1) + "\\}|%" + (index + 1) + ")", 'g'), '' + item);
			});
		}
		return keyToTranslate;
	},

	init(languageInfo: iLanguageInfo) {
		this.loadStrings(languageInfo.strings);
		this.nplurals = languageInfo.nplurals;
		try {
			if (!pf_re.test(languageInfo.plural)) {
				throw new Error('Wrong plural function')
			}
			// eslint-disable-next-line no-eval
			this.plural = eval(`n => {const plural = ${languageInfo.plural}; return plural ? 1 : ( plural ? plural : 0); }`);
		} catch (e) {
			console.error(e);

			this.plural = (i: number | string) => 0;
		}
	},

	loadStrings(strings: Record<string, string | string[]>) {
		DICTIONARY = strings;
	},

	initDefault(code: string) {
		if (code === 'ru') I18n.loadStrings({
			"Загружается": "Загружается",
			"Загружается язык приложения": "Загружается язык приложения"
		});
		else I18n.loadStrings({
			"Загружается": "Loading",
			"Загружается язык приложения": "App language is loading"
		});
	},
	showDictionary() {
		console.dir(DICTIONARY);
	}
};

export default I18n;

export const applicationLanguage: iLanguage[] = Object.keys(appLanguages).map(language => appLanguages[language]);

export const getLanguage = () => {
	const savedLanguage = Settings.get(I18n.SETTING_NAME, '');

	for (const language of [savedLanguage, ...navigator.languages]) {
		if (appLanguages[language]) return appLanguages[language];
	}
	return appLanguages['ru'];
}

export const saveLanguage = (language: string): void => {
	if (appLanguages[language]) Settings.set(I18n.SETTING_NAME, language);
}