import React from 'react'
import Page from '../../mixins/Page';
import API, { saveDatalist } from '../../mixins/API';
import { FormControl, FormControlCSV } from '../../mixins/Form/FormControl';
import defaultProjects from '../../assets/projects.json';
import { Loader } from 'mixins/Loader';
import { Error } from '../../mixins/Error';
import UsersList from '../../mixins/UsersList';
import { FormWrapper } from '../../mixins/Form/form-wrapper';
// import Note from '../mixins/Note';
import Module from '../../classes/Module';
import I18n from '../../classes/I18n';

export default class extends Module {
	constructor(props) {
		super(props);
		this.state = this.initDefaultSettings();
		this.initSettings(["project_id", "projects"], this.state);
	}

	async counter() {
		this.setState({ loadingTitle: I18n.t("Загрузка участников") });
		const members = await API.fetchMembers(this.state.project_id, this.setStatusMessage);
		return { total: members.total, members: [...members.ids].map(id => members.objects.get(id)) };

	}

	setFilename() {
		const filename = this.state.project_id + "-members.csv";
		this.setState({ filename: filename });
	}
	storageHandler() {
		return {
			projects: saveDatalist(this.state.project_id, this.state.project_id, this.state.projects, 'projects')
		};
	}

	render() {
		const disabled = this.state.loading || this.state.project_id === '';
		return (
			<Page title={I18n.t("Участники проекта")} className='page-members'>
				<FormWrapper onSubmit={this.submitHandler} disabled={disabled}>
					<fieldset className='noborder'>
						<FormControl label={I18n.t("Id или имя проекта")} type='text' name='project_id' onChange={this.changeHandler}
							value={this.state.project_id} list={defaultProjects} >
						</FormControl>
						<FormControlCSV handler={this.checkHandler} value={this.state.csv} />
					</fieldset>
				</FormWrapper>
				{/* <Note defCollapsed={false}>* API iNaturalist из-за каких-то ошибок в некоторых случаях возвращает неполный список подписчиков. Это проблема не данного скрипта, а получаемых им данных
				</Note> */}
				<Loader title={this.state.loadingTitle} message={this.state.loadingMessage} show={this.state.loading} />
				<Error {...this.state} />
				{!this.state.loading && !this.state.error &&
					<div className='result'>
						<UsersList users={this.state.data.members} total={this.state.data.total} csv={this.state.csv} filename={this.state.filename} />
					</div>
				}
			</Page>
		)
	}
}