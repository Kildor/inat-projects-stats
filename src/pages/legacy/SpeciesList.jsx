import React from 'react'

import Page from '../../mixins/Page'
import API, { fillDateParams, saveDatalist } from '../../mixins/API';
import { Loader } from 'mixins/Loader';
import TaxonsList from '../../mixins/TaxonsList';
import { Error } from '../../mixins/Error';
import { FormWrapper } from '../../mixins/Form/form-wrapper';
import { FormControl, FormControlCSV, FormControlCheckbox, FormControlLimit, FormControlSelect, FormControlTaxon } from '../../mixins/Form/FormControl';
import Module from '../../classes/Module';
import I18n from '../../classes/I18n';
import { DataControlsBlock } from '../../mixins/Form/FormControlSets';

class SpeciesList extends Module {
	constructor(props) {
		super(props);
		this.state = this.initDefaultSettings();
		this.state.additional = '';
		this.initSettings(["project_id", "user_id", "place_id", "taxon", "limit", "species_only", "quality_grade", "contribution", "users", "projects", "taxons", "places", "d1", "d2", "date_created", "date_any"], this.state, {
			date_any: true
		});
		this.updateState = this.setState.bind(this);
	}

	async counter() {
		const { project_id, user_id, place_id, limit, species_only, additional, taxon } = this.state;
		let {contribution} = this.state;
		if (!!user_id && !project_id && !place_id) {
			contribution = '0';
		}
		
		this.setState({ loadingTitle: I18n.t("Загрузка видов") });
		let customParams = { ...fillDateParams(this.state) };
		
		if (!!taxon && taxon.id > 0) customParams['taxon_id'] = taxon.id;
		if (!!additional) {
			additional.split('&').forEach(param => {
				param = param.split('=');
				if (param.length === 2) customParams[param[0]] = param[1];
			});
		}

		if (limit > 0) customParams['limit'] = limit;
		if (species_only) {
			customParams['lrank'] = 'species';
			customParams['hrank'] = 'species';
		}
		if (!!this.state.quality_grade) customParams['quality_grade'] = this.state.quality_grade;
		if (!!place_id) customParams['place_id'] = place_id;

		if (contribution === '3' && user_id !== '') {
			customParams['unobserved_by_user_id'] = user_id;
			let allTaxa = await API.fetchSpecies(project_id, null, null, null, false, this.setStatusMessage, customParams);

			return [...allTaxa.ids].map(id => allTaxa.objects.get(id));
		}

		let allTaxa = await API.fetchSpecies(project_id, contribution !== '0' ? '' : user_id, null, null, false, this.setStatusMessage, customParams);

		if (contribution !== '0' && user_id !== '') {
			this.setState({ loadingTitle: I18n.t("Загрузка видов пользователя") });
			const userTaxa = await API.fetchSpecies(project_id, user_id, null, null, false, this.setStatusMessage, customParams);
			this.setState({ loadingTitle: I18n.t("Обработка загруженных данных") });
			if (contribution === '1') {
				if (userTaxa.total === 0) return [];
				return [...userTaxa.ids].filter(id => {
					return !allTaxa.ids.has(id) || allTaxa.objects.get(id).count === userTaxa.objects.get(id).count;
				}).map(id => userTaxa.objects.get(id));
			} else if (contribution === '2') {
				return [...allTaxa.ids].filter(id => {
					return !userTaxa.ids.has(id)

				}).map(id => allTaxa.objects.get(id));

			}
		}

		this.setState({ loadingTitle: I18n.t("Обработка загруженных данных") });

		return [...allTaxa.ids].map(id => allTaxa.objects.get(id));

	}

	setFilename() {
		let filename = "";
		filename += this.state.project_id + "-";
		if (!!this.state.user_id) {
			filename += this.state.user_id + "-";
			if (!!this.state.contribution && !!this.state.project_id) filename += "only-";
		}
		if (!!this.state.quality_grade) filename += "quality_" + this.state.quality_grade + "-";
		filename += "species.csv";
		this.setState({ filename: filename });
	}

	storageHandler() {
		return {
			users: saveDatalist(this.state.user_id, this.state.user_id, this.state.users, 'users'),
			projects: saveDatalist(this.state.project_id, this.state.project_id, this.state.projects, 'projects'),
			places: saveDatalist(this.state.place_id, this.state.place_id, this.state.places, 'places')
		};
	}

	render() {
		const disabled = this.state.loading || (this.state.d1 === '' || (this.state.project_id === '' && this.state.user_id === ''));
		return (
			<Page title={I18n.t("Виды проекта")} className='page-listSpecies' infoText={I18n.t("Скрипт отображает все виды, отмеченные в проекте. Так же можно отобразить виды, которые наблюдал только указанный пользователь.")}>
				<FormWrapper onSubmit={this.submitHandler} disabled={disabled}>
					<fieldset>
						<legend>{I18n.t("Фильтрация")}</legend>
						<FormControl label={I18n.t("Id или имя проекта")} type='text' name='project_id' onChange={this.changeHandler}
							value={this.state.project_id} list={this.state.projects} />
						<FormControl label={I18n.t("Id или имя пользователя")} type='text' name='user_id' onChange={this.changeHandler}
							comment={I18n.t("Можно вводить несколько идентификаторов через запятую.")}
							value={this.state.user_id} list={this.state.users} clearDatalistHandler={this.clearDatalistHandler} listName="users" />
						<FormControlSelect label={I18n.t("Вклад пользователя")} name='contribution' onChange={this.changeHandler}
							className={(!!this.state.user_id && (!!this.state.project_id || !!this.state.place_id) ) ? '' : 'hidden'}
							value={this.state.contribution} values={this.getValues("contribution")}
						/>
						<FormControl label={I18n.t("Место")} type='text' name='place_id' onChange={this.changeHandler} value={this.state.place_id} list={this.state.places} clearDatalistHandler={this.clearDatalistHandler} listName='places' comment={I18n.t("В поле места требуется вводить только цифровой идентификатор.")} />
						<FormControlTaxon label={I18n.t("Ограничиться таксоном")} name="taxon" onChange={this.changeHandler}
							value={this.state.taxon} list={this.state.taxons} listName="taxons" clearDatalistHandler={this.clearDatalistHandler}
							updateState={this.updateState}
						/>
					</fieldset>
					<fieldset>
						<legend>{I18n.t("Прочее")}</legend>
						<FormControlLimit handler={this.changeHandler} value={this.state.limit} />
						<FormControlCheckbox label={I18n.t("Выводить только виды")} name='species_only' onChange={this.checkHandler}
							checked={this.state.species_only} />
						<FormControlSelect label={I18n.t("Статус наблюдения")} name="quality_grade" onChange={this.changeHandler}
							value={this.state.quality_grade} values={this.getValues("quality_grade")}
						/>
						<FormControl label={I18n.t("Дополнительные параметры")} type='text' name='additional' onChange={this.changeHandler}
							value={this.state.additional} ></FormControl>
					</fieldset>
					<DataControlsBlock checkHandler={this.checkHandler} changeHandler={this.changeHandler} state={this.state} />
					<fieldset>
						<legend>{I18n.t("Отображение")}</legend>
						<FormControlCSV handler={this.checkHandler} value={this.state.csv} />
					</fieldset>
				</FormWrapper>
				<Loader title={this.state.loadingTitle} message={this.state.loadingMessage} show={this.state.loading} />
				<Error {...this.state} />
				{!this.state.loading && !this.state.error &&
					<div className='result'>
						<TaxonsList
							taxons={this.state.data}
							d1={this.state.d1}
							d2={this.state.d2}
							date_created={this.state.date_created}
							date_any={this.state.date_any}
							place_id={this.state.place_id}
							project_id={this.state.project_id}
							user_id={!['2', '3'].includes(this.state.contribution) && this.state.user_id}
							csv={this.state.csv}
							filename={this.state.filename} />
					</div>
				}
			</Page>
		)
	}
};

export default SpeciesList;
