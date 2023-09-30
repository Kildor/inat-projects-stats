import React, { useCallback, useState } from 'react';
import I18n from 'classes/I18n';
import { useDatalist, useInitialValues } from 'hooks';
import { Error } from 'mixins/Error';
import { Loader } from 'mixins/Loader';
import Page from 'mixins/Page';
import { FormWrapper } from 'mixins/Form/form-wrapper';
import TaxonsList from 'mixins/TaxonsList';
import { Form, useField } from 'react-final-form';
import { FormControlCheckboxField, FormControlField, FormControlTaxonField } from 'mixins/Form/FormControl';
import { Taxon } from 'DataObjects';
import { StandartFormProps, StandartFormFields, PresentationSettingsList, iObjectsList } from 'interfaces';
import API from 'mixins/API';
import { PresentationSettings } from 'mixins/presentation-settings';
import { DataControlsBlock, OtherControlsBlock } from 'mixins/Form/form-control-field-sets';
import { createQueryRequest } from 'mixins/utils';
import { useStatusMessageContext } from 'hooks/use-status-message-context';

export interface NewSpeciesFields extends Omit<StandartFormFields, 'date_any'> {
	unobserved_by_user_id: string;
	show_first: boolean,
}

const NewSpeciesForm: React.FC<StandartFormProps<NewSpeciesFields>> = ({ handleSubmit, onChangeHandler, optionValues = {} }) => {
	const { clearDatalistHandler, datalists } = useDatalist(["users", "projects", "taxons", "places"]);
	const { input: { value: d2 } } = useField<string>('d2');
	const { input: { value: taxon } } = useField<string>('taxon');
	const { input: { value: user_id } } = useField<string>('user_id');
	const { input: { value: place_id } } = useField<string>('place_id');
	const { input: { value: project_id } } = useField<string>('project_id');

	const disabled = !Boolean(taxon || user_id || place_id || project_id);

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
					type='text'
					name='user_id'
					changeHandler={onChangeHandler}
					list={datalists.users}
					clearDatalistHandler={clearDatalistHandler}
					listName="users" />
				<FormControlField
					label={I18n.t("Id места для сравнения")}
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
			<DataControlsBlock handler={onChangeHandler}>
				{d2 && <FormControlCheckboxField label={I18n.t("Показывать виды, впервые зарегистрированные в этот период")} name='show_first' handler={onChangeHandler} />}
			</DataControlsBlock>
			<OtherControlsBlock limit={false} handler={onChangeHandler} optionValues={optionValues} />

		</FormWrapper >
	);
};

export const NewSpecies: React.FC = () => {
	const { getStatus, setStatus, setMessage, show: loading, setShow: setLoading } = useStatusMessageContext();

	const { statusMessage, statusTitle } = getStatus();
	const { usedSettings, values: initialValues, optionValues, onChangeHandler } = useInitialValues<NewSpeciesFields>([
		"project_id", "user_id", "place_id", "taxon", "csv", "limit", "show_first", "d1", "d2", "date_created", "species_only",
		"quality_grade", "additional"
	], { "date_created": true });

	const [{ csv }, setPresentation] = useState<PresentationSettingsList>({ csv: initialValues!.csv });
	const [data, setData] = useState<Taxon[]>([]);
	const [error, setError] = useState<string>('');
	const [values, setValues] = useState<NewSpeciesFields>();

	const submitHandler = useCallback(async (newValues: NewSpeciesFields) => {
		setLoading(true);
		setStatus(I18n.t("Загрузка новых видов"));

		const { project_id, user_id, d1, d2, date_created, show_first } = newValues;

		const customParams = createQueryRequest(newValues);

		try {

			const newTaxa = await API.fetchSpecies(project_id, user_id, d1, d2, date_created, setMessage, customParams);

			if (newTaxa.total === 0) {
				return;
			}

			setStatus(I18n.t("Загрузка всех видов"));

			let allTaxa: iObjectsList<unknown> = { ids: new Set(), total: 0, objects: new Map() };
			if (d1 !== '') {
				const alld2 = new Date(d1);
				alld2.setDate(alld2.getDate() - 1);
				allTaxa = API.concatTaxons(await API.fetchSpecies(project_id, user_id, null, alld2.toISOString().substring(0, 10), date_created, setMessage, customParams));
			}
			if (d2 !== '' && !show_first) {
				const alld1 = new Date(d2);
				alld1.setDate(alld1.getDate() + 1);
				allTaxa = API.concatTaxons(allTaxa, await API.fetchSpecies(project_id, user_id, alld1.toISOString().substring(0, 10), null, date_created, setMessage, customParams));
			}

			setStatus({ title: I18n.t("Обработка загруженных данных") });

			setData([...newTaxa.ids].filter(id => !allTaxa.ids.has(id)).map(id => newTaxa.objects.get(id)) as Taxon[]);
		} catch (e: any) {
			console.error(e);
			setError(e.message)
		} finally {
			setLoading(false);

		}

		setValues(newValues);
	}, [setLoading, setMessage, setStatus]);

	return (
		<Page title={I18n.t('Новые виды')} className='page-newSpecies' infoText={I18n.t("pages.new-species.note.text")}>
			<Form
				initialValues={values}
				onSubmit={submitHandler}
				render={(props) => (<NewSpeciesForm {...props} usedSettings={usedSettings} optionValues={optionValues} onChangeHandler={onChangeHandler} />
				)}
			/>
			<PresentationSettings onChangeHandler={onChangeHandler} setPresentation={setPresentation} values={{ csv }} />
			<Loader title={statusTitle} message={statusMessage} show={loading} />
			<Error error={error} />
			{!loading && !error && data && values &&
				<div className='result'>
					<TaxonsList taxons={data} project_id={values.project_id} user_id={values!.user_id} csv={csv} />
				</div>
			}
		</Page>

	);

}