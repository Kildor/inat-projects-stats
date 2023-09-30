import { Taxon } from 'DataObjects';
import { I18n } from 'classes';
import { useDatalist, useInitialValues } from 'hooks';
import { useStatusMessageContext } from 'hooks/use-status-message-context';
import { PresentationSettingsList, StandartFormFields, StandartFormProps } from 'interfaces';
import API, { fillDateParams } from 'mixins/API';
import { Error } from 'mixins/Error';
import { FormControlField, FormControlSelectField, FormControlTaxonField } from 'mixins/Form/FormControl';
import { DataControlsBlock, OtherControlsBlock } from 'mixins/Form/form-control-field-sets';
import { FormWrapper } from 'mixins/Form/form-wrapper';
import { Loader } from 'mixins/Loader';
import Page from 'mixins/Page';
import TaxonsList from 'mixins/TaxonsList';
import { PresentationSettings } from 'mixins/presentation-settings';
import { createQueryRequest } from 'mixins/utils';
import React, { useCallback, useState } from 'react';
import { Form, useField } from 'react-final-form';

interface ListSpeciesFields extends StandartFormFields {
	contribution: string;
}

const ListSpeciesForm: React.FC<StandartFormProps<ListSpeciesFields>> = ({ handleSubmit, form, optionValues = {}, onChangeHandler, loading }) => {
	const { datalists, clearDatalistHandler } = useDatalist(["users", "projects", "taxons", "places"]);

	const { input: { value: project_id } } = useField<string>('project_id');
	const { input: { value: user_id } } = useField<string>('user_id');
	const { input: { value: place_id } } = useField<string>('place_id');
	const { input: { value: d1 } } = useField<string>('d1');



	const disabled = loading || (d1 === '' || (project_id === '' && user_id === '' && place_id === ''));

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
				{(!!user_id && (!!project_id || !!place_id)) &&
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
			<OtherControlsBlock handler={onChangeHandler} optionValues={optionValues} />
		</FormWrapper>
	);


};
ListSpeciesForm.displayName = 'ListSpeciesForm';


export const ListSpecies: React.FC = () => {
	const { getStatus, setStatus, setMessage, show: loading, setShow: setLoading } = useStatusMessageContext();

	const { statusMessage, statusTitle } = getStatus();
	const { values: initialValues, optionValues, onChangeHandler } = useInitialValues<ListSpeciesFields>([
		"project_id", "user_id", "place_id", "taxon", "limit", "species_only", "quality_grade", "contribution", "d1", "d2", "date_created", "date_any", "csv", "additional"
	]);

	const [{ csv }, setPresentation] = useState<PresentationSettingsList>({ csv: initialValues!.csv });
	const [data, setData] = useState<Taxon[]>([]);
	const [error, setError] = useState<string>('');
	const [values, setValues] = useState<ListSpeciesFields>(initialValues);

	const submitHandler = useCallback(
		async (newValues: ListSpeciesFields) => {
			setValues(newValues);

			setLoading(true);
			setStatus(I18n.t("Загрузка новых видов"));

			const { project_id, user_id, contribution } = newValues;

			const customParams = { ...createQueryRequest(newValues), ...fillDateParams(newValues) };

			try {
				if (contribution === '3' && user_id !== '') {
					customParams['unobserved_by_user_id'] = user_id;
					let allTaxa = await API.fetchSpecies(project_id, null, null, null, false, setMessage, customParams);

					setData([...allTaxa.ids].map(id => allTaxa.objects.get(id)) as Taxon[]);
					return;
				}

				let allTaxa = await API.fetchSpecies(project_id, contribution !== '0' ? '' : user_id, null, null, false, setMessage, customParams);

				if (contribution !== '0' && user_id !== '') {
					setStatus(I18n.t("Загрузка видов пользователя"));
					const userTaxa = await API.fetchSpecies(project_id, user_id, null, null, false, setMessage, customParams);
					setStatus(I18n.t("Обработка загруженных данных"));

					if (contribution === '1') {
						if (userTaxa.total === 0) setData([]);
						setData([...userTaxa.ids].filter(id => {
							return !allTaxa.ids.has(id) || allTaxa.objects.get(id)?.count === userTaxa.objects.get(id)?.count;
						}).map(id => userTaxa.objects.get(id)) as Taxon[]);
						return;
					} else if (contribution === '2') {
						setData([...allTaxa.ids].filter(id => {
							return !userTaxa.ids.has(id)
						}).map(id => allTaxa.objects.get(id)) as Taxon[]);
						return;
					}
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
						user_id={!['2', '3'].includes(values.contribution) ? values.user_id : undefined}
						csv={csv}
					// filename={values.filename}
					/>
				</div>
			}
		</Page>

	);

};
ListSpecies.displayName = 'ListSpecies'