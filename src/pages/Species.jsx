import React from 'react'

import Page from './Page'
import '../assets/Species.scss';

import API, { Settings } from '../mixins/API';
import Loader from '../mixins/Loader';
import Note from '../mixins/Note';
import TaxonsList from '../mixins/TaxonsList';
import defaultProjects from '../assets/projects.json'
import FormControl from '../mixins/FormControl.jsx'
export default class extends React.Component {
	constructor(props) {
		super(props);
		this.state = { loading: false, loadingTitle: null, loadingMessage: null, 
			d1: "2020-06-01", d2:'', project_id: "", user_id: '',
			data: [],
			users: Settings.get('users',[])
		 };
		this.changeHandler = this.changeHandler.bind(this);
		this.submitHandler = this.submitHandler.bind(this);
		this.counter = this.counter.bind(this);
		this.clearDatalistHandler = this.clearDatalistHandler.bind(this);
		this.setStatusMessage = this.setStatusMessage.bind(this);
		document.title='Новые виды проекта';
	}

	changeHandler(e) {
		let newState = {};
		newState[e.target.name] = e.target.value;
		this.setState(newState);
	}
	clearDatalistHandler(e) {
		e.preventDefault();
		const name = e.currentTarget.dataset['clear'];
		const newState = {};
		console.dir(name)
		newState[name]=[];
		this.setState(newState);
		Settings.set(name, []);


	}

	async counter () {
		const {project_id, user_id, d1, d2} = this.state;
		this.setState({ loadingTitle: "Загрузка новых видов" });
		const newTaxa = await API.fetchSpecies(project_id, user_id, d1, d2, this.setStatusMessage);
		if (newTaxa.total === 0) return [];
		this.setState({ loadingTitle: "Загрузка всех видов" });
		let allTaxa = [];
		if (d1 !== '') {
			const alld2 = new Date(d1);
			alld2.setDate(alld2.getDate() - 1);
			allTaxa = API.concatTaxons(await API.fetchSpecies(project_id, user_id, null, alld2.toISOString().substring(0, 10), this.setStatusMessage));
		}
		if (d2 !== '') {
			const alld1 = new Date(d2);
			alld1.setDate(alld1.getDate() + 1);
			allTaxa = API.concatTaxons(allTaxa, await API.fetchSpecies(project_id, user_id, alld1.toISOString().substring(0, 10), null, this.setStatusMessage));
		}
		console.dir(allTaxa);
		console.dir(newTaxa);


		this.setState({loadingTitle: "Обработка загруженных данных", loading: true});

		// let newTaxaFiltered = newTaxa.ids.filter((id) => {
		// 	return !allTaxa.taxons[id];
		// }).map(id => newTaxa.taxons[id]);

		let newTaxaFiltered = [...newTaxa.ids].filter(id=>!allTaxa.ids.has(id)).map(id => newTaxa.taxons[id]);

		return newTaxaFiltered;
	}

	setStatusMessage (message) {
		this.setState({loadingMessage: message});
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
		})
	}
	
	render() {
		const disabled = this.state.loading || (this.state.d1 === '' || (this.state.project_id === '' && this.state.user_id === ''));
		return (
			<Page title='Новые виды проекта' backlink='/' className='page-newSpecies'>
				<form onSubmit={this.submitHandler} disabled={disabled}>
					<fieldset>
						<FormControl title='Id или имя проекта:' type='text' name='project_id' onChange={this.changeHandler}
							value={this.state.project_id} list={defaultProjects} >
						</FormControl>
						<FormControl title='Id или имя пользователя:' type='text' name='user_id' onChange={this.changeHandler}
							value={this.state.user_id} list={this.state.users} >
							{this.state.users.length > 0 && <button onClick={this.clearDatalistHandler} data-clear='users' type='btn' className='btn-small clear-datalist' title='Очистить сохранённые имена'><span role='img' aria-label='Clear'>❌</span></button>}
						</FormControl>
						<FormControl title='Дата загрузки наблюдений (с которой считать новые виды):' type='date' name='d1' onChange={this.changeHandler}
							value={this.state.d1} >
						</FormControl>
						<FormControl title='Дата загрузки наблюдений (по которую считать новые виды):' type='date' name='d2' onChange={this.changeHandler}
							value={this.state.d2} >
						</FormControl>
					</fieldset>
					<button disabled={disabled} type='submit'>Запустить</button>
				</form>
				<Note/>
				<Loader title={this.state.loadingTitle} message={this.state.loadingMessage} show={this.state.loading}/>
				{!this.state.loading &&
					<div className='result'>
						<TaxonsList taxons={this.state.data} d1={this.state.d1} d2={this.state.d2} project_id={this.state.project_id} user_id={this.state.user_id} />
					</div>
				}
			</Page>
		)
	}
}