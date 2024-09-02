import React, { useCallback, useContext, useState } from 'react';
import I18n from 'classes/I18n';
import { useDatalist, useInitialValues } from 'hooks';
import { Error } from 'mixins/Error';
import { Loader } from 'mixins/Loader';
import Page from 'mixins/Page';
import { FormWrapper } from 'mixins/Form/form-wrapper';
import TaxonsList from 'mixins/TaxonsList';
import { TranslateJSX } from 'mixins/Translation';
import { Form, useField } from 'react-final-form';
import { FormControlCheckboxField, FormControlField, FormControlTaxonField } from 'mixins/Form/FormControl';
import { SwapIcon } from 'mixins/swap-icon';
import { StatusMessageContext } from 'contexts/status-message-context';
import { Taxon } from 'DataObjects';
import { StandartFormProps, PresentationSettingsList, StandartFormFields } from 'interfaces';
import API from 'mixins/API';
import { PresentationSettings } from 'mixins/presentation-settings';
import { OtherControlsBlock } from 'mixins/Form/form-control-field-sets';
import { createQueryRequest } from 'mixins/utils';
import { useStatusMessageContext } from 'hooks/use-status-message-context';

/** Дополнительные поля. */
export interface MissedSpeciesFields extends StandartFormFields {
	/** Расширенное сравнение. */
	extended_comparing: boolean;
	/** Пользователь, который не наблюдал виды. */
	unobserved_by_user_id: string;
	/** Проект, в котором не наблюдаются виды. */
	unobserved_by_project_id: string;
	/** Место, в котором не наблюдаются виды. */
	unobserved_by_place_id: string;
	/** Пользователь для сравнения. */
	observed_by_user_id: string;
	/** Проект для сравнения. */
	observed_by_project_id: string;
	/** Место для сравнения. */
	observed_by_place_id: string;
}

/** Кастомные поля формы, требующие дополнительной настройки. */
const customFields: Partial<Record<keyof MissedSpeciesFields, any>> = {
	extended_comparing: { setting: 'extended_comparing', save: true, type: 'boolean', default: false },
};

const InfoText = <>
	<TranslateJSX replace={[<br key='br' />]}>pages.species-missed.note.text</TranslateJSX>
	<br />
	<b>{I18n.t('Расширенное сравнение')}</b>
	<br />
	<TranslateJSX replace={[<br key='br' />]}>pages.species-missed.note.text-extended</TranslateJSX>
</>

/*
В расширенном режиме скрипт сравнивает два набора данных для пользователя, проекта и места.{1}
Кроме того можно отфильтровать данные общими
*/

const MissedSpeciesForm: React.FC<StandartFormProps<MissedSpeciesFields>> = ({ handleSubmit, optionValues = {}, onChangeHandler }) => {
	const { input: { value: project_id } } = useField<string>('project_id');
	const { input: { value: user_id } } = useField<string>('user_id');
	const { input: { value: place_id } } = useField<string>('place_id');
	const { input: { value: unobserved_by_user_id } } = useField<string>('unobserved_by_user_id');
	const { input: { value: unobserved_by_project_id } } = useField<string>('unobserved_by_project_id');
	const { input: { value: unobserved_by_place_id } } = useField<string>('unobserved_by_place_id');
	const { input: { value: observed_by_user_id } } = useField<string>('observed_by_user_id');
	const { input: { value: observed_by_project_id } } = useField<string>('observed_by_project_id');
	const { input: { value: observed_by_place_id } } = useField<string>('observed_by_place_id');

	const { input: { value: extended_comparing } } = useField<boolean>('extended_comparing');

	const { show: loading } = useContext(StatusMessageContext);

	const { datalists, clearDatalistHandler } = useDatalist(["users", "projects", "taxons", "places"]);

	const showUserField = unobserved_by_user_id === '' && observed_by_user_id === '';
	const showProjectField = unobserved_by_project_id === '' && observed_by_project_id === '';
	const showPlaceField = unobserved_by_place_id === '' && observed_by_place_id === '';

	const hasFilledObserved = observed_by_user_id !== '' || observed_by_place_id !== '' || observed_by_project_id !== '';
	const hasFilledUnobserved = unobserved_by_user_id !== '' || unobserved_by_place_id !== '' || unobserved_by_project_id !== '';

	const disabled = loading ||
		!hasFilledUnobserved || (!hasFilledObserved && user_id === '' && project_id ==='' && place_id ==='');

	return (
		<FormWrapper onSubmit={handleSubmit} disabled={disabled}>
			<fieldset>
				<legend>{I18n.t("Сравнение")}</legend>
				<FormControlField
					label={I18n.t("Id или имя пользователя")}
					type='text'
					name='unobserved_by_user_id'
					changeHandler={onChangeHandler}
					list={datalists.users}
					clearDatalistHandler={clearDatalistHandler}
					listName="users">
				</FormControlField>
				<SwapIcon fieldA='unobserved_by_user_id' fieldB='observed_by_user_id' />
				<FormControlField
					label={I18n.t("Id или имя пользователя для сравнения")}
					type='text'
					name='observed_by_user_id'
					changeHandler={onChangeHandler}
					list={datalists.users}
					clearDatalistHandler={clearDatalistHandler}
					listName="users"
				/>
				<FormControlCheckboxField
					className='heading'
					label={I18n.t('Расширенное сравнение')}
					name='extended_comparing'
					handler={onChangeHandler}
				/>
				{extended_comparing && (
					<fieldset className='noborder'>
						<FormControlField
							label={I18n.t("Id или имя проекта")}
							type='text'
							name='unobserved_by_project_id'
							changeHandler={onChangeHandler}
							list={datalists.projects}
							clearDatalistHandler={clearDatalistHandler}
							listName="projects">
						</FormControlField>
						<SwapIcon fieldA='unobserved_by_project_id' fieldB='observed_by_project_id' />
						<FormControlField
							label={I18n.t("Id или имя проекта для сравнения")}
							type='text'
							name='observed_by_project_id'
							changeHandler={onChangeHandler}
							list={datalists.projects}
							clearDatalistHandler={clearDatalistHandler}
							listName="projects">
						</FormControlField>
						<FormControlField
							label={I18n.t("Id места")}
							type='text'
							name='unobserved_by_place_id'
							changeHandler={onChangeHandler}
							list={datalists.places}
							clearDatalistHandler={clearDatalistHandler}
							listName="places">
						</FormControlField>
						<SwapIcon fieldA='unobserved_by_place_id' fieldB='observed_by_place_id' />
						<FormControlField
							label={I18n.t("Id места для сравнения")}
							type='text'
							name='observed_by_place_id' changeHandler={onChangeHandler}
							list={datalists.places}
							clearDatalistHandler={clearDatalistHandler}
							listName='places'
							comment={I18n.t("В поле места требуется вводить только цифровой идентификатор.")}
						/>
					</fieldset>
				)}
			</fieldset>
			<fieldset>
				<legend>{I18n.t("Фильтрация")}</legend>
				{extended_comparing && showUserField && (
					<FormControlField
						label={I18n.t("Id или имя пользователя")}
						type='text'
						name='user_id'
						changeHandler={onChangeHandler}
						list={datalists.users}
						clearDatalistHandler={clearDatalistHandler}
						listName="users"
					/>
				)}
				{(!extended_comparing || showProjectField) && <FormControlField
					label={I18n.t("Id или имя проекта")}
					type='text'
					name='project_id'
					changeHandler={onChangeHandler}
					list={datalists.projects}
				/>}
				{(!extended_comparing || showPlaceField) && <FormControlField
					label={I18n.t("Id места")}
					type='text'
					name='place_id' changeHandler={onChangeHandler}
					list={datalists.places}
					clearDatalistHandler={clearDatalistHandler}
					listName='places'
					comment={I18n.t("В поле места требуется вводить только цифровой идентификатор.")}
				/>}
				<FormControlTaxonField
					label={I18n.t("Ограничиться таксоном")}
					name="taxon"
					changeHandler={onChangeHandler}
					list={datalists.taxons}
					listName="taxons"
					clearDatalistHandler={clearDatalistHandler}
				/>
			</fieldset>
			<OtherControlsBlock handler={onChangeHandler} optionValues={optionValues} />
		</FormWrapper>
	);
};

export const MissedSpecies: React.FC = () => {
	const { getStatus, setStatus, setMessage, show: loading, setShow: setLoading } = useStatusMessageContext();

	const { statusMessage, statusTitle } = getStatus();
	const { values: initialValues, optionValues, onChangeHandler } = useInitialValues<MissedSpeciesFields>([
		"unobserved_by_user_id", "unobserved_by_project_id", "unobserved_by_place_id",
		"project_id", "user_id", "csv", "limit", "species_only", "quality_grade", "taxon", "place_id", "additional",
		"extended_comparing"
	], {}, customFields);

	const [{ csv }, setPresentation] = useState<PresentationSettingsList>({ csv: initialValues.csv });
	const [data, setData] = useState<Taxon[]>([]);
	const [error, setError] = useState<string>('');
	const [values, setValues] = useState<MissedSpeciesFields>(initialValues);

	const submitHandler = useCallback(async (values: MissedSpeciesFields) => {
		setLoading(true);
		const {
			project_id, place_id, user_id,
			unobserved_by_user_id, unobserved_by_project_id, unobserved_by_place_id,
			observed_by_user_id, observed_by_project_id, observed_by_place_id,
			extended_comparing,
		} = values;
		setValues(values);

		const customParams = createQueryRequest(values);

		setStatus({ title: I18n.t("Загрузка видов") });

		try {
			// Простой вариант сравнения двух пользователей
			if (!extended_comparing) {
				// unobserved_by_user_id excludes all taxons, not only included to the project
				if (!project_id && !place_id) {
					customParams['unobserved_by_user_id'] = unobserved_by_user_id;
					const unobservedTaxa = await API.fetchSpecies(null, observed_by_user_id, null, null, false, setMessage, customParams);

					setData([...unobservedTaxa.ids].map(id => unobservedTaxa.objects.get(id)) as Taxon[]);
				} else {

					const unobservedTaxa = await API.fetchSpecies(project_id, observed_by_user_id, null, null, false, setMessage, customParams);

					setStatus({ title: I18n.t("Загрузка видов пользователя") });

					const observedTaxa = await API.fetchSpecies(project_id, unobserved_by_user_id, null, null, false, setMessage, customParams);

					setData([...unobservedTaxa.ids].filter(id => !observedTaxa.ids.has(id)).map(id => unobservedTaxa.objects.get(id)) as Taxon[]);
				}

			} else {
				const useUserField = !unobserved_by_user_id && !observed_by_user_id;
				const useProjectField = !unobserved_by_project_id && !observed_by_project_id;
				const usePlaceField = !unobserved_by_place_id && !observed_by_place_id;

				if (!usePlaceField) {
					customParams['place_id'] = observed_by_place_id ?? '';
				}
				customParams['project_id'] = useProjectField ? project_id ?? '' : observed_by_project_id ?? '';
				customParams['user_id'] = useUserField ? user_id ?? '' : observed_by_user_id ?? '';

				const unobservedTaxa = await API.fetchSpecies(null, null, null, null, false, setMessage, customParams);

				if (!usePlaceField) {
					customParams['place_id'] = unobserved_by_place_id ?? '';
				}
				if (!useProjectField) {
					customParams['project_id'] = unobserved_by_project_id ?? '';
				}
				if (!useUserField) {
					customParams['user_id'] = unobserved_by_user_id ?? '';
				}

				const observedTaxa = await API.fetchSpecies(null, null, null, null, false, setMessage, customParams);

				setData([...unobservedTaxa.ids].filter(id => !observedTaxa.ids.has(id)).map(id => unobservedTaxa.objects.get(id)) as Taxon[]);
			}
		} catch (e: any) {
			console.error(e);
			setError(e.message)
		} finally {
			setLoading(false);
		}

	}, [setLoading, setStatus, setMessage]);

	return (
		<Page title={I18n.t("Пропущенные виды")} className='page-listSpecies' infoText={InfoText}>
			<Form
				initialValues={values}
				onSubmit={submitHandler}
				render={(props) => (<MissedSpeciesForm {...props} onChangeHandler={onChangeHandler} optionValues={optionValues} />
				)}
			/>
			<PresentationSettings onChangeHandler={onChangeHandler} setPresentation={setPresentation} values={{ csv }} />
			<Loader title={statusTitle} message={statusMessage} show={loading} />
			<Error error={error} />
			{!loading && !error && data && values &&
				<div className='result'>
					<TaxonsList taxons={data} project_id={values.project_id} user_id={values.user_id} csv={csv} />
				</div>
			}
		</Page>

	);
};
