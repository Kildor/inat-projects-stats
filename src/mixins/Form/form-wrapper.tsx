import React, { FormEventHandler, ReactNode } from 'react'

import '../../assets/Form.scss'
import I18n from '../../classes/I18n'

interface FormProps {
	onSubmit?: FormEventHandler<HTMLFormElement>
	disabled: boolean
	children: ReactNode
	submitTitle?: string
}

export const FormWrapper: React.FC<FormProps> = ({onSubmit = ()=>{}, disabled, children, submitTitle = I18n.t("Запустить")}) => {
	return (
		<form onSubmit={onSubmit}>
			<fieldset>
				{children}
			</fieldset>
			<button disabled={disabled} type='submit' className="btn-submit">{submitTitle}</button>
		</form>
	)
};
FormWrapper.displayName = 'FormWrapper';
