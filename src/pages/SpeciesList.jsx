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
import Module from '../classes/Module';
import FormControlCheckbox from '../mixins/FormControlCheckbox';
export default class extends Module {
	constructor(props) {
		super(props);
		this.state = { loading: false, loadingTitle: null, loadingMessage: null, 
			error: null,
			project_id: "", user_id: '', limit: 0, csv: false,
			data: [],
			users: Settings.get('users',[])
		 };
		this.changeHandler = this.changeHandler.bind(this);
		this.checkHandler = this.checkHandler.bind(this);
		this.submitHandler = this.submitHandler.bind(this);
		this.counter = this.counter.bind(this);
		this.clearDatalistHandler = this.clearDatalistHandler.bind(this);
		this.setStatusMessage = this.setStatusMessage.bind(this);
		document.title='Виды проекта';
	}

	async counter () {
		const {project_id, user_id, limit} = this.state;
		this.setState({ loadingTitle: "Загрузка видов" });
		let customParams = {};
		if (limit > 0) customParams['limit'] = limit;
		let allTaxa = await API.fetchSpecies(project_id, user_id, null, null, this.setStatusMessage, customParams);

		this.setState({loadingTitle: "Обработка загруженных данных", loading: true});

		return [...allTaxa.ids].map(id => allTaxa.taxons[id]);

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
		const disabled = this.state.loading || (this.state.d1 === '' || (this.state.project_id === '' && this.state.user_id === ''));
		return (
			<Page title='Виды проекта' backlink='/' className='page-listSpecies'>
				<Form onSubmit={this.submitHandler} disabled={disabled}>
					<FormControl label='Id или имя проекта:' type='text' name='project_id' onChange={this.changeHandler}
						value={this.state.project_id} list={defaultProjects} />
					<FormControl label='Id или имя пользователя:' type='text' name='user_id' onChange={this.changeHandler}
						value={this.state.user_id} list={this.state.users} >
						{this.state.users.length > 0 && <button onClick={this.clearDatalistHandler} data-clear='users' type='btn' className='btn-small clear-datalist' title='Очистить сохранённые имена'><span role='img' aria-label='Clear'>❌</span></button>}
					</FormControl>
					<FormControl label='Лимит:' type='number' name='limit' onChange={this.changeHandler}
						value={this.state.limit} />
					<FormControlCheckbox label='Выводить в CSV' name='csv' onChange={this.checkHandler} checked={this.state.csv}></FormControlCheckbox>
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
						<TaxonsList taxons={this.state.data} d1={this.state.d1} d2={this.state.d2} project_id={this.state.project_id} user_id={this.state.user_id} csv={this.state.csv} />
					</div>
				}
			</Page>
		)
	}
}