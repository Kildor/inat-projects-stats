import React from 'react'

import Page from '../mixins/Page'
import '../assets/Species.scss';

import API, { fillDateParams } from '../mixins/API';
import Settings from "../mixins/Settings";
import Loader from '../mixins/Loader';
import Note from '../mixins/Note';
import TaxonsList from '../mixins/TaxonsList';
import defaultProjects from '../assets/projects.json'
import Error from '../mixins/Error';
import Form from '../mixins/Form';
import {FormControl, FormControlCSV, FormControlCheckbox, FormControlLimit, FormControlSelect} from '../mixins/FormControl';
import Module from '../classes/Module';
import I18n from '../classes/I18n';
export default class extends Module {
	constructor(props) {
		super(props);
		this.state = this.initDefaultSettings();
		this.initSettings(["project_id", "user_id", "place_id", "limit", "species_only", "quality_grade", "contribution", "users", "d1", "d2", "date_created", "date_any"],this.state, {
			date_any: true
		});
	}

	async counter () {
		const {project_id, user_id, place_id, limit, contribution } = this.state;
		this.setState({ loadingTitle: I18n.t("Загрузка видов")});
		let customParams = { ...fillDateParams(this.state)};
		if (limit > 0) customParams['limit'] = limit;
		if (this.state.species_only) {
			customParams['lrank'] = 'species';
			customParams['hrank'] = 'species';
		}
		if (!!this.state.quality_grade) customParams['quality_grade'] = this.state.quality_grade;
		if (!!place_id) customParams['place_id'] = place_id;

		let allTaxa = await API.fetchSpecies(project_id, contribution ? '' : user_id, null, null, false, this.setStatusMessage, customParams);
		if (contribution && user_id !== '') {
			this.setState({ loadingTitle: I18n.t("Загрузка видов пользователя") });
			const userTaxa = await API.fetchSpecies(project_id, user_id, null, null, false, this.setStatusMessage, customParams);
			if (userTaxa.total === 0) return [];

			this.setState({ loadingTitle: I18n.t("Обработка загруженных данных") });
			return [...userTaxa.ids].filter(id => {
				return !allTaxa.ids.has(id) || allTaxa.objects.get(id).count === userTaxa.objects.get(id).count;
			}).map(id => userTaxa.objects.get(id));

		}

		this.setState({loadingTitle: I18n.t("Обработка загруженных данных") });

		return [...allTaxa.ids].map(id => allTaxa.objects.get(id));

	}

	setFilename() {
		let filename = "";
		filename+=this.state.project_id+"-";
		if (!!this.state.user_id) {
			filename+=this.state.user_id+"-";
			if (!!this.state.contribution && !!this.state.project_id) filename += "only-";
		}
		if (!!this.state.quality_grade) filename += "quality_"+this.state.quality_grade+"-";
		filename+= "species.csv";
		this.setState({ filename: filename });
	}

	storageHandler() {
		let users = this.state.users;
		users.push({ name: this.state.user_id, title: this.state.user_id });
		const filteredUsers = Array.from(new Set(users.map(u => JSON.stringify(u)))).map(json => JSON.parse(json))
		Settings.set('users', filteredUsers);
		return { users: filteredUsers };
	}

	render() {
		const disabled = this.state.loading || (this.state.d1 === '' || (this.state.project_id === '' && this.state.user_id === ''));
		return (
			<Page title={I18n.t("Виды проекта")} className='page-listSpecies'>
				<Form onSubmit={this.submitHandler} disabled={disabled}>
					<fieldset>
						<legend>{I18n.t("Фильтрация")}</legend>
						<FormControl label={I18n.t("Id или имя проекта")} type='text' name='project_id' onChange={this.changeHandler}
							value={this.state.project_id} list={defaultProjects} />
						<FormControl label={I18n.t("Id или имя пользователя")} type='text' name='user_id' onChange={this.changeHandler}
							value={this.state.user_id} list={this.state.users} clearDatalistHandler={this.clearDatalistHandler} listName="users" >
						</FormControl>
						<FormControlCheckbox label={I18n.t("Виды, встреченные только этим пользователем")} name='contribution' onChange={this.checkHandler}
							className={!!this.state.user_id ? '' : 'hidden'}
							checked={this.state.contribution} >
						</FormControlCheckbox>
						<FormControl label={I18n.t("Место")} type='text' name='place_id' onChange={this.changeHandler} value={this.state.place_id} list={this.state.places} clearDatalistHandler={this.clearDatalistHandler} listName='places' />
						<FormControlLimit handler={this.changeHandler} value={this.state.limit} />
						<FormControlCheckbox label={I18n.t("Выводить только виды")} name='species_only' onChange={this.checkHandler}
							checked={this.state.species_only} >
						</FormControlCheckbox>
						<FormControlSelect label={I18n.t("Статус наблюдения")} name="quality_grade" onChange={this.changeHandler}
							value={this.state.quality_grade} values={this.getValues("quality_grade")}
						/>
					</fieldset>
					<fieldset>
						<legend>{I18n.t("Настройки даты")}</legend>
						<FormControlCheckbox label={I18n.t("За всё время")} name='date_any' onChange={this.checkHandler}
							checked={this.state.date_any} />
						<fieldset className={"noborder" + (this.state.date_any ? " hidden" : "")}>
							<FormControl label={I18n.t("Наблюдения после")} type='date' name='d1' onChange={this.changeHandler}
								value={this.state.d1} />
							<FormControl label={I18n.t("Наблюдения до")} type='date' name='d2' onChange={this.changeHandler}
								value={this.state.d2} />
							<FormControlCheckbox label={I18n.t("Дата загрузки")} name='date_created' onChange={this.checkHandler}
								comment={I18n.t("Иначе дата рассматривается как дата наблюдения")}
								checked={this.state.date_created} />
						</fieldset>
					</fieldset>
					<fieldset>
						<legend>{I18n.t("Отображение")}</legend>
						<FormControlCSV handler={this.checkHandler} value={this.state.csv} />
					</fieldset>
				</Form>
				<Note>
					{I18n.t("Скрипт отображает все виды, отмеченные в проекте. Так же можно отобразить виды, которые наблюдал только указанный пользователь.")}
				</Note>
				<Loader title={this.state.loadingTitle} message={this.state.loadingMessage} show={this.state.loading}/>
				<Error {...this.state} />
				{!this.state.loading && !this.state.error &&
					<div className='result'>
						<TaxonsList
							taxons={this.state.data}
							d1={this.state.d1}
							d2={this.state.d2}
							date_created={this.state.date_created}
							date_any={this.state.date_any}
							place_id={this.state.place_id}
							project_id={this.state.project_id}
							user_id={this.state.user_id}
							csv={this.state.csv}
							filename={this.state.filename} />
					</div>
				}
			</Page>
		)
	}
}