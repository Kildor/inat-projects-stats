
export default class Settings {
	static SettingsName = 'inat-projects-stats';

	static loadFromStorage = () => {
		try {
			let val = localStorage.getItem(Settings.SettingsName);
			if (val === null)
				val = "{}";
			return JSON.parse(val);
		} catch (e) {
		}
		return {};
	};
	static get = (name: string, def: any) => {
		const settings = Settings.loadFromStorage();

		if (settings.hasOwnProperty(name))
			return settings[name];
		return def;
	};
	static set = (name: string, value: any) => {
		const settings = Settings.loadFromStorage();
		settings[name] = value;
		localStorage.setItem(Settings.SettingsName, JSON.stringify(settings));
		return value;
	};
}
