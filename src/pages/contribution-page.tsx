import { I18n } from 'classes';
import { useDatalist, useInitialValues } from 'hooks';
import { FormDataFields, FormFilterFields, FormOtherFields, FormPresentationFields, StandartFormProps } from 'interfaces';
import API, { fillDateParams } from 'mixins/API';
import { FormControl, FormControlCheckboxField, FormControlField, FormControlSelectField } from 'mixins/Form/FormControl';
import { OtherControlsBlock } from 'mixins/Form/form-control-field-sets';
import { FormWrapper } from 'mixins/Form/form-wrapper';
import { Loader } from 'mixins/Loader';
import Page from 'mixins/Page';
import { PresentationSettings } from 'mixins/presentation-settings';
import { createQueryRequest } from 'mixins/utils';
import React, { useCallback, useState } from 'react';
import { Form, useField } from 'react-final-form';
import { ObserverChangesList, Strategy, iObserverChange } from 'mixins/ObserverChangesList';
import { useStatusMessageContext } from 'hooks/use-status-message-context';

export interface ContributionFields extends FormOtherFields, FormPresentationFields, Pick<FormDataFields, 'date_created'>, Pick<FormFilterFields, 'project_id'> {
	order_by: 'species_count' | 'observation_count';
	strategy: Strategy;
	difference: number;
	prev_state: boolean;
	show_retired: boolean;
	d1_new: string;
	d2_new: string;
	d1_prev: string;
	d2_prev: string;
}

interface ContributionPresentationSettingsList extends
	Pick<ContributionFields,
		'difference' | 'show_retired' | 'prev_state'> { }


const customFields = {
	order_by: {
		setting: 'order_by', save: true, type: 'select', default: "species_count", values: {
			species_count: "Видам",
			observation_count: "Наблюдениям"
		}
	},
	difference: { setting: 'difference', save: true, type: 'number', default: 0 },
	prev_state: { setting: 'prev_state', save: true, type: 'boolean', default: true },
	show_retired: { setting: 'show_retired', save: true, type: 'boolean', default: true },
};

const ContributionForm: React.FC<StandartFormProps<ContributionFields>> = ({ handleSubmit, form, optionValues = {}, onChangeHandler, loading = false }) => {
	const { datalists } = useDatalist(["projects"]);

	const { input: { value: project_id } } = useField<string>('project_id');

	const disabled = Boolean(loading) || (project_id === '');

	return (
		<FormWrapper onSubmit={handleSubmit} disabled={disabled}>
			<fieldset className='noborder'>
				<FormControlField
					label={I18n.t("Id или имя проекта")}
					type='text'
					name='project_id'
					changeHandler={onChangeHandler}
					list={datalists.projects} />
			</fieldset>
			<fieldset>
				<legend>{I18n.t("Настройки даты")}</legend>
				<fieldset>
					<legend>{I18n.t("Текущий период")}</legend>
					<FormControlField label={I18n.t("Наблюдения после")} type='date' name='d1_new'
						changeHandler={onChangeHandler}
					/>
					<FormControlField label={I18n.t("Наблюдения до")} type='date' name='d2_new'
						changeHandler={onChangeHandler}
					/>
				</fieldset>
				<fieldset>
					<legend>{I18n.t("Предыдущий период")}</legend>
					<FormControlField label={I18n.t("Наблюдения после")} type='date' name='d1_prev'
						changeHandler={onChangeHandler}
					/>
					<FormControlField label={I18n.t("Наблюдения до")} type='date' name='d2_prev'
						changeHandler={onChangeHandler}
					/>
				</fieldset>
				<FormControlCheckboxField label={I18n.t("Дата загрузки")} name='date_created'
					handler={onChangeHandler}
					comment={I18n.t("Иначе дата рассматривается как дата наблюдения")}
				/>
			</fieldset>
			<OtherControlsBlock handler={onChangeHandler} optionValues={optionValues} >
				<FormControlSelectField label={I18n.t("Ранжирование по")} name="order_by"
					values={optionValues['order_by']} />

			</OtherControlsBlock>
		</FormWrapper>
	);
};
ContributionForm.displayName = 'ContributionForm';


export const ContributionPage: React.FC = () => {
	const { getStatus, setStatus, setMessage, show: loading, setShow: setLoading } = useStatusMessageContext();


	const { statusMessage, statusTitle } = getStatus();

	const { values: initialValues, optionValues, onChangeHandler } = useInitialValues<ContributionFields>([
		"project_id", "limit", "species_only", "quality_grade",
		"d1_new", "d2_new", "d1_prev", "d2_prev", "date_created",
		"csv", "order_by", "strategy", "difference", "prev_state", "show_retired"
	], {}, customFields);

	const [presentationSettingsList, setPresentation] = useState<ContributionPresentationSettingsList>({
		difference: initialValues!.difference,
		show_retired: initialValues!.show_retired,
		prev_state: initialValues!.prev_state,
	});

	const [data, setData] = useState<iObserverChange[]>([]);
	const [error, setError] = useState<string>('');
	const [values, setValues] = useState<ContributionFields>(initialValues);

	const submitHandler = useCallback(
		async (newValues: ContributionFields) => {
			setValues(newValues);
			setStatus({ title: I18n.t("Загрузка новых наблюдений") });
			setLoading(true);

			const { project_id, limit, order_by,
				d1_new, d2_new, d1_prev, d2_prev, date_created,
			} = newValues;


			const customParams: Record<string, string> = { ...createQueryRequest(newValues), project_id };

			if (!!order_by) {
				customParams['order_by'] = order_by;
				customParams['order'] = 'asc';
			}

			try {
				const customNewParams = { ...customParams, ...fillDateParams({ d1: d1_new, d2: d2_new, date_created }) };

				const newObservers = await API.fetchObservers(customNewParams, limit, setMessage);

				setStatus(I18n.t("Загрузка наблюдений за предыдущий период"));
				const d2_prev_def = new Date(d1_new);
				d2_prev_def.setDate(d2_prev_def.getDate() - 1);
				const customOldParams = {
					...customParams, ...fillDateParams({
						date_created,
						d1: d2_prev && d1_prev ? d1_prev : undefined,
						d2: d2_prev ? d2_prev : d2_prev_def.toISOString().substring(0, 10)
					})
				};

				const prevObservers = await API.fetchObservers(customOldParams, 500, setMessage);

				const data: iObserverChange[] = [];
				const prevIdsArray = Array.from(prevObservers.ids);

				[...newObservers.ids].forEach((id, index) => {
					data.push({
						currentState: newObservers.objects.get(id)!,
						prevState: prevObservers.objects.get(id),
						currentPosition: index + 1,
						prevPosition: prevIdsArray.indexOf(id) + 1
					})
				});
				[...prevObservers.ids].forEach(id => {
					if (!newObservers.ids.has(id)) {
						data.push({
							prevState: prevObservers.objects.get(id)!,
							currentPosition: 0,
							prevPosition: prevIdsArray.indexOf(id) + 1
						})
					}
				});

				setData(data);
			} catch (e: any) {
				console.error(e);
				setError(e.message)

			} finally {
				setLoading(false);
			}
		},
		[setLoading, setMessage, setStatus],
	);



	return (
		<Page title={I18n.t('Вклад участников проекта')} className='page-newSpecies' infoText={I18n.t("pages.contribution.note.text")}>
			<Form
				initialValues={values}
				onSubmit={submitHandler}
				render={(props) => (<ContributionForm {...props} onChangeHandler={onChangeHandler} optionValues={optionValues} loading={loading} />
				)}
			/>
			<PresentationSettings onChangeHandler={onChangeHandler} setPresentation={setPresentation} values={presentationSettingsList as any as Record<string, boolean>}
				settings={[
					{ label: I18n.t("Показывать данные за предыдущий период"), name: 'prev_state' },
					{ label: I18n.t("Показывать выбывших наблюдателей"), name: 'show_retired' },
				]} >
				<FormControl
					className='no-flex'
					name='difference'
					label={I18n.t("Не показывать наблюдателей изменивших положение меньше чем на")}
					type='number'
					min={0}
					onChange={(e) => {
						onChangeHandler(e.target.name, e.target.value);
						setPresentation((presentationSettings) => ({ ...presentationSettings, [e.target.name]: e.target.value }));
					}}
					value={presentationSettingsList.difference}
				/>
			</PresentationSettings>

			<Loader title={statusTitle} message={statusMessage} show={loading} />
			{/* <Error {...this.state} /> */}
			{!loading && !error &&
				<div className='result'>
					<ObserverChangesList
						observers={data}
						strategy={values.strategy}
						difference={presentationSettingsList.difference}
						showPrevState={presentationSettingsList.prev_state}
						showRetired={presentationSettingsList.show_retired}
						orderBy={values.order_by}
					/>
				</div>
			}
		</Page>

	);
};
ContributionPage.displayName = 'ContributionPage';