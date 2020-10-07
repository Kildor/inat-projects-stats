import React from 'react'

import Page from './Page'
import '../assets/Species.scss';

import API, { Settings } from '../mixins/API';
import Loader from '../mixins/Loader';
import Note from '../mixins/Note';
import TaxonsList from '../mixins/TaxonsList';
import defaultProjects from '../assets/projects.json'
import Error from '../mixins/Error';
import Form from '../mixins/Form';
import FormControl from '../mixins/FormControl';
import FormControlCheckbox from '../mixins/FormControlCheckbox';
import Module from '../classes/Module';
export default class extends Module {
	constructor(props) {
		super(props);
		this.state = { loading: false, loadingTitle: null, loadingMessage: null, 
			error: null,
			project_id: "", user_id: '', 
			species_only: true, rg: false,
			data: [],
			users: Settings.get('users',[])
		 };
		this.changeHandler = this.changeHandler.bind(this);
		this.checkHandler = this.checkHandler.bind(this);
		this.submitHandler = this.submitHandler.bind(this);
		this.counter = this.counter.bind(this);
		this.clearDatalistHandler = this.clearDatalistHandler.bind(this);
		this.setStatusMessage = this.setStatusMessage.bind(this);
	}

	async counter () {
		const {project_id, user_id} = this.state;
		this.setState({ loadingTitle: "Загрузка видов пользователя" });
		let customParams = {};
		if (this.state.species_only) {
			customParams['hrank']='species';
		}
		if (this.state.rg) {
			customParams['quality_grade'] ='research';
		}
		const userTaxa = await API.fetchSpecies(project_id, user_id, null, null, this.setStatusMessage, customParams);
		if (userTaxa.total === 0) return [];
		this.setState({ loadingTitle: "Загрузка всех видов" });
		let allTaxa = [];
		// allTaxa = API.concatTaxons(await API.fetchSpecies(project_id, "", null, null, this.setStatusMessage, {'unobserved_by_user_id':user_id}));
		allTaxa = API.concatTaxons(await API.fetchSpecies(project_id, "", null, null, this.setStatusMessage, customParams));

		this.setState({loadingTitle: "Обработка загруженных данных", loading: true});
		let userTaxaFiltered = [...userTaxa.ids].filter(id=>{
			return !allTaxa.ids.has(id) || allTaxa.taxons[id].count === userTaxa.taxons[id].count;
			}).map(id => userTaxa.taxons[id]);

		return userTaxaFiltered;
	}

	async submitHandler(e) {
		e.preventDefault();
		let users = this.state.users;
		users.push({ name: this.state.user_id, title: this.state.user_id });
		const filteredUsers = Array.from(new Set(users.map(u => JSON.stringify(u)))).map(json => JSON.parse(json))
		Settings.set('users', filteredUsers);
		this.setState({loading: true, data:[], users: filteredUsers });
		this.setState({data:[] });
		this.counter().then((data)=>{
			this.setState({data, loading:false});
		}).catch(e=>{
			this.setState({data:[], loading:false,error: e.message})
		})
		return false;
	}
	
	render() {
		const disabled = this.state.loading || this.state.project_id === '' || this.state.user_id === '';
		return (
			<Page title='Вклад участника проекта' backlink='/' className='page-contribution'>
				<Form onSubmit={this.submitHandler} disabled={disabled}>
					<FormControl label='Id или имя проекта:' type='text' name='project_id' onChange={this.changeHandler}
						value={this.state.project_id} list={defaultProjects} />
					<FormControl label='Id или имя пользователя:' type='text' name='user_id' onChange={this.changeHandler}
						value={this.state.user_id} list={this.state.users} >
						{this.state.users.length > 0 && <button onClick={this.clearDatalistHandler} data-clear='users' type='btn' className='btn-small clear-datalist' title='Очистить сохранённые имена'><span role='img' aria-label='Clear'>❌</span></button>}
					</FormControl>
					{/* <FormControl label='Дата загрузки наблюдений (с которой считать новые виды):' type='date' name='d1' onChange={this.changeHandler}
						value={this.state.d1} >
					</FormControl>
					<FormControl label='Дата загрузки наблюдений (по которую считать новые виды):' type='date' name='d2' onChange={this.changeHandler}
						value={this.state.d2} >
					</FormControl>*/}
					<FormControlCheckbox label='Учитывать только виды' name='species_only' onChange={this.checkHandler}
						checked={this.state.species_only} >
					</FormControlCheckbox> 
					<FormControlCheckbox label='Исследовательский статус' name='rg' onChange={this.checkHandler}
						checked={this.state.rg} >
					</FormControlCheckbox> 
					
				</Form>
				<Note>Скрипт показывает виды проекта, которые наблюдал только указанный пользователь.</Note>
				<Loader title={this.state.loadingTitle} message={this.state.loadingMessage} show={this.state.loading}/>
				<Error {...this.state} />
				{!this.state.loading && !this.state.error &&
					<div className='result'>
						<TaxonsList taxons={this.state.data} d1={this.state.d1} d2={this.state.d2} project_id={this.state.project_id} user_id={this.state.user_id} />
					</div>
				}
			</Page>
		)
	}
}