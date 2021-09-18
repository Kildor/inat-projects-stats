import React from 'react'

import Page from '../mixins/Page'
import '../assets/Species.scss';

import API from '../mixins/API';
import Settings from "../mixins/Settings";
import Loader from '../mixins/Loader';
import Note from '../mixins/Note';
import TaxonsList from '../mixins/TaxonsList';
import defaultProjects from '../assets/projects.json'
import Error from '../mixins/Error';
import Form from '../mixins/Form';
import {FormControl, FormControlCheckbox, FormControlCSV, FormControlLimit, FormControlSelect, FormControlTaxon } from '../mixins/FormControl';
import Module from '../classes/Module';
import I18n from '../classes/I18n';
import { TranslateJSX } from '../mixins/Translation';
export default class SpeciesMissed extends Module {
	constructor(props) {
		super(props);
		this.state = this.getDefaultSettings();
		this.state.unobserved_by_user_id = '';
		this.initSettings(["project_id","user_id","csv","limit", "species_only","quality_grade", "users","taxon","taxons"], this.state);
		this.updateState = this.setState.bind(this);
	}

	async counter () {
		const {project_id, taxon, user_id, limit, unobserved_by_user_id} = this.state;
		let customParams = {};
		if (limit > 0) customParams['limit'] = limit;
		if (!!taxon && taxon.id > 0) customParams['taxon_id'] = taxon.id;
		if (this.state.species_only) {
			customParams['lrank'] = 'species';
			customParams['hrank'] = 'species';
		}
		if (!!this.state.quality_grade) customParams['quality_grade'] = this.state.quality_grade;
		customParams['unobserved_by_user_id'] = unobserved_by_user_id;
		this.setState({ loadingTitle: I18n.t("Загрузка видов") });
		const unobservedTaxa = await API.fetchSpecies(project_id, user_id, null, null, this.setStatusMessage, customParams);

		return [...unobservedTaxa.ids].map(id => unobservedTaxa.objects.get(id));
	}

	storageHandler() {
		let users = this.state.users;
		users.push({ name: this.state.user_id, title: this.state.user_id });
		const filteredUsers = Array.from(new Set(users.map(u => JSON.stringify(u)))).map(json => JSON.parse(json))
		Settings.set('users', filteredUsers);
		Settings.set('taxons', this.state.taxons);
		return { users: filteredUsers };
	}
	setFilename() {
		let filename='';
		filename= this.state.unobserved_by_user_id+"-";
		if (!!this.state.project_id) filename += this.state.project_id + "-"
		if (!!this.state.user_id) filename += this.state.user_id + "-"
		if (!!this.state.taxon && this.state.taxon.name !=='') filename += this.state.taxon.name + "-"
		if (!!this.state.quality_grade) filename += "quality_"+this.state.quality_grade+"-";
		filename += "missed_species.csv";
		this.setState({ filename: filename.replaceAll(/\s+/g, '_') });

	}
	render() {
		const disabled = this.state.loading || (this.state.unobserved_by_user_id === '' || (this.state.project_id === '' && this.state.user_id === ''));
		return (
			<Page title={I18n.t("Пропущенные виды")} className='page-listSpecies'>
				<Form onSubmit={this.submitHandler} disabled={disabled}>
				<fieldset>
					<legend>{I18n.t("Фильтрация")}</legend>
					<FormControl label={I18n.t("Id или имя пользователя")} type='text' name='unobserved_by_user_id' onChange={this.changeHandler}
						value={this.state.unobserved_by_user_id} list={this.state.users} clearDatalistHandler={this.clearDatalistHandler} listName="users">
					</FormControl>
					<FormControl label={I18n.t("Id или имя проекта для сравнения")} type='text' name='project_id' onChange={this.changeHandler}
						value={this.state.project_id} list={defaultProjects} />
					<FormControl label={I18n.t("Id или имя пользователя для сравнения")} type='text' name='user_id' onChange={this.changeHandler}
						value={this.state.user_id} list={this.state.users} clearDatalistHandler={this.clearDatalistHandler} listName="users">
					</FormControl>
					<FormControlTaxon label={I18n.t("Ограничиться таксоном")} name="taxon" onChange={this.changeHandler}
						value={this.state.taxon} list={this.state.taxons} listName="taxons" clearDatalistHandler={this.clearDatalistHandler}
						updateState={this.updateState}
						/>
					</fieldset>
					<fieldset>
						<legend>{I18n.t("Прочее")}</legend>
					<FormControlLimit handler={this.changeHandler} value={this.state.limit} />
					<FormControlCheckbox label={I18n.t("Выводить только виды")} name='species_only' onChange={this.checkHandler}
						checked={this.state.species_only} >
					</FormControlCheckbox>
					<FormControlSelect label={I18n.t("Статус наблюдения")} name="quality_grade" onChange={this.changeHandler}
						value={this.state.quality_grade} values={this.getValues("quality_grade")} />
					</fieldset>
					<fieldset>
						<legend>{I18n.t("Отображение")}</legend>
					<FormControlCSV handler={this.checkHandler} value={this.state.csv} />
					</fieldset>
		</Form>
				<Note>
					<TranslateJSX replace={[<br/>]}>
						pages.species-missed.note.text
					</TranslateJSX>
				</Note>
				<Loader title={this.state.loadingTitle} message={this.state.loadingMessage} show={this.state.loading}/>
				<Error {...this.state} />
				{!this.state.loading && !this.state.error &&
					<div className='result'>
						<TaxonsList taxons={this.state.data} d1={this.state.d1} d2={this.state.d2} project_id={this.state.project_id} user_id={this.state.user_id} csv={this.state.csv} />
					</div>
				}
			</Page>
		)
	}
}