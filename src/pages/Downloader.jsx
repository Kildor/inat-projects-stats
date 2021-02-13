import I18n from "../classes/I18n";
import Module from "../classes/Module";
import Page from "../mixins/Page";
import React from 'react'
import Form from "../mixins/Form";
import { FormControl, FormControlCheckbox, FormControlCSV, FormControlLimit } from "../mixins/FormControl";
import Note from "../mixins/Note";
import Loader from "../mixins/Loader";
import Error from "../mixins/Error";
import defaultProjects from '../assets/projects.json';
import ButtonClear from "../mixins/ButtonClear";
import API from "../mixins/API";
import Settings from "../mixins/Settings";


const title = I18n.t("Скачивание наблюдений");

export default class Downloader extends Module {
	constructor(props) {
		super(props);
		this.state = this.getDefaultSettings();
		this.state.lookupSuccess = false
		this.initSettings(["project_id", "projects", "taxon_name", "taxon_id", "taxons", "user_id", "users", "place_id", "places",
			"d1", "d2", "limit", "rg"
	], this.state);
		this.changeTaxonHandler = this.changeTaxonHandler.bind(this);
		document.title = title;
	}
	async changeTaxonHandler(e) {
		this.setState({loading: true, loadingTitle: I18n.t("Поиск ID вида") });
		const regexp = /[0-9]+/;
		const taxonName = e.target.value.toLowerCase();
		// if (this.state.taxon_name===taxonName) return;
		// const name = e.target.name;
		this.setState({taxon_name: taxonName});
		let id = taxonName;
		if (!taxonName.match(regexp)) {
			id = await API.lookupTaxon(taxonName);
		}
		this.setState({taxon_id:id, lookupSuccess: id !==0});
		if (id===0) {
		this.setState({ loadingTitle: I18n.t("Поиск не удался, проверьте корректность введёного имени") });
		} else {
			this.setState({ loading: false});
		}
	}

	async counter() {
		this.setState({ loadingTitle: "Загрузка наблюдений" });
		const { project_id, taxon_id, user_id, place_id, d1, d2, limit, rg} = this.state;
		const observations = API.fetchObservations(taxon_id, project_id, user_id, place_id, d1, d2, limit, rg);
		console.dir(this.state);
		return [];
	}

	render() {
		const disabled = this.state.loading || ( this.state.project_id === '' && this.state.taxon_id === '');
		return (
			<Page title={title}>
				{/* {JSON.stringify(this.state)} */}
				<Form onSubmit={this.submitHandler} disabled={disabled}>
					<FormControl label={I18n.t("Таксон")} type='text' name='taxon_name' onBlur={this.changeTaxonHandler} onChange={this.changeHandler} 
					value={this.state.taxon_name} list={this.state.taxons} clearDatalistHandler={this.clearDatalistHandler} listName="taxons">
						{this.state.taxon_id !== "" && this.state.taxon_name !== "" ? (
							this.state.lookupSuccess ? <a href={`https://www.inaturalist.org/taxa/${this.state.taxon_id}`} target='_blank' rel='noopener noreferrer'><span role='img' aria-label='success'>✔</span></a>
								: <span role='img' aria-label='fail'>⚠️</span>
						) : null}
					</FormControl>
					<fieldset>
						<legend>{I18n.t("Фильтрация")}</legend>
					<FormControl label='Id или имя проекта:' type='text' name='project_id' onChange={this.changeHandler}
						value={this.state.project_id} list={defaultProjects} >
					</FormControl>
					<FormControl label='Id или имя пользователя:' type='text' name='user_id' onChange={this.changeHandler}
						value={this.state.user_id} list={this.state.users} >
						{!!this.state.users && this.state.users.length > 0 && <ButtonClear onClickHandler={this.clearDatalistHandler} listName='users'></ButtonClear>}
						</FormControl>
					<FormControl label={I18n.t("Место")} type='text' name='place_id' onChange={this.changeHandler} value={this.state.place_id} list={this.state.places}>
						{!!this.state.places && this.state.places.length > 0 && <ButtonClear onClickHandler={this.clearDatalistHandler} listName='places' />}
					</FormControl>
					</fieldset>
					<fieldset>
						<legend>Настройки даты</legend>
					<FormControl label='Наблюдения после:' type='date' name='d1' onChange={this.changeHandler}
						value={this.state.d1} >
					</FormControl>
					<FormControl label='Наблюдения до:' type='date' name='d2' onChange={this.changeHandler}
						value={this.state.d2} >
					</FormControl>
					<FormControlCheckbox label={<>Дата загрузки<br /><small>иначе дата рассматривается как дата наблюдения</small></>} name='date_upload' onChange={this.checkHandler}
						checked={this.state.date_upload} />
					</fieldset>
					<fieldset>
						<legend>{I18n.t("Прочее")}</legend>
					<FormControlLimit handler={this.changeHandler} value={this.state.limit} />
					<FormControlCheckbox label='Исследовательский статус' name='rg' onChange={this.checkHandler}
						checked={this.state.rg} />

					<FormControlCSV handler={this.checkHandler} value={this.state.csv} />
					</fieldset>
				</Form>
				<Note defCollapsed={false}></Note>
				<Loader title={this.state.loadingTitle} message={this.state.loadingMessage} show={this.state.loading} />
				<Error {...this.state} />
				{!this.state.loading && !this.state.error && !!this.state.data.length > 0 && 
					<div className='result'>
						{JSON.stringify(this.state.data)}
						{/* <UsersList users={this.state.data.members} total={this.state.data.total} csv={this.state.csv} filename={this.state.filename} /> */}
					</div>
				}

			</Page>
		)
	}

}