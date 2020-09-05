import React from 'react'
import Page from './Page';
import API, { Settings } from '../mixins/API';
import FormControl from '../mixins/FormControl';
import defaultProjects from '../assets/projects.json'
import Loader from '../mixins/Loader';
import Error from '../mixins/Error';
import UsersList from '../mixins/UsersList';
import FormControlCheckbox from '../mixins/FormControlCheckbox';
import Form from '../mixins/Form';

const title = 'Участники проекта';
export default class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false, loadingTitle: null, loadingMessage: null,
			error: null,
			project_id: "",
			csv:false,
			data: [],
			projects: Settings.get('projects', [])
		};
		this.changeHandler = this.changeHandler.bind(this);
		this.checkHandler = this.checkHandler.bind(this);
		this.submitHandler = this.submitHandler.bind(this);
		this.counter = this.counter.bind(this);
		this.clearDatalistHandler = this.clearDatalistHandler.bind(this);
		this.setStatusMessage = this.setStatusMessage.bind(this);
		document.title = title;
	}

	async counter() {
		this.setState({ loadingTitle: "Загрузка участников" });
		const members = await API.fetchMembers(this.state.project_id, this.setStatusMessage);
		return [...members.ids].map(id => members.users[id]);

	}

	async submitHandler(e) {
		e.preventDefault();
		let projects = this.state.projects;
		projects.push({ name: this.state.project_id, title: this.state.project_id });
		const filteredProjects = Array.from(new Set(projects.map(u => JSON.stringify(u)))).map(json => JSON.parse(json))
		Settings.set('projects', filteredProjects);
		this.setState({ loading: true, data: [], projects: filteredProjects });

		this.counter().then((data) => {
			this.setState({ data, loading: false });
		}).catch(e => {
			console.dir('error')
			this.setState({ data: [], loading: false, error: e.message })
		})
	}

	changeHandler(e) {
		let newState = { error: null };
		newState[e.target.name] = e.target.value;
		this.setState(newState);
	}

	checkHandler(e) {
		let newState = {};
		newState[e.target.name] = e.target.checked;
		this.setState(newState);
	}
	clearDatalistHandler(e) {
		e.preventDefault();
		const name = e.currentTarget.dataset['clear'];
		const newState = {};
		newState[name] = [];
		this.setState(newState);
		Settings.set(name, []);
	}

	setStatusMessage(message) {
		this.setState({ loadingMessage: message });
	}


	render() {
		const disabled = this.state.loading || this.state.project_id === '';
		return (
			<Page title={title} backlink='/' className='page-members'>
				<Form onSubmit={this.submitHandler} disabled={disabled}>
					<FormControl label='Id или имя проекта:' type='text' name='project_id' onChange={this.changeHandler}
						value={this.state.project_id} list={defaultProjects} >
					</FormControl>
					<FormControlCheckbox label='Выводить в CSV' name='csv' onChange={this.checkHandler} checked={this.state.csv}></FormControlCheckbox>
				</Form>
				<Loader title={this.state.loadingTitle} message={this.state.loadingMessage} show={this.state.loading} />
				<Error {...this.state} />
				{!this.state.loading && !this.state.error &&
					<div className='result'>
						<UsersList users={this.state.data} csv={this.state.csv} />
					</div>
				}


			</Page>
		)
	}
}