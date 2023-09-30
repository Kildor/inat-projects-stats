
export class Settings {
	static SettingsName = 'inat-projects-stats';

	static loadFromStorage = () => {
		try {
			const val = localStorage.getItem(Settings.SettingsName);
			if (val !== null) return JSON.parse(val);
		} catch (e) { }
		return {};
	};
	static get = (name: string, def: any) => {
		const settings = Settings.loadFromStorage();
		return (settings.hasOwnProperty(name) && (typeof settings[name] === 'boolean' || settings[name].length > 0)) ? settings[name] : def;
	};
	static set = (name: string, value: any) => {
		const settings = Settings.loadFromStorage();
		settings[name] = value;
		localStorage.setItem(Settings.SettingsName, JSON.stringify(settings));
		return value;
	};
}
