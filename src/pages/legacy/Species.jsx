import React from 'react'

import Page from '../../mixins/Page'
import API, { saveDatalist } from 'mixins/API';
import TaxonsList from 'mixins/TaxonsList';
import { Error } from 'mixins/Error';
import { FormWrapper } from 'mixins/Form/form-wrapper';
import Module from 'classes/Module';
import I18n from 'classes/I18n';
import { FormControl, FormControlCheckbox, FormControlCSV, FormControlSelect, FormControlTaxon } from '../../mixins/Form/FormControl';
import { DataControlsBlock } from 'mixins/Form/FormControlSets';
import { Loader } from 'mixins/Loader';
import { Settings } from 'classes/settings';

export default class Species extends Module {
	constructor(props) {
		super(props);
		this.state = this.initDefaultSettings();
		this.initSettings(["project_id", "user_id", "taxon", "csv", "limit", "show_first", "d1", "d2", "date_created", "species_only", "quality_grade",
			"strategy",
			"users", "projects", "taxons"], this.state, {
			"date_created": true
		});
		this.updateState = this.setState.bind(this);
	}

	strategy = [
		['list', "Списком"],
		['daily', "Ежедневно"],
	];

	counter() {
		const { strategy } = this.state;
		switch (strategy) {
			case 'daily':
			case 'list':
			default:
				return this.counterList();
		}
	}

	async counterDaily() {
		const { project_id, user_id, d1, d2, date_created, species_only, taxon } = this.state;
		this.setState({ loadingTitle: I18n.t("Загрузка новых видов") });
		const customParams = {};
		if (species_only) {
			customParams['lrank'] = 'species';
			customParams['hrank'] = 'species';
		}
		if (!!taxon && taxon.id > 0) customParams['taxon_id'] = taxon.id;


	}
	async counterList() {
		const { project_id, user_id, d1, d2, date_created, show_first, species_only, taxon } = this.state;
		this.setState({ loadingTitle: I18n.t("Загрузка новых видов") });
		const customParams = {};
		if (species_only) {
			customParams['lrank'] = 'species';
			customParams['hrank'] = 'species';
		}
		if (!!taxon && taxon.id > 0) customParams['taxon_id'] = taxon.id;
		if (!!this.state.quality_grade) customParams['quality_grade'] = this.state.quality_grade;

		const newTaxa = await API.fetchSpecies(project_id, user_id, d1, d2, date_created, this.setStatusMessage, customParams);
		if (newTaxa.total === 0) return [];
		this.setState({ loadingTitle: I18n.t("Загрузка всех видов") });
		let allTaxa = [];
		if (d1 !== '') {
			const alld2 = new Date(d1);
			alld2.setDate(alld2.getDate() - 1);
			allTaxa = API.concatTaxons(await API.fetchSpecies(project_id, user_id, null, alld2.toISOString().substring(0, 10), date_created, this.setStatusMessage, customParams));
		}
		if (d2 !== '' && !show_first) {
			const alld1 = new Date(d2);
			alld1.setDate(alld1.getDate() + 1);
			allTaxa = API.concatTaxons(allTaxa, await API.fetchSpecies(project_id, user_id, alld1.toISOString().substring(0, 10), null, date_created, this.setStatusMessage, customParams));
		}
		// console.dir(allTaxa);
		// console.dir(newTaxa);


		this.setState({ loadingTitle: I18n.t("Обработка загруженных данных"), loading: true });

		// let newTaxaFiltered = newTaxa.ids.filter((id) => {
		// 	return !allTaxa.taxons[id];
		// }).map(id => newTaxa.taxons[id]);

		let newTaxaFiltered = [...newTaxa.ids].filter(id => !allTaxa.ids.has(id)).map(id => newTaxa.objects.get(id));

		return newTaxaFiltered;
	}

	setFilename() {
		let filename = "";
		filename += this.state.project_id + "-";
		if (!!this.state.user_id) filename += this.state.user_id + "-";
		if (!!this.state.d1) filename += "from_" + this.state.d1 + "-";
		if (!!this.state.d2) filename += "to_" + this.state.d2 + "-";
		if (!!this.state.show_first) filename += "first-";
		filename += "new_species.csv";
		this.setState({ filename: filename });
	}

	storageHandler() {
		Settings.set('taxons', this.state.taxons);
		return {
			users: saveDatalist(this.state.user_id, this.state.user_id, this.state.users, 'users'),
			projects: saveDatalist(this.state.project_id, this.state.project_id, this.state.projects, 'projects')
		};
	}
	render() {
		const disabled = this.state.loading || (this.state.d1 === '' || (this.state.project_id === '' && this.state.user_id === ''));
		return (
			<Page title={I18n.t('Новые виды проекта')} className='page-newSpecies' infoText={I18n.t("pages.species.note.text")}>
				<FormWrapper onSubmit={this.submitHandler} disabled={disabled}>
					<fieldset>
						<legend>{I18n.t("Фильтрация")}</legend>
						<FormControl label={I18n.t("Id или имя проекта")} type='text' name='project_id' onChange={this.changeHandler}
							value={this.state.project_id} list={this.state.projects} />
						<FormControl label={I18n.t("Id или имя пользователя")} type='text' name='user_id' onChange={this.changeHandler}
							value={this.state.user_id} list={this.state.users} clearDatalistHandler={this.clearDatalistHandler} listName="users">
						</FormControl>
						<FormControlTaxon label={I18n.t("Ограничиться таксоном")} name="taxon" onChange={this.changeHandler}
							value={this.state.taxon} list={this.state.taxons} listName="taxons" clearDatalistHandler={this.clearDatalistHandler}
							updateState={this.updateState}
						/>
						<FormControlCheckbox label={I18n.t("Выводить только виды")} name='species_only' onChange={this.checkHandler}
							checked={this.state.species_only} />
						<FormControlSelect label={I18n.t("Статус наблюдения")} name="quality_grade" onChange={this.changeHandler}
							value={this.state.quality_grade} values={this.getValues("quality_grade")}
						/>
						<FormControl label={I18n.t("Дополнительные параметры")} type='text' name='additional' onChange={this.changeHandler}
							value={this.state.additional} ></FormControl>
					</fieldset>
					<DataControlsBlock checkHandler={this.checkHandler} changeHandler={this.changeHandler} state={this.state} >
					{this.state.d2 && <FormControlCheckbox label={I18n.t("Показывать виды, впервые зарегистрированные в этот период")} name='show_first' onChange={this.checkHandler}
							checked={this.state.show_first} />}
					</DataControlsBlock>
					<fieldset>
						<legend>{I18n.t("Прочее")}</legend>
						<FormControlSelect label={I18n.t("Стратегия построения списка")} name="strategy" onChange={this.changeHandler} value={this.state.strategy}
							values={this.strategy}
						/>
					</fieldset>
					<fieldset>
						<legend>{I18n.t("Отображение")}</legend>
						<FormControlCSV handler={this.checkHandler} value={this.state.csv} />
					</fieldset>
				</FormWrapper>
				<Loader title={this.state.loadingTitle} message={this.state.loadingMessage} show={this.state.loading} />
				<Error {...this.state} />
				{!this.state.loading && !this.state.error &&
					<div className='result'>
						<TaxonsList taxons={this.state.data} d1={this.state.d1} d2={this.state.d2} date_created={this.state.date_created} project_id={this.state.project_id} user_id={this.state.user_id} csv={this.state.csv} filename={this.state.filename} />
					</div>
				}
			</Page>
		)
	}
}