import React from 'react'

import Page from '../mixins/Page'
import '../assets/Species.scss';

import API, { Settings } from '../mixins/API';
import Loader from '../mixins/Loader';
import Note from '../mixins/Note';
import TaxonsList from '../mixins/TaxonsList';
import defaultProjects from '../assets/projects.json'
import Error from '../mixins/Error';
import Form from '../mixins/Form';
import {FormControl, FormControlCheckbox, FormControlCSV, FormControlLimit } from '../mixins/FormControl';
import Module from '../classes/Module';
export default class extends Module {
	constructor(props) {
		super(props);
		this.state = this.getDefaultSettings();
		this.state.user_id_in = '';
		this.initSettings(["project_id","user_id","csv","limit", "species_only","rg", "users"], this.state);
	}

	async counter () {
		const {project_id, user_id, limit, user_id_in} = this.state;
		this.setState({ loadingTitle: "Загрузка видов"});
		let customParams = {};
		if (limit > 0) customParams['limit'] = limit;
		if (this.state.species_only) customParams['hrank'] = 'species';
		if (this.state.rg) customParams['quality_grade'] = 'research';
		let allTaxa = await API.fetchSpecies(project_id, user_id, null, null, this.setStatusMessage, customParams);
		this.setState({ loadingTitle: "Загрузка видов пользователя" });
		let userTaxa = await API.fetchSpecies(project_id, user_id_in, null, null, this.setStatusMessage, customParams);
		

		this.setState({loadingTitle: "Обработка загруженных данных"});
		return [...allTaxa.ids].filter(id => {
			return !userTaxa.ids.has(id);
		}).map(id => allTaxa.objects.get(id));
	}

	storageHandler() {
		let users = this.state.users;
		users.push({ name: this.state.user_id, title: this.state.user_id });
		const filteredUsers = Array.from(new Set(users.map(u => JSON.stringify(u)))).map(json => JSON.parse(json))
		Settings.set('users', filteredUsers);
		return { users: filteredUsers };
	}
	setFilename() {
		let filename='';
		filename= this.state.user_id_in+"-";
		if (!!this.state.project_id) filename += this.state.project_id + "-"
		if (!!this.state.user_id) filename += this.state.user_id + "-"
		if (!!this.state.rg) filename += "rg-";
		filename += "missed_species.csv";
		this.setState({ filename: filename });

	}
	render() {
		const disabled = this.state.loading || (this.state.user_id_in === '' || (this.state.project_id === '' && this.state.user_id === ''));
		return (
			<Page title='Пропущенные виды' className='page-listSpecies'>
				<Form onSubmit={this.submitHandler} disabled={disabled}>
					<FormControl label='Id или имя пользователя:' type='text' name='user_id_in' onChange={this.changeHandler}
						value={this.state.user_id_in} list={this.state.users} clearDatalistHandler={this.clearDatalistHandler} listName="users">
					</FormControl>
					<FormControl label='Id или имя проекта для сравнения:' type='text' name='project_id' onChange={this.changeHandler}
						value={this.state.project_id} list={defaultProjects} />
					<FormControl label='Id или имя пользователя для сравнения:' type='text' name='user_id' onChange={this.changeHandler}
						value={this.state.user_id} list={this.state.users} clearDatalistHandler={this.clearDatalistHandler} listName="users">
					</FormControl>
					<FormControlLimit handler={this.changeHandler} value={this.state.limit} />
					<FormControlCheckbox label='Выводить только виды' name='species_only' onChange={this.checkHandler}
						checked={this.state.species_only} >
					</FormControlCheckbox>
					<FormControlCheckbox label='Исследовательский статус' name='rg' onChange={this.checkHandler}
						checked={this.state.rg} >
					</FormControlCheckbox> 
					<FormControlCSV handler={this.checkHandler} value={this.state.csv} />
		</Form>
				<Note>
					Скрипт отображает все виды, пропущенные пользователем, в сравнении с другим пользователем или проектом <br/>
					В случае сравнения с проектом, показываются виды включённые в проект, не встреченные данным пользователем.
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