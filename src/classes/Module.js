import React from 'react'
import { Settings } from "../mixins/Settings";
import settings from '../assets/settings.json';
import { DEFAULTS } from '../constants';
export default class Module extends React.Component {
	values = {};
	constructor(props) {
		super(props);
		this.changeHandler = this.changeHandler.bind(this);
		this.checkHandler = this.checkHandler.bind(this);
		if (this.storageHandler) this.storageHandler = this.storageHandler.bind(this);
		this.submitHandler = this.submitHandler.bind(this);
		this.clearDatalistHandler = this.clearDatalistHandler.bind(this);
		this.setStatusMessage = this.setStatusMessage.bind(this);
	}

	initDefaultSettings() {
		const state = {
			loading: false, loadingTitle: null, loadingMessage: null,
			error: null,
			data: []
		};
		this.initSettings(["filename", "csv"], state);
		return state;
	}
	usedSettings = {};
	initSettings(settingsList, thisState, defaultValues = {}, overrideSettings = {}) {
		settingsList.forEach(state => {
			const setting = overrideSettings[state] || settings[state] || { setting: state, save: false };
			const defValue = DEFAULTS[state] || defaultValues[state] || setting.default || "";
			thisState[state] = setting.save ? Settings.get(state, defValue) : defValue;
			if (!!setting.values) {
				this.values[state] = new Map(Object.entries(setting.values));
			}
			this.usedSettings[state] = setting;
		});
		console.log(thisState);
	}
	getValues(settingName) {
		return this.values[settingName] || {}
	}

	changeHandler(e) {
		let newState = { error: null };
		newState[e.target.name] = e.target.value.toLowerCase();
		console.log(e.target.name, this.usedSettings[e.target.name], this.usedSettings)
		if (!!this.usedSettings[e.target.name] && this.usedSettings[e.target.name].save) Settings.set(e.target.name, newState[e.target.name]);
		this.setState(newState);
	}

	checkHandler(e) {
		let newState = {};
		newState[e.target.name] = e.target.checked;
		if (!!this.usedSettings[e.target.name] && this.usedSettings[e.target.name].save) Settings.set(e.target.name, newState[e.target.name]);
		this.setState(newState);
	}
	clearDatalistHandler(e) {
		e.preventDefault();
		const name = e.currentTarget.dataset['clear'];
		const newState = {};
		console.dir(name)
		newState[name] = [];
		this.setState(newState);
		Settings.set(name, []);
	}

	async submitHandler(e) {
		e.preventDefault();
		this.setState({ loading: true, data: [], error: null });
		if (!!this.storageHandler) this.setState(this.storageHandler());
		if (!!this.setFilename) this.setFilename();
		this.counter().then((data) => {
			this.setState({ data, loading: false, error: null });
		}).catch(e => {
			console.error(e);
			this.setState({ data: [], loading: false, error: e.message })
		})
	}

	setStatusMessage(message) {
		this.setState({ loadingMessage: message });
	}

}
