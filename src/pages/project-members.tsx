import I18n from 'classes/I18n';
import { StatusMessageContext } from 'contexts/status-message-context';
import { useDatalist, useInitialValues } from 'hooks';
import { Error } from 'mixins/Error';
import { Loader } from 'mixins/Loader';
import { FormWrapper } from 'mixins/Form/form-wrapper';
import Page from 'mixins/Page';
import UsersList from 'mixins/UsersList';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { Form, useField } from 'react-final-form';
import API from 'mixins/API';
import { User } from 'DataObjects';
import { useStatusMessageContext } from 'hooks/use-status-message-context';
import { PresentationSettingsList, StandartFormFields, StandartFormProps } from 'interfaces';
import { PresentationSettings as PresentationSettingsComponent } from 'mixins/presentation-settings';
import { ProjectField } from 'mixins/Form';

interface ProjectMembersFields extends Pick<StandartFormFields, 'csv'> {
	project_id: string;
}

const ProjectMembersForm: React.FC<StandartFormProps<ProjectMembersFields>> = ({ handleSubmit, onChangeHandler }) => {
	const { datalists, clearDatalistHandler } = useDatalist(["projects"]);
	const { show: loading } = useContext(StatusMessageContext);

	const { input: { value: projectIdValue } } = useField('project_id');

	const disabled = loading || projectIdValue === '';

	return (
		<FormWrapper onSubmit={handleSubmit} disabled={disabled}>
			<fieldset className='noborder'>
				<ProjectField
					list={datalists.projects}
					listName='projects'
					clearDatalistHandler={clearDatalistHandler}
					changeHandler={onChangeHandler}
				/>
			</fieldset>
		</FormWrapper>
	);
};

export const ProjectMembers: React.FC = () => {
	const { getStatus, setStatus, setMessage, show: loading, setShow: setLoading } = useStatusMessageContext();

	const { values: initialValues, onChangeHandler } = useInitialValues(['project_id', 'csv']);
	const [values, setValues] = useState<ProjectMembersFields>(initialValues);

	const filename = useRef<string>('state.csv');

	const [data, setData] = useState<{ members: Array<User> | null, total: number }>({ members: [], total: 0 });
	const [{ csv }, setPresentation] = useState<PresentationSettingsList>({ csv: initialValues!.csv });
	const [error, setError] = useState<string>('');

	const { statusMessage, statusTitle } = getStatus();

	const submitHandler = useCallback((newValues: ProjectMembersFields): void => {
		setError('')
		setValues(newValues);
		filename.current = newValues.project_id + '-members.csv';
		setStatus({ title: I18n.t("Загрузка участников") });
		setLoading(true);

		API.fetchMembers(newValues.project_id, setMessage)
			.then(members => ({ total: members.total, members: [...members.ids].filter(id => members.objects.has(id)).map(id => members.objects.get(id)!) })).then(data => {
				if (data.members) {
					setData(data);
					setLoading(false);
				}
			}).catch((e) => {
				console.error(e);
				setData({ members: [], total: 0 });
				setError(e.message);

			}).finally(() => {
				setLoading(false);
			});
	}, [setLoading, setMessage, setStatus]);

	return (
		(<Page title={I18n.t("Участники проекта")} className='page-members'>
			<Form
				initialValues={values}
				onSubmit={submitHandler}
				render={(props) => <ProjectMembersForm {...props} onChangeHandler={onChangeHandler} />}
			/>
			<PresentationSettingsComponent setPresentation={setPresentation} values={{ csv }} onChangeHandler={onChangeHandler} />
			<Loader title={statusTitle} message={statusMessage} show={loading} />
			<Error error={error} {...values} />
			{!loading && data && (
				<div className='result'>
					<UsersList users={data.members} total={data.total} csv={csv} filename={filename.current} />
				</div>
			)}
		</Page>)
	);

};

ProjectMembers.displayName = 'ProjectMembers';
