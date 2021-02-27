import I18n from "../classes/I18n";
import Module from "../classes/Module";
import Page from "../mixins/Page";
import React from 'react'
import Form from "../mixins/Form";
import { FormControl, FormControlCheckbox, FormControlCSV, FormControlLimit, FormControlSelect, FormControlTaxon } from "../mixins/FormControl";
import Note from "../mixins/Note";
import Loader from "../mixins/Loader";
import Error from "../mixins/Error";
import defaultProjects from '../assets/projects.json';
import API from "../mixins/API";
// import Settings from "../mixins/Settings";
import ObservationsList from "../mixins/ObservationsList";
import Settings from "../mixins/Settings";

const title = I18n.t("Скачивание наблюдений");

export default class Downloader extends Module {
	constructor(props) {
		super(props);
		this.state = this.getDefaultSettings();
		this.state.lookupSuccess = false
		this.initSettings(["project_id", "projects", "taxon", "taxons", "user_id", "users", "place_id", "places",
			"d1", "d2", "limit", "quality_grade", "date_created", "current_ids", "hide_activity"
		], this.state);
		
		this.updateState = (state)=>this.setState(state);

		document.title = title;
	}

	async counter() {
		this.setState({ loadingTitle: "Загрузка наблюдений" });
		const { project_id, taxon, place_id, user_id, date_created, limit, d1, d2} = this.state;
		let customParams = {};
		if (this.state.species_only) customParams['hrank'] = 'species';
		if (!!this.state.quality_grade) customParams['quality_grade'] = this.state.quality_grade;
		if (!!project_id) customParams['project_id'] = project_id;
		if (!!user_id) customParams['user_id'] = user_id;
		if (!!place_id) customParams['place_id'] = place_id;

		const observations = await API.fetchObservations(taxon.id, d1, d2, date_created, limit, customParams, this.setStatusMessage);
		return [...observations.ids].map(id => observations.objects.get(id))
	}

	setFilename() {
		let filename = '';
		const prefix = !!this.date_created ? 'created_' : '';
		filename = this.state.taxon.id + "-"+this.state.taxon.name.toLowerCase().replaceAll(/\s/g,'_') + '-';
		if (!!this.state.project_id) filename += this.state.project_id + "-"
		if (!!this.state.place_id) filename += this.state.place_id + "-"
		if (!!this.state.user_id) filename += this.state.user_id + "-"
		if (!!this.state.d1) {
			filename += prefix+"from_" + this.state.d1 + "-";
		} 
		if (!!this.state.d2) {
			filename += prefix+"to_" + this.state.d2 + "-";
		}

		if (this.state.quality_grade.length > 0) filename += "quality_"+this.state.quality_grade+"-";
		if (!!this.state.current_ids) filename += "current_ids-";
		filename += "observations.csv";
		this.setState({ filename: filename });
	}

	storageHandler() {
		let users = this.state.users;
		users.push({ name: this.state.user_id, title: this.state.user_id });
		const filteredUsers = API.filterArray(users);
		Settings.set('users', filteredUsers);
		Settings.set('taxons', this.state.taxons);
		return { users: filteredUsers };
	}


	render() {
		const disabled = this.state.loading || (this.state.project_id === '' && this.state.taxon_id === '');
		return (
			<Page title={title}>
				<Form onSubmit={this.submitHandler} disabled={disabled}>
					<fieldset className='noborder'>
						<FormControlTaxon className='heading' label={I18n.t("Таксон")} name="taxon"
							value={this.state.taxon} list={this.state.taxons} listName="taxons" clearDatalistHandler={this.clearDatalistHandler}
							updateState={this.updateState }
						/>
						</fieldset>
					<fieldset>
						<legend>{I18n.t("Фильтрация")}</legend>
						<FormControl label='Id или имя проекта:' type='text' name='project_id' onChange={this.changeHandler}
							value={this.state.project_id} list={defaultProjects} >
						</FormControl>
						<FormControl label='Id или имя пользователя:' type='text' name='user_id' onChange={this.changeHandler}
							value={this.state.user_id} list={this.state.users} clearDatalistHandler={this.clearDatalistHandler} listName='users' />
						<FormControl label={I18n.t("Место")} type='text' name='place_id' onChange={this.changeHandler} value={this.state.place_id} list={this.state.places} clearDatalistHandler={this.clearDatalistHandler} listName='places'/>
					</fieldset>
					<fieldset>
						<legend>Настройки даты</legend>
						<FormControl label='Наблюдения после:' type='date' name='d1' onChange={this.changeHandler}
							value={this.state.d1} >
						</FormControl>
						<FormControl label='Наблюдения до:' type='date' name='d2' onChange={this.changeHandler}
							value={this.state.d2} >
						</FormControl>
						<FormControlCheckbox label='Дата загрузки' name='date_created' onChange={this.checkHandler}
							comment='Иначе дата рассматривается как дата наблюдения'
							checked={this.state.date_created} />
					</fieldset>
					<fieldset>
						<legend>{I18n.t("Прочее")}</legend>
						<FormControlLimit handler={this.changeHandler} value={this.state.limit} />
						<FormControlSelect label="Статус наблюдения" name="quality_grade" onChange={this.changeHandler} value={this.state.quality_grade}
							values={this.getValues("quality_grade")}
							/>
					</fieldset>
					<fieldset>
						<legend>{I18n.t("Отображение")}</legend>
						<FormControlCheckbox label='Не отображать отозванные определения' name='current_ids' onChange={this.checkHandler}
							checked={this.state.current_ids} />
						<FormControlCheckbox label='Показывать только наблюдения' name='hide_activity' onChange={this.checkHandler}
							checked={this.state.hide_activity} />
						<FormControlCSV handler={this.checkHandler} value={this.state.csv} />
					</fieldset>
				</Form>
				<Note defCollapsed={true}>
					В поле таксона можно вводить как цифровой идентификатор, так и название (латинское или русское). 
					Если введён не ID, скрипт, после потери полем фокуса ввода, попытается найти таксон в базе iNaturalist, и подставить наиболее подходящий (по мнению айната) вариант.
					<br/>В поле места требуется вводить только цифровой идентификатор.
					<br/>В поле проекта можно ввести либо цифровой, либо строковый id (можно скопировать из адресной строки браузера).

				</Note>
				<Loader title={this.state.loadingTitle} message={this.state.loadingMessage} show={this.state.loading} />
				<Error {...this.state} />
				{!this.state.loading && !this.state.error && !!this.state.data.length > 0 &&
					<div className='result'>
						<ObservationsList observations={this.state.data} csv={this.state.csv} hide_activity={this.state.hide_activity} current_ids={this.state.current_ids} filename={this.state.filename} />
					</div>
				}

			</Page>
		)
	}

}