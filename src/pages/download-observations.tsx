import React, { useCallback, useState } from 'react';
import { Observation, Taxon } from 'DataObjects';
import { I18n } from 'classes';
import { useDatalist, useInitialValues } from 'hooks';
import { PresentationSettingsList, StandartFormFields, StandartFormProps } from 'interfaces';
import API, { fillDateParams } from 'mixins/API';
import { FormControlField } from 'mixins/Form/FormControl';
import { FormControlTaxonField, ProjectField } from 'mixins/Form/fields';
import { DataControlsBlock, OtherControlsBlock } from 'mixins/Form/form-control-field-sets';
import { FormWrapper } from 'mixins/Form/form-wrapper';
import { Loader } from 'mixins/Loader';
import Page from 'mixins/Page';
import { PresentationSettings } from 'mixins/presentation-settings';
import { createQueryRequest } from 'mixins/utils';
import { Form, useField } from 'react-final-form';
import ObservationsList from 'mixins/ObservationsList';
import { useStatusMessageContext } from 'hooks/use-status-message-context';

const infoText = (<>
	{I18n.t("В поле таксона можно вводить как цифровой идентификатор, так и название (латинское или русское).")}
	{I18n.t("Если введён не ID, скрипт, после потери полем фокуса ввода, попытается найти таксон в базе iNaturalist, и подставить наиболее подходящий (по мнению айната) вариант.")}
	<br />{I18n.t("В поле места требуется вводить только цифровой идентификатор.")}
	<br />{I18n.t("В поле проекта можно ввести либо цифровой, либо строковый id (можно скопировать из адресной строки браузера).")}
</>);

interface DownloadObservationsFields extends StandartFormFields {
	hide_activity: boolean;
	show_discussion: boolean;
	current_ids: boolean;
};

interface DownloadObservationsPresentationSettingsList extends
	PresentationSettingsList,
	Pick<DownloadObservationsFields,
		'hide_activity' | 'show_discussion' | 'current_ids'> { }

const DownloadObservationsForm: React.FC<StandartFormProps<DownloadObservationsFields>> = ({ handleSubmit, optionValues = {}, onChangeHandler, loading = false }) => {
	const { datalists, clearDatalistHandler } = useDatalist(["users", "projects", "taxons", "places"]);

	const { input: { value: project_id } } = useField<string>('project_id');
	const { input: { value: taxon } } = useField<Taxon>('taxon');

	const disabled = Boolean(loading) && (project_id !== '' || taxon.id !== 0);

	return (
		<FormWrapper onSubmit={handleSubmit} disabled={disabled}>
			<fieldset className='noborder'>
				<FormControlTaxonField
					label={I18n.t("Таксон")}
					className='heading'
					name="taxon"
					changeHandler={onChangeHandler}
					list={datalists.taxons}
					listName="taxons"
					clearDatalistHandler={clearDatalistHandler}
				/>
			</fieldset>
			<fieldset>
				<legend>{I18n.t("Фильтрация")}</legend>
				<ProjectField
					list={datalists.projects}
					changeHandler={onChangeHandler}
					/>
				<FormControlField
					label={I18n.t("Id или имя пользователя")}
					comment={I18n.t("Можно вводить несколько идентификаторов через запятую.")}
					type='text'
					name='user_id'
					changeHandler={onChangeHandler}
					list={datalists.users}
					clearDatalistHandler={clearDatalistHandler}
					listName="users" />
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
			</fieldset>
			<DataControlsBlock handler={onChangeHandler} showDateAny />
			<OtherControlsBlock handler={onChangeHandler} optionValues={optionValues} />
		</FormWrapper>
	);
};
DownloadObservationsForm.displayName = 'DownloadObservationsForm';



export const DownloadObservations: React.FC = () => {
	const { getStatus, setStatus, setMessage, show: loading, setShow: setLoading } = useStatusMessageContext();

	const { statusMessage, statusTitle } = getStatus();
	const { values: initialValues, optionValues, onChangeHandler } = useInitialValues<DownloadObservationsFields>([
		"project_id", "user_id", "place_id", "taxon", "limit", "species_only", "quality_grade", "d1", "d2", "date_created", "date_any",
		"csv", 'current_ids', 'show_discussion', 'hide_activity'
	]);

	const [presentationSettingsList, setPresentation] = useState<DownloadObservationsPresentationSettingsList>({
		csv: initialValues!.csv,
		current_ids: initialValues!.current_ids,
		show_discussion: initialValues!.show_discussion,
		hide_activity: initialValues!.hide_activity,
	});
	const [data, setData] = useState<Observation[]>([]);
	const [error, setError] = useState<string>('');
	const [values, setValues] = useState<DownloadObservationsFields>(initialValues);

	const submitHandler = useCallback(
		async (newValues: DownloadObservationsFields) => {
			setValues(newValues);
			setError('')

			const { taxon, limit, project_id, user_id } = newValues;

			setStatus({ title: I18n.t("Загрузка наблюдений") });
			setLoading(true);

			const customParams = { ...createQueryRequest(newValues), ...fillDateParams(newValues), project_id, user_id };

			try {
				const observations = await API.fetchObservations(taxon.id, limit, customParams, setMessage);
				setData([...observations.ids].map(id => observations.objects.get(id)) as Observation[]);

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
		<Page title={I18n.t("Скачивание наблюдений")} infoText={infoText}>
			<Form
				initialValues={values}
				onSubmit={submitHandler}
				render={(props) => (<DownloadObservationsForm {...props} onChangeHandler={onChangeHandler} optionValues={optionValues} loading={loading} />
				)}
			/>

			<PresentationSettings onChangeHandler={onChangeHandler} setPresentation={setPresentation} values={presentationSettingsList as any as Record<string, boolean>}
				settings={[
					{ label: I18n.t("Показывать только наблюдения"), name: 'hide_activity' },
					{ label: I18n.t("Не отображать отозванные определения"), name: 'current_ids', hidden: presentationSettingsList.hide_activity || presentationSettingsList.show_discussion },
					{ label: I18n.t("Показывать дискуссии"), name: 'show_discussion', hidden: presentationSettingsList.hide_activity || presentationSettingsList.current_ids },
				]} />
			<Loader title={statusTitle} message={statusMessage} show={loading} />
			{!loading && !error &&
				<div className='result'>
					<ObservationsList observations={data} {...presentationSettingsList} />
				</div>
			}

		</Page >
	);
};

DownloadObservations.displayName = 'DownloadObservations';