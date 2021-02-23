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
import {FormControl, FormControlCSV, FormControlCheckbox, FormControlLimit, FormControlSelect} from '../mixins/FormControl';
import Module from '../classes/Module';
export default class extends Module {
	constructor(props) {
		super(props);
		this.state = this.getDefaultSettings();
		this.initSettings(["project_id","user_id","limit", "species_only","quality_grade", "contribution", "users"],this.state);
	}

	async counter () {
		const {project_id, user_id, limit, contribution} = this.state;
		this.setState({ loadingTitle: "Загрузка видов"});
		let customParams = {};
		if (limit > 0) customParams['limit'] = limit;
		if (this.state.species_only) customParams['hrank'] = 'species';
		console.dir(this.state.quality_grade)
		if (!!this.state.quality_grade) customParams['quality_grade'] = this.state.quality_grade;
		
		let allTaxa = await API.fetchSpecies(project_id, contribution ? '' : user_id, null, null, this.setStatusMessage, customParams);
		if (contribution) {
			this.setState({ loadingTitle: "Загрузка видов пользователя"});
			const userTaxa = await API.fetchSpecies(project_id, user_id, null, null, this.setStatusMessage, customParams);
			if (userTaxa.total === 0) return [];

			this.setState({ loadingTitle: "Обработка загруженных данных" });
			return [...userTaxa.ids].filter(id => {
				return !allTaxa.ids.has(id) || allTaxa.objects.get(id).count === userTaxa.objects.get(id).count;
			}).map(id => userTaxa.objects.get(id));

		}

		this.setState({loadingTitle: "Обработка загруженных данных"});

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
			<Page title='Виды проекта' className='page-listSpecies'>
				<Form onSubmit={this.submitHandler} disabled={disabled}>
					<FormControl label='Id или имя проекта:' type='text' name='project_id' onChange={this.changeHandler}
						value={this.state.project_id} list={defaultProjects} />
					<FormControl label='Id или имя пользователя:' type='text' name='user_id' onChange={this.changeHandler}
						value={this.state.user_id} list={this.state.users} clearDatalistHandler={this.clearDatalistHandler} listName="users" >
					</FormControl>
					<FormControlLimit handler={this.changeHandler} value={this.state.limit} />
					<FormControlCheckbox label='Выводить только виды' name='species_only' onChange={this.checkHandler}
						checked={this.state.species_only} >
					</FormControlCheckbox>
					<FormControlSelect label="Статус наблюдения" name="quality_grade" onChange={this.changeHandler} 
						value={this.state.quality_grade} values={this.getValues("quality_grade")}
					/>
					<FormControlCheckbox label='Виды, встреченные только этим пользователем' name='contribution' onChange={this.checkHandler}
						checked={this.state.contribution} >
					</FormControlCheckbox> 
					<FormControlCSV handler={this.checkHandler} value={this.state.csv} />
		</Form>
				<Note>
					Скрипт отображает все виды, отмеченные в проекте. Так же можно отобразить виды, которые наблюдал только указанный пользователь.
				</Note>
				<Loader title={this.state.loadingTitle} message={this.state.loadingMessage} show={this.state.loading}/>
				<Error {...this.state} />
				{!this.state.loading && !this.state.error &&
					<div className='result'>
						<TaxonsList taxons={this.state.data} d1={this.state.d1} d2={this.state.d2} project_id={this.state.project_id} user_id={this.state.user_id} csv={this.state.csv} filename={this.state.filename} />
					</div>
				}
			</Page>
		)
	}
}