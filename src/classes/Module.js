import React, { SyntheticEvent } from 'react'
import { Settings } from '../mixins/API';
export default class extends React.Component {
	changeHandler(e) {
		let newState = { error: null };
		newState[e.target.name] = e.target.value;
		this.setState(newState);
	}

	checkHandler(e) {
		let newState = {};
		newState[e.target.name] = e.target.checked;
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
	
	setStatusMessage(message) {
		this.setState({ loadingMessage: message });
	}

}