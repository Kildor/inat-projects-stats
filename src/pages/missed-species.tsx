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
import { FormControlField, FormControlTaxonField } from 'mixins/Form/FormControl';
import { SwapIcon } from 'mixins/swap-icon';
import { StatusMessageContext } from 'contexts/status-message-context';
import { Taxon } from 'DataObjects';
import { StandartFormProps, PresentationSettingsList, StandartFormFields } from 'interfaces';
import API from 'mixins/API';
import { PresentationSettings } from 'mixins/presentation-settings';
import { OtherControlsBlock } from 'mixins/Form/form-control-field-sets';
import { createQueryRequest } from 'mixins/utils';
import { useStatusMessageContext } from 'hooks/use-status-message-context';

export interface MissedSpeciesFields extends StandartFormFields {
	unobserved_by_user_id: string;
}

const InfoText = <TranslateJSX replace={[<br />]}>
	pages.species-missed.note.text
</TranslateJSX>;

const MissedSpeciesForm: React.FC<StandartFormProps<MissedSpeciesFields>> = ({ handleSubmit, optionValues = {}, onChangeHandler }) => {


	const { input: { value: project_id } } = useField<string>('project_id');
	const { input: { value: user_id } } = useField<string>('user_id');
	const { input: { value: place_id } } = useField<string>('place_id');
	const { input: { value: unobserved_by_user_id } } = useField<string>('unobserved_by_user_id');

	const { show: loading } = useContext(StatusMessageContext);

	const { datalists, clearDatalistHandler } = useDatalist(["users", "projects", "taxons", "places"]);

	const disabled = loading || (unobserved_by_user_id === '' || (project_id === '' && user_id === '' && place_id === ''));

	return (
		<FormWrapper onSubmit={handleSubmit} disabled={disabled}>
			<fieldset>
				<legend>{I18n.t("Фильтрация")}</legend>
				<FormControlField
					label={I18n.t("Id или имя пользователя")}
					type='text'
					name='unobserved_by_user_id'
					changeHandler={onChangeHandler}
					list={datalists.users}
					clearDatalistHandler={clearDatalistHandler}
					listName="users">
				</FormControlField>
				<SwapIcon fieldA='unobserved_by_user_id' fieldB='user_id' />
				<FormControlField
					label={I18n.t("Id или имя пользователя для сравнения")}
					type='text'
					name='user_id'
					changeHandler={onChangeHandler}
					list={datalists.users}
					clearDatalistHandler={clearDatalistHandler}
					listName="users"
				/>
				<FormControlField
					label={I18n.t("Id или имя проекта для сравнения")}
					type='text'
					name='project_id'
					changeHandler={onChangeHandler}
					list={datalists.projects}
				/>
				<FormControlField
					label={I18n.t("Id места для сравнения")}
					type='text'
					name='place_id' changeHandler={onChangeHandler}
					list={datalists.places}
					clearDatalistHandler={clearDatalistHandler}
					listName='places'
					comment={I18n.t("В поле места требуется вводить только цифровой идентификатор.")}
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
			<OtherControlsBlock handler={onChangeHandler} optionValues={optionValues} />
		</FormWrapper>
	);
};

export const MissedSpecies: React.FC = () => {
	const { getStatus, setStatus, setMessage, show: loading, setShow: setLoading } = useStatusMessageContext();

	const { statusMessage, statusTitle } = getStatus();
	const { values: initialValues, optionValues, onChangeHandler } = useInitialValues<MissedSpeciesFields>([
		"project_id", "user_id", "csv", "limit", "species_only", "quality_grade", "taxon", "place_id", "additional"
	]);

	const [{ csv }, setPresentation] = useState<PresentationSettingsList>({ csv: initialValues!.csv });
	const [data, setData] = useState<Taxon[]>([]);
	const [error, setError] = useState<string>('');
	const [values, setValues] = useState<MissedSpeciesFields>();

	const submitHandler = useCallback(async (values: MissedSpeciesFields) => {
		setLoading(true);
		const { project_id, place_id, user_id, unobserved_by_user_id } = values;
		setValues(values);

		const customParams = createQueryRequest(values);

		setStatus({ title: I18n.t("Загрузка видов") });

		try {
			// unobserved_by_user_id excludes all taxons, not only included to the project
			if (!project_id && !place_id) {
				customParams['unobserved_by_user_id'] = unobserved_by_user_id;
				const unobservedTaxa = await API.fetchSpecies(null, user_id, null, null, false, setMessage, customParams);

				setData([...unobservedTaxa.ids].map(id => unobservedTaxa.objects.get(id)) as Taxon[]);
			} else {

				const unobservedTaxa = await API.fetchSpecies(project_id, user_id, null, null, false, setMessage, customParams);

				setStatus({ title: I18n.t("Загрузка видов пользователя") });

				const observedTaxa = await API.fetchSpecies(project_id, unobserved_by_user_id, null, null, false, setMessage, customParams);

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
				initialValues={initialValues}
				onSubmit={submitHandler}
				render={(props) => (<MissedSpeciesForm {...props} onChangeHandler={onChangeHandler} optionValues={optionValues} />
				)}
			/>
			<PresentationSettings onChangeHandler={onChangeHandler} setPresentation={setPresentation} values={{ csv }} />
			<Loader title={statusTitle} message={statusMessage} show={loading} />
			<Error error={error} />
			{!loading && !error && data && values &&
				<div className='result'>
					{/* <TaxonsList taxons={data} project_id={values.project_id} user_id={values!.user_id} csv={presentation.current.csv} /> */}
					<TaxonsList taxons={data} project_id={values.project_id} user_id={values!.user_id} csv={csv} />
				</div>
			}
		</Page>

	);
};