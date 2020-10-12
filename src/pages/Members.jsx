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
import Note from '../mixins/Note';
import Module from '../classes/Module';

const title = 'Участники проекта';
export default class extends Module {
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
		document.title = title;
	}

	async counter() {
		this.setState({ loadingTitle: "Загрузка участников" });
		const members = await API.fetchMembers(this.state.project_id, this.setStatusMessage);
		return { total: members.total, members: [...members.ids].map(id => members.users[id])};

	}

	storageHandler() {
		let projects = this.state.projects;
		if (!this.state.project_id) return;
		projects.push({ name: this.state.project_id, title: this.state.project_id });
		const filteredProjects = Array.from(new Set(projects.map(u => JSON.stringify(u)))).map(json => JSON.parse(json))
		Settings.set('projects', filteredProjects);
		return {projects: filteredProjects };
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
				<Note defCollapsed={false}>* API iNaturalist из-за каких-то ошибок в некоторых случаях возвращает неполный список подписчиков. Это проблема не данного скрипта, а получаемых им данных
				</Note>
				<Loader title={this.state.loadingTitle} message={this.state.loadingMessage} show={this.state.loading} />
				<Error {...this.state} />
				{!this.state.loading && !this.state.error &&
					<div className='result'>
						<UsersList users={this.state.data.members} total={this.state.data.total} csv={this.state.csv} />
					</div>
				}


			</Page>
		)
	}
}