import React from 'react'

import Page from 'mixins/Page'
import 'assets/Species.scss';

import API, { fillDateParams } from 'mixins/API';
import { Error } from 'mixins/Error';
import Form from 'mixins/Form/Form';
import Module from 'classes/Module';
import I18n from 'classes/I18n';
import { FormControl, FormControlCheckbox, FormControlCSV, FormControlLimit, FormControlSelect } from 'mixins/Form/FormControl';
import { Loader } from 'mixins/Loader';
import { ObserverChangesList, Strategy } from 'mixins/ObserverChangesList';



export default class extends Module {
	constructor() {
		super();
		this.state = this.initDefaultSettings();
		this.initSettings(["project_id", "csv", "limit", "d1_new", "d2_new", "d1_prev", "d2_prev", "quality_grade", "date_created", "species_only", "projects",
			"order_by", "strategy", "difference", "prev_state"], this.state, { date_created: false }, {
			order_by: {
				setting: 'order_by', save: true, type: 'select', default: "species_count", values: {
					species_count: "Видам",
					observation_count: "Наблюдениям"
				}
			},
			difference: { setting: 'difference', save: true, type: 'number', default: 0 },
			prev_state: { setting: 'difference', save: true, type: 'boolean', default: true }
		});
	}

	order_by = [
		["species_count", "Видам"],
		["observation_count", "Наблюдениям"]
	];

	strategy = [
		[Strategy.new_faces, "Новые лица"]
	];

	isDisabled() {
		return this.state.loading || (this.state.project_id === '' || !this.state.d1_new)
	}

	async counter() {
		this.setState({ loadingTitle: I18n.t("Загрузка новых наблюдений") });
		const { project_id, place_id, limit, additional, order_by,
			d1_new, d2_new, d1_prev, d2_prev, date_created,
		} = this.state;
		let customParams = {};
		customParams['project_id'] = project_id;
		if (this.state.species_only) customParams['hrank'] = 'species';
		if (!!this.state.quality_grade) customParams['quality_grade'] = this.state.quality_grade;
		if (!!place_id) customParams['place_id'] = place_id;
		if (!!order_by) {
			customParams['order_by'] = order_by;
			customParams['order'] = 'asc';
		}
		if (!!additional) {
			additional.split('&').forEach(param => {
				param = param.split('=');
				if (param.length === 2) customParams[param[0]] = param[1];
			});
		}

		const customNewParams = { ...customParams, ...fillDateParams({ d1: d1_new, d2: d2_new, date_created }) };

		const newObservers = await API.fetchObservers(customNewParams, limit, this.setStatusMessage);

		this.setState({ loadingTitle: I18n.t("Загрузка наблюдений за предыдущий период") });
		const d2_prev_def = new Date(d1_new);
		d2_prev_def.setDate(d2_prev_def.getDate() - 1);
		const customOldParams = {
			...customParams, ...fillDateParams({
				date_created,
				d1: d2_prev && d1_prev ? d1_prev : undefined,
				d2: d2_prev ? d2_prev : d2_prev_def.toISOString().substring(0, 10)
			})
		};

		const prevObservers = await API.fetchObservers(customOldParams, 500, this.setStatusMessage);

		const data = [];
		const prevIdsArray = Array.from(prevObservers.ids);

		[...newObservers.ids].forEach((id, index) => {
			data.push({
				currentState: newObservers.objects.get(id),
				prevState: prevObservers.objects.get(id),
				currentPosition: index + 1,
				prevPosition: prevIdsArray.indexOf(id) + 1
			})
		});
		return data;



	}


	render() {
		return (
			<Page title={I18n.t('Вклад участников проекта')} className='page-newSpecies' infoText={I18n.t("pages.contribution.note.text")}>
				<Form onSubmit={this.submitHandler} disabled={this.isDisabled()}>
					<fieldset className='noborder'>
						<FormControl label={I18n.t("Id или имя проекта")} type='text' name='project_id' onChange={this.changeHandler}
							value={this.state.project_id} list={this.state.projects} />
					</fieldset>
					{/* <fieldset>
						<legend>{I18n.t("Фильтрация")}</legend>
					</fieldset> */}
					<fieldset>
						<legend>{I18n.t("Настройки даты")}</legend>
						<fieldset>
							<legend>{I18n.t("Текущий период")}</legend>
							<FormControl label={I18n.t("Наблюдения после")} type='date' name='d1_new' onChange={this.changeHandler}
								value={this.state.d1_new}>
							</FormControl>
							<FormControl label={I18n.t("Наблюдения до")} type='date' name='d2_new' onChange={this.changeHandler}
								value={this.state.d2_new}>
							</FormControl>
						</fieldset>
						<fieldset>
							<legend>{I18n.t("Предыдущий период")}</legend>
							<FormControl label={I18n.t("Наблюдения после")} type='date' name='d1_prev' onChange={this.changeHandler}
								value={this.state.d1_prev}>
							</FormControl>
							<FormControl label={I18n.t("Наблюдения до")} type='date' name='d2_prev' onChange={this.changeHandler}
								value={this.state.d2_prev}>
							</FormControl>
						</fieldset>
						<FormControlCheckbox label={I18n.t("Дата загрузки")} name='date_created' onChange={this.checkHandler}
							comment={I18n.t("Иначе дата рассматривается как дата наблюдения")}
							checked={this.state.date_created} />
					</fieldset>
					<fieldset>
						<legend>{I18n.t("Прочее")}</legend>
						<FormControlSelect label={I18n.t("Ранжирование по")} name="order_by" onChange={this.changeHandler} value={this.state.order_by}
							values={this.getValues('order_by')}
						/>
						<FormControlLimit handler={this.changeHandler} value={this.state.limit} max={500} />
						<FormControlSelect label={I18n.t("Статус наблюдения")} name="quality_grade" onChange={this.changeHandler} value={this.state.quality_grade}
							values={this.getValues("quality_grade")}
						/>
						<FormControlCheckbox label={I18n.t("Выводить только виды")} name='species_only' onChange={this.checkHandler}
							checked={this.state.species_only} />
						<FormControl label={I18n.t("Дополнительные параметры")} type='text' name='additional' onChange={this.changeHandler}
							value={this.state.additional} ></FormControl>
					</fieldset>
					<fieldset>
						<legend>{I18n.t("Отображение")}</legend>
						<p className='info'>{I18n.t("Не требует повторного скачивания наблюдений")}</p>
						{/* <FormControlSelect label={I18n.t("Стратегия построения списка")} name="strategy" onChange={this.changeHandler} value={this.state.strategy}
							values={this.strategy}
						/> */}
						<FormControlCheckbox label={I18n.t("Показывать данные за предыдущий период")} name='prev_state' onChange={this.checkHandler}
							checked={this.state.prev_state} />
						<FormControl name='difference' label={I18n.t("Не показывать наблюдателей изменивших положение меньше чем на")} type='number' min={0} onChange={this.changeHandler} value={this.state.difference} />
						{/* <FormControlCSV handler={this.checkHandler} value={this.state.csv} /> */}
					</fieldset>
				</Form>
				<Loader title={this.state.loadingTitle} message={this.state.loadingMessage} show={this.state.loading} />
				<Error {...this.state} />
				{!this.state.loading && !this.state.error &&
					<div className='result'>
						<ObserverChangesList 
							observers={this.state.data}
							strategy={this.state.strategy}
							difference={this.state.difference}
							showPrevState={this.state.prev_state}
						/>
					</div>
				}
			</Page>
		);
	}
}