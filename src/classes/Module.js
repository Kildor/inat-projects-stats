import React from 'react'
import { Settings } from '../mixins/API';
import settings from '../assets/settings.json';
export default class extends React.Component {
	constructor(props) {
		super(props);
		this.changeHandler = this.changeHandler.bind(this);
		this.checkHandler = this.checkHandler.bind(this);
		if (this.storageHandler) this.storageHandler = this.storageHandler.bind(this);
		this.submitHandler = this.submitHandler.bind(this);
		this.clearDatalistHandler = this.clearDatalistHandler.bind(this);
		this.setStatusMessage = this.setStatusMessage.bind(this);
	}

	getDefaultSettings() {
		const state = {
			loading: false, loadingTitle: null, loadingMessage: null,
			error: null,
			data: []
		};
		this.initSettings(["filename", "csv"], state);
		return state;
	}
	initSettings(settingsList, thisState) {
		settingsList.forEach(state => {
			const setting = settings[state] || {save: false, default: ""};
			thisState[state] = setting.save ? Settings.get(state, setting.default) : setting.default;
		});
	}

	changeHandler(e) {
		let newState = { error: null };
		newState[e.target.name] = e.target.value.toLowerCase();
		if (!!settings[e.target.name] && settings[e.target.name].save) Settings.set(e.target.name, newState[e.target.name]);
		this.setState(newState);
	}

	checkHandler(e) {
		let newState = {};
		newState[e.target.name] = e.target.checked;
		if (!!settings[e.target.name] && settings[e.target.name].save) Settings.set(e.target.name, newState[e.target.name]);
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
		this.setState({ loading: true, data: [] });
		if (!!this.storageHandler) this.setState(this.storageHandler());
		if (!!this.setFilename) this.setFilename();
		this.counter().then((data) => {
			this.setState({ data, loading: false });
		}).catch(e => {
			console.dir('error')
			this.setState({ data: [], loading: false, error: e.message })
		})
	}

	setStatusMessage(message) {
		this.setState({ loadingMessage: message });
	}

}