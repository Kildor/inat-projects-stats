import React from 'react'
import Page from '../mixins/Page';
import Settings from "../mixins/Settings";
import {FormControl, FormControlMultiline} from '../mixins/Form/FormControl';
import defaultPlaces from '../assets/places.json';
import defaultProjects from '../assets/projects.json'
import Form from '../mixins/Form/Form';
import Module from '../classes/Module';
import I18n from '../classes/I18n';
import Loader from '../mixins/Loader';
import Error from '../mixins/Error';
import API, { saveDatalist } from '../mixins/API';

export default class UserSettings extends Module {
	constructor(props) {
		super(props);
		this.state = {
			loadingTitle: null,
			error: null,
		};
		this.initSettings(["default_place", "default_language", 
			"projects", "users", "taxons"], this.state, {
			"projects": defaultProjects
		});
		this.updateState = (state) => this.setState(state);
	}

	async counter() {
		this.setState({ loadingTitle: I18n.t("Настройки сохранены") });
	}

	storageHandler() {
		return {
			users: saveDatalist(this.state.user_id, this.state.user_id, this.state.users, 'users'),
			projects: saveDatalist(this.state.project_id, this.state.project_id, this.state.projects, 'projects')
		};
	}

	changeHandler = (e) => {
		this.setState({loadingTitle: null});
		super.changeHandler(e);
	}
	changeMultilineHandler = (e) => {
		let newState = { error: null };
		newState[e.target.name] = API.filterDatalist(e.target.value.trim().split('\n').filter(s => s.trim().length > 2).map(s => {
			const [ name, title ] = s.trim().split(/(?<=^(?:\S|[^:])+):\s/);
			return {name, title: title || name}
		}));
		Settings.set(e.target.name, newState[e.target.name]);
		this.setState(newState);
	}


	render() {
		return (
			<Page title={I18n.t("Настройки пользователя")} className='page-settings'>
				<Form onSubmit={this.submitHandler} disabled={false} submitTitle={I18n.t("Сохранить")}>
					<fieldset className="noborder">
					<FormControl 
						type="number"
						name="default_place"
						label={I18n.t("Место по умолчанию")}
						comment={`${I18n.t("Цифровое значение")}. ${I18n.t("Используется для показа региональных имён таксонов")}. ${I18n.t("Можно оставить пустым.")}`}
						value={this.state.default_place}
						onChange={this.changeHandler}
						list={defaultPlaces}
						listName="places"
						clearDatalistHandler={this.clearDatalistHandler}
					/>
					<FormControl label={I18n.t("Язык по умолчанию")} comment={I18n.t("Оставьте пустым для использования языка из настроек браузера")} name="default_language"
					value={this.state.default_language} onChange={this.changeHandler}
					/>
					<FormControlMultiline
						name='projects'
						label={I18n.t("Сохранённые проекты")}
						value={this.state.projects}
						handler={this.changeMultilineHandler}
							comment={<>{I18n.t("Записи разделяются переводом строки.")}<br />{I18n.t("Вначале идентификатор, затем, через двоеточие и пробел, отображаемое название.")}</>}
					/>
					<FormControlMultiline
						name='users'
						label={I18n.t("Сохранённые пользователи")}
						value={this.state.users}
						handler={this.changeMultilineHandler}
							comment={I18n.t("Записи разделяются переводом строки.")}
					/>
					<FormControlMultiline
						name='taxons'
						label={I18n.t("Сохранённые таксоны")}
						value={this.state.taxons}
						handler={this.changeMultilineHandler}
							comment={<>{I18n.t("Записи разделяются переводом строки.")}<br />{I18n.t("Вначале идентификатор, затем, через двоеточие и пробел, отображаемое название.")}</>}
					/>
{/* 					<FormControlMultiline
						name='places'
						label={I18n.t("Сохранённые места")}
						value={this.state.places}
						handler={this.changeMultilineHandler}
					/> */}
					</fieldset>
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