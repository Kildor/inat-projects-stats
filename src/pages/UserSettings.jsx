import React from 'react'
import Page from '../mixins/Page';
import Settings from "../mixins/Settings";
import {FormControl} from '../mixins/FormControl';
import defaultPlaces from '../assets/places.json';
import Form from '../mixins/Form';
import Module from '../classes/Module';
import I18n from '../classes/I18n';
import Loader from '../mixins/Loader';
import Error from '../mixins/Error';

export default class UserSettings extends Module {
	constructor(props) {
		super(props);
		this.state = this.getDefaultSettings();
		this.initSettings(["default_place", "default_language"], this.state);
		this.updateState = (state) => this.setState(state);
	}

	async counter() {
		this.setState({ loadingTitle: I18n.t("Настройки сохранены") });
	}

	storageHandler() {
		let projects = this.state.projects;
		if (!this.state.project_id) return;
		projects.push({ name: this.state.project_id, title: this.state.project_id });
		const filteredProjects = Array.from(new Set(projects.map(u => JSON.stringify(u)))).map(json => JSON.parse(json))
		Settings.set('projects', filteredProjects);
		return {projects: filteredProjects };
	}

	changeHandler = (e) => {
		this.setState({loadingTitle: null});
		super.changeHandler(e);
	}

	render() {
		return (
			<Page title={I18n.t("Настройки пользователя")} className='page-settings'>
				<Form onSubmit={this.submitHandler} disabled={false} submitTitle={I18n.t("Сохранить")}>
					<FormControl 
						type="number"
						name="default_place"
						label={I18n.t("Место по умолчанию")}
						comment={I18n.t("Цифровое значение")+". "+I18n.t("Используется для показа региональных имён таксонов.") + I18n.t("Можно оставить пустым.")}
						value={this.state.default_place}
						onChange={this.changeHandler}
						list={defaultPlaces}
						listName="places"
						clearDatalistHandler={this.clearDatalistHandler}
					/>
					<FormControl label={I18n.t("Язык по умолчанию")} comment={I18n.t("Оставьте пустым для использования языка из настроек браузера")} name="default_language"
					value={this.state.default_language} onChange={this.changeHandler}
					/>
					</Form>
					<Loader title={this.state.loadingTitle} message={this.state.loadingMessage} show={this.state.loading} />
				<Error {...this.state} />
				{this.state.loadingTitle &&
					<div className='result'>
						{this.state.loadingTitle}
					</div>
				}					
			</Page>
		)
	}
}