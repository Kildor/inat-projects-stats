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
			d1: "2020-06-01", d2:'', project_id: "", user_id: '',
			show_first: false,
			data: [],
			users: Settings.get('users',[])
		 };
		// document.title='Новые виды проекта';
	}

	async counter () {
		const {project_id, user_id, d1, d2, show_first} = this.state;
		this.setState({ loadingTitle: "Загрузка новых видов" });
		const newTaxa = await API.fetchSpecies(project_id, user_id, d1, d2, this.setStatusMessage);
		if (newTaxa.total === 0) return [];
		this.setState({ loadingTitle: "Загрузка всех видов" });
		let allTaxa = [];
		if (d1 !== '') {
			const alld2 = new Date(d1);
			alld2.setDate(alld2.getDate() - 1);
			// allTaxa = await API.fetchSpecies(project_id, user_id, null, alld2.toISOString().substring(0, 10), this.setStatusMessage);
			allTaxa = API.concatTaxons(await API.fetchSpecies(project_id, user_id, null, alld2.toISOString().substring(0, 10), this.setStatusMessage));
		}
		if (d2 !== '' && !show_first) {
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

	storageHandler() {
		let users = this.state.users;
		users.push({ name: this.state.user_id, title: this.state.user_id });
		const filteredUsers = Array.from(new Set(users.map(u => JSON.stringify(u)))).map(json => JSON.parse(json))
		Settings.set('users', filteredUsers);
		return {users: filteredUsers };
	}

	
	render() {
		const disabled = this.state.loading || (this.state.d1 === '' || (this.state.project_id === '' && this.state.user_id === ''));
		return (
			<Page title='Новые виды проекта' backlink='/' className='page-newSpecies'>
				<Form onSubmit={this.submitHandler} disabled={disabled}>
					<FormControl label='Id или имя проекта:' type='text' name='project_id' onChange={this.changeHandler}
						value={this.state.project_id} list={defaultProjects} />
					<FormControl label='Id или имя пользователя:' type='text' name='user_id' onChange={this.changeHandler}
						value={this.state.user_id} list={this.state.users} >
						{this.state.users.length > 0 && <button onClick={this.clearDatalistHandler} data-clear='users' type='btn' className='btn-small clear-datalist' title='Очистить сохранённые имена'><span role='img' aria-label='Clear'>❌</span></button>}
					</FormControl>
					<FormControl label='Дата загрузки наблюдений (с которой считать новые виды):' type='date' name='d1' onChange={this.changeHandler}
						value={this.state.d1} >
					</FormControl>
					<FormControl label='Дата загрузки наблюдений (по которую считать новые виды):' type='date' name='d2' onChange={this.changeHandler}
						value={this.state.d2} >
					</FormControl>
					<FormControlCheckbox label='Показывать виды, впервые зарегистрированные в этот период' name='show_first' onChange={this.checkHandler}
						checked={this.state.show_first} >
					</FormControlCheckbox>
					
				</Form>
				<Note>
					Скрипт выбирает все виды из проекта, загруженные на сайт до выбранной даты (Дата создания), выбирает все виды, загруженные после выбранной даты,
					после чего сравнивает списки и оставляет только новые. К сожалению, API iNaturalist не даёт возможности выбрать виды, добавленные в проект относительно даты,
					поэтому если в требованиях проекта выставлен "Исследовательский статус", есть вероятность того, что наблюдение, добавленное раньше указанной даты, было добавлено в проект уже после неё,
					но при этом в списке его не будет. Аналогично с теми наблюдениями, которые были переопределены после указанной даты.
				</Note>
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