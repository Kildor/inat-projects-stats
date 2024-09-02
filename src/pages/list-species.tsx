import React, { useCallback, useState } from 'react';
import { Form, useField } from 'react-final-form';
import { Taxon } from 'DataObjects';
import { I18n } from 'classes';
import { useDatalist, useInitialValues } from 'hooks';
import { useStatusMessageContext } from 'hooks/use-status-message-context';
import { PresentationSettingsList, StandartFormFields, StandartFormProps, iObjectsList } from 'interfaces';
import API, { createCallbackMessage, fillDateParams } from 'mixins/API';
import { Error } from 'mixins/Error';
import { FormControlField, FormControlSelectField, FormControlTaxonField } from 'mixins/Form/FormControl';
import { DataControlsBlock, OtherControlsBlock } from 'mixins/Form/form-control-field-sets';
import { FormWrapper } from 'mixins/Form/form-wrapper';
import { Loader } from 'mixins/Loader';
import Page from 'mixins/Page';
import TaxonsList from 'mixins/TaxonsList';
import { PresentationSettings } from 'mixins/presentation-settings';
import { createQueryRequest } from 'mixins/utils';
import { USER_CONTRIBUTIONS } from '../constants';

interface ListSpeciesFields extends StandartFormFields {
	/** Вклад пользователя. */
	contribution: USER_CONTRIBUTIONS;
	/** Сортировка видов. */
	order_by: 'count' | 'rarity' | 'rarity_abs';
}

const ListSpeciesForm: React.FC<StandartFormProps<ListSpeciesFields>> = ({ handleSubmit, form, optionValues = {}, onChangeHandler, loading }) => {
	const { datalists, clearDatalistHandler } = useDatalist(["users", "projects", "taxons", "places"]);

	const { input: { value: project_id } } = useField<ListSpeciesFields['project_id']>('project_id');
	const { input: { value: user_id } } = useField<ListSpeciesFields['user_id']>('user_id');
	const { input: { value: place_id } } = useField<ListSpeciesFields['place_id']>('place_id');
	const { input: { value: taxon_id } } = useField<ListSpeciesFields['taxon']>('taxon');
	const { input: { value: d1 } } = useField<ListSpeciesFields['d1']>('d1');
	const { input: { value: contribution } } = useField<ListSpeciesFields['contribution']>('contribution');



	const disabled = loading || (d1 === '' || (project_id === '' && user_id === '' && place_id === 0));

	return (
		<FormWrapper onSubmit={handleSubmit} disabled={disabled}>
			<fieldset>
				<legend>{I18n.t("Фильтрация")}</legend>
				<FormControlField
					label={I18n.t("Id или имя проекта")}
					type='text'
					name='project_id'
					changeHandler={onChangeHandler}
					list={datalists.projects} />
				<FormControlField
					label={I18n.t("Id или имя пользователя")}
					comment={I18n.t("Можно вводить несколько идентификаторов через запятую.")}
					type='text'
					name='user_id'
					changeHandler={onChangeHandler}
					list={datalists.users}
					clearDatalistHandler={clearDatalistHandler}
					listName="users" />
				{(!!user_id && (!!project_id || !!place_id || !!taxon_id)) &&
					<FormControlSelectField label={I18n.t("Вклад пользователя")} name='contribution' values={optionValues['contribution']} />
				}
				<FormControlField
					label={I18n.t("Место")}
					type='text'
					name='place_id'
					list={datalists.places}
					listName='places'
					comment={I18n.t("В поле места требуется вводить только цифровой идентификатор.")}
					changeHandler={onChangeHandler}
					clearDatalistHandler={clearDatalistHandler}
				/>
				<FormControlTaxonField
					label={I18n.t("Ограничиться таксоном")}
					name="taxon"
					changeHandler={onChangeHandler}
					list={datalists.taxons}
					listName="taxons"
					clearDatalistHandler={clearDatalistHandler}
				/>
			</fieldset>
			<DataControlsBlock handler={onChangeHandler} showDateAny />
			<OtherControlsBlock handler={onChangeHandler} optionValues={optionValues} >
				{!!user_id && USER_CONTRIBUTIONS.OBSERVED === contribution && (
					<FormControlSelectField label={I18n.t("Сортировка по")} name="order_by" values={optionValues['order_by']} />
				)}
			</OtherControlsBlock>
		</FormWrapper>
	);


};
ListSpeciesForm.displayName = 'ListSpeciesForm';


export const ListSpecies: React.FC = () => {
	const { getStatus, setStatus, setMessage, show: loading, setShow: setLoading } = useStatusMessageContext();

	const { statusMessage, statusTitle } = getStatus();
	const { values: initialValues, optionValues, onChangeHandler } = useInitialValues<ListSpeciesFields>([
		"project_id", "user_id", "place_id", "taxon",
		"limit", "species_only", "quality_grade", "contribution",
		"d1", "d2", "date_created", "date_any", "csv", "additional",
		"order_by"
	], {
		"order_by": "count",
	}, {
		order_by: {
			setting: 'order_by', save: true, type: 'select', default: "count", values: {
				count: "Количеству наблюдений",
				rarity: "Редкости",
				rarity_abs: "Редкости на всём сайте"
			}
		}
	});

	const [{ csv }, setPresentation] = useState<PresentationSettingsList>({ csv: initialValues!.csv });
	const [data, setData] = useState<Taxon[]>([]);

	const [error, setError] = useState<string>('');
	const [values, setValues] = useState<ListSpeciesFields>(initialValues);

	const submitHandler = useCallback(
		async (newValues: ListSpeciesFields) => {
			setValues(newValues);

			setLoading(true);

			const { project_id, user_id, place_id, contribution: contributionValue, order_by, taxon } = newValues;
			const customParamsWithoutData = createQueryRequest(newValues);
			const customParams = { ...customParamsWithoutData, ...fillDateParams(newValues) };

			const contribution: USER_CONTRIBUTIONS = project_id || place_id || taxon ? contributionValue : USER_CONTRIBUTIONS.OBSERVED;

			try {
				if (contribution === USER_CONTRIBUTIONS.NEVER_OBSERVED && user_id !== '') {
					setStatus(I18n.t("Загрузка всех видов"));
					customParams['unobserved_by_user_id'] = user_id;
					let allTaxa = await API.fetchSpecies(project_id, null, null, null, false, setMessage, customParams);

					setData([...allTaxa.ids].map(id => allTaxa.objects.get(id)) as Taxon[]);
					return;
				}

				setStatus(contribution === USER_CONTRIBUTIONS.OBSERVED && user_id !== '' ? I18n.t("Загрузка видов пользователя") : I18n.t("Загрузка всех видов"));

				const allTaxa = await API.fetchSpecies(project_id, contribution === USER_CONTRIBUTIONS.OBSERVED ? user_id : '', null, null, false, setMessage, customParams);

				if (contribution === USER_CONTRIBUTIONS.OBSERVED && user_id !== '' && ['rarity', 'rarity_abs'].includes(order_by)) {
					setStatus(I18n.t("Загрузка всех видов"));
					const userTaxonIds = [...allTaxa.ids];
					let allFilteredTaxa = { ids: new Set(), total: 0, objects: new Map() };
					let page = 1;

					do {
						setMessage(createCallbackMessage(page, 500, allTaxa.total));

						const taxons = userTaxonIds.splice(0, 500).join(',');

						const customParams = {
							hrank: customParamsWithoutData?.hrank ?? '',
							lrank: customParamsWithoutData?.lrank ?? '',
							quality_grade: customParamsWithoutData?.quality_grade ?? '',
							taxon_is_active: 'true',
						};

						const taxa = await API.fetchSpecies(order_by === 'rarity' ? project_id : null, '', null, null, false, () => { }, { ...(order_by === 'rarity' ? customParamsWithoutData : customParams), 'taxon_id': taxons });
						allFilteredTaxa = API.concatObjects(allFilteredTaxa as iObjectsList<Taxon>, taxa);
						page++;
					} while (userTaxonIds.length > 0);

					setStatus(I18n.t("Обработка загруженных данных"));
					const listAllTaxa = [...allFilteredTaxa.objects]
						.map(a => a[1])
						.sort((t1: Taxon, t2: Taxon) => t1.count - t2.count);

					setData(listAllTaxa.filter(({ id }) => allTaxa.objects.has(id)).map(({ id, count }) => {
						const taxon = allTaxa.objects.get(id);
						taxon!.countTotal = count;
						return (taxon);
					}) as Taxon[]);

					return;
				}

				if (contribution !== USER_CONTRIBUTIONS.OBSERVED && user_id !== '') {
					setStatus(I18n.t("Загрузка видов пользователя"));
					const userTaxa = await API.fetchSpecies(project_id, user_id, null, null, false, setMessage, customParams);
					setStatus(I18n.t("Обработка загруженных данных"));

					if (contribution === USER_CONTRIBUTIONS.OBSERVED_ONLY) {
						if (userTaxa.total === 0) {
							setData([]);
						}
						else {
							setData([...userTaxa.ids].filter(id => {
								return !allTaxa.ids.has(id) || allTaxa.objects.get(id)?.count === userTaxa.objects.get(id)?.count;
							}).map(id => userTaxa.objects.get(id)) as Taxon[]);
						}
					} else if (contribution === USER_CONTRIBUTIONS.NOT_OBSERVED) {
						setData([...allTaxa.ids].filter(id => {
							return !userTaxa.ids.has(id)
						}).map(id => allTaxa.objects.get(id)) as Taxon[]);
					} else if (contribution === USER_CONTRIBUTIONS.MARK_OBSERVED) {
						setData([...allTaxa.ids].map(id => ({ ...allTaxa.objects.get(id), isObserved: userTaxa.ids.has(id)})) as Taxon[]);
					}

					return;
				}

				setStatus(I18n.t("Обработка загруженных данных"));

				setData([...allTaxa.ids].map(id => allTaxa.objects.get(id)) as Taxon[]);
				return;
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
		<Page title={I18n.t("Виды проекта")} className='page-listSpecies' infoText={I18n.t("Скрипт отображает все виды, отмеченные в проекте. Так же можно отобразить виды, которые наблюдал только указанный пользователь.")}>
			<Form
				initialValues={values}
				onSubmit={submitHandler}
				render={(props) => (<ListSpeciesForm {...props} onChangeHandler={onChangeHandler} optionValues={optionValues} loading={loading} />
				)}
			// subscription={{}}
			/>
			<Loader title={statusTitle} message={statusMessage} show={loading} />
			<Error error={error} />
			<PresentationSettings onChangeHandler={onChangeHandler} setPresentation={setPresentation} values={{ csv }} />
			{!loading && !error && data && values &&
				<div className='result'>
					<TaxonsList
						taxons={data}
						d1={values.d1}
						d2={values.d2}
						date_created={values.date_created}
						date_any={values.date_any}
						place_id={values.place_id}
						project_id={values.project_id}
						user_id={[USER_CONTRIBUTIONS.OBSERVED, USER_CONTRIBUTIONS.OBSERVED_ONLY].includes(values.contribution) && values.user_id ? values.user_id : undefined}
						csv={csv}
						markObserved={values.contribution === USER_CONTRIBUTIONS.MARK_OBSERVED}
					// filename={values.filename}
					/>
				</div>
			}
		</Page>

	);

};
ListSpecies.displayName = 'ListSpecies'