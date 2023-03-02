import React from 'react'

import Page from '../mixins/Page'
import '../assets/Species.scss';

import API, { saveDatalist } from '../mixins/API';
import { Settings } from "../mixins/Settings";
import { Loader } from 'mixins/Loader';
import TaxonsList from '../mixins/TaxonsList';
import { Error } from '../mixins/Error';
import Form from '../mixins/Form/Form';
import {FormControl, FormControlCheckbox, FormControlCSV, FormControlLimit, FormControlSelect, FormControlTaxon } from '../mixins/Form/FormControl';
import Module from '../classes/Module';
import I18n from '../classes/I18n';
import { TranslateJSX } from '../mixins/Translation';
export default class SpeciesMissed extends Module {
	constructor(props) {
		super(props);
		this.state = this.initDefaultSettings();
		this.state.unobserved_by_user_id = '';
		this.state.additional = '';
		this.initSettings(["project_id","user_id","csv","limit", "species_only","quality_grade", "users", "projects", "taxon","taxons", "place_id", "places"], this.state);
		this.updateState = this.setState.bind(this);
		this.swapStateValues = this.swapStateValues.bind(this);
	}

	infoText = <TranslateJSX replace={[<br />]}>
		pages.species-missed.note.text
	</TranslateJSX>
	async counter () {
		const {project_id, taxon, place_id, user_id, additional, limit, unobserved_by_user_id} = this.state;
		let customParams = {};
		if (limit > 0) customParams['limit'] = limit;
		if (!!taxon && taxon.id > 0) customParams['taxon_id'] = taxon.id;
		if (!!place_id && !isNaN(parseInt(place_id.trim()))) customParams['place_id'] = place_id.trim();
		if (this.state.species_only) {
			customParams['lrank'] = 'species';
			customParams['hrank'] = 'species';
		}
		if (!!this.state.quality_grade) customParams['quality_grade'] = this.state.quality_grade;

		if (!!additional) {
			additional.split('&').forEach(param => {
				param = param.split('=');
				if (param.length === 2) customParams[param[0]] = param[1];
			});
		}

		this.setState({ loadingTitle: I18n.t("Загрузка видов") });

		// unobserved_by_user_id excludes all taxons, not only included to the project
		if (!project_id && !place_id) {
			customParams['unobserved_by_user_id'] = unobserved_by_user_id;
			const unobservedTaxa = await API.fetchSpecies(null, user_id, null, null, false, this.setStatusMessage, customParams);

			return [...unobservedTaxa.ids].map(id => unobservedTaxa.objects.get(id));
		}

		const unobservedTaxa = await API.fetchSpecies(project_id, user_id, null, null, false, this.setStatusMessage, customParams);

		this.setState({ loadingTitle: I18n.t("Загрузка видов пользователя") });
		
		const observedTaxa = await API.fetchSpecies(project_id, unobserved_by_user_id, null, null, false, this.setStatusMessage, customParams);


		return [...unobservedTaxa.ids].filter(id => !observedTaxa.ids.has(id)).map(id => unobservedTaxa.objects.get(id));
	}

	storageHandler() {
		Settings.set('taxons', this.state.taxons);
		return {
			users: saveDatalist(this.state.user_id, this.state.user_id, this.state.users, 'users'),
			projects: saveDatalist(this.state.project_id, this.state.project_id, this.state.projects, 'projects'),
			places: saveDatalist(this.state.place_id, this.state.place_id, this.state.places, 'places')
		};
	}
	setFilename() {
		let filename='';
		filename= this.state.unobserved_by_user_id+"-";
		if (!!this.state.project_id) filename += this.state.project_id + "-"
		if (!!this.state.user_id) filename += this.state.user_id + "-"
		if (!!this.state.place_id) filename += this.state.place_id + "-"
		if (!!this.state.taxon && this.state.taxon.name !=='') filename += this.state.taxon.name + "-"
		if (!!this.state.quality_grade) filename += "quality_"+this.state.quality_grade+"-";
		filename += "missed_species.csv";
		this.setState({ filename: filename.replaceAll(/\s+/g, '_') });

	}

	swapStateValues(state1, state2) {
		this.setState(prevState => ({
			[state1]: prevState[state2],
			[state2]: prevState[state1],
		}));
	}

	render() {
		const disabled = this.state.loading || (this.state.unobserved_by_user_id === '' || (this.state.project_id === '' && this.state.user_id === '' && this.state.place_id === ''));
		return (
			<Page title={I18n.t("Пропущенные виды")} className='page-listSpecies' infoText={this.infoText}>
				<Form onSubmit={this.submitHandler} disabled={disabled}>
				<fieldset>
					<legend>{I18n.t("Фильтрация")}</legend>
					<FormControl label={I18n.t("Id или имя пользователя")} type='text' name='unobserved_by_user_id' onChange={this.changeHandler}
						value={this.state.unobserved_by_user_id} list={this.state.users} clearDatalistHandler={this.clearDatalistHandler} listName="users">
					</FormControl>
						<span tabIndex='0' className='icon-swap' role='button' onClick={() => { this.swapStateValues('unobserved_by_user_id', 'user_id'); return false}} >⇅</span>
					<FormControl label={I18n.t("Id или имя пользователя для сравнения")} type='text' name='user_id' onChange={this.changeHandler}
						value={this.state.user_id} list={this.state.users} clearDatalistHandler={this.clearDatalistHandler} listName="users">
					</FormControl>
					<FormControl label={I18n.t("Id или имя проекта для сравнения")} type='text' name='project_id' onChange={this.changeHandler}
						value={this.state.project_id} list={this.state.projects} listName='projects' />
					<FormControl label={I18n.t("Id места для сравнения")} type='text' name='place_id' onChange={this.changeHandler} value={this.state.place_id} list={this.state.places} clearDatalistHandler={this.clearDatalistHandler} listName='places' comment={I18n.t("В поле места требуется вводить только цифровой идентификатор.")} />
					<FormControlTaxon label={I18n.t("Ограничиться таксоном")} name="taxon" onChange={this.changeHandler}
						value={this.state.taxon} list={this.state.taxons} listName="taxons" clearDatalistHandler={this.clearDatalistHandler}
						updateState={this.updateState}
						/>
					</fieldset>
					<fieldset>
						<legend>{I18n.t("Прочее")}</legend>
					<FormControlLimit handler={this.changeHandler} value={this.state.limit} />
					<FormControlCheckbox label={I18n.t("Выводить только виды")} name='species_only' onChange={this.checkHandler}
						checked={this.state.species_only} >
					</FormControlCheckbox>
					<FormControlSelect label={I18n.t("Статус наблюдения")} name="quality_grade" onChange={this.changeHandler}
						value={this.state.quality_grade} values={this.getValues("quality_grade")} />
						<FormControl label={I18n.t("Дополнительные параметры")} type='text' name='additional' onChange={this.changeHandler}
							value={this.state.additional} ></FormControl>
					</fieldset>
					<fieldset>
						<legend>{I18n.t("Отображение")}</legend>
					<FormControlCSV handler={this.checkHandler} value={this.state.csv} />
					</fieldset>
		</Form>
				<Loader title={this.state.loadingTitle} message={this.state.loadingMessage} show={this.state.loading}/>
				<Error {...this.state} />
				{!this.state.loading && !this.state.error &&
					<div className='result'>
						<TaxonsList taxons={this.state.data} d1={this.state.d1} d2={this.state.d2} project_id={this.state.project_id} user_id={this.state.user_id} place_id={this.state.place_id} csv={this.state.csv} />
					</div>
				}
			</Page>
		)
	}
}
