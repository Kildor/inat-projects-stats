import React from 'react';
import { FormControlField } from '../FormControl';
import { I18n } from 'classes';
import { FormControlFieldProps } from 'interfaces';

interface ProjectFieldProps extends Pick<FormControlFieldProps,
	'changeHandler' | 'list' | 'clearDatalistHandler' | 'comment' | 'listName'> {
	name?: FormControlFieldProps['name'];
	label?: FormControlFieldProps['label'];
}
export const ProjectField: React.FC<ProjectFieldProps> = ({ name = 'project_id', label = I18n.t("Id или имя проекта"), ...props }) => {
	return (
		<FormControlField
			name={name}
			label={label}
			comment={I18n.t("То, что используется в урле")}
			type='text'
			{...props}
		/>
	);
};
ProjectField.displayName = 'ProjectField';