declare global {
	interface Window {
		I18n: any;
	}
}

let DICTIONARY = !!window.I18n && !!window.I18n.DICTIONARY ? window.I18n.DICTIONARY : {};
const I18n = {
	DICTIONARY,
	t(key: string, replace = []) {
		key = DICTIONARY.hasOwnProperty(key) ? DICTIONARY[key] : key;
		if (Array.isArray(replace)) {
			replace.forEach((item, index) => {
				key = key.replace(new RegExp("\\{" + (index + 1) + "\\}", 'g'), item);
			});
		}
		return key;
	}
};

export default I18n;
