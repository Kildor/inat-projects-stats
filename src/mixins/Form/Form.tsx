import React, { ReactNode } from 'react'

import '../../assets/Form.scss'
import I18n from '../../classes/I18n'

interface FormProps {
	onSubmit: any
	disabled: boolean
	children: ReactNode
	submitTitle?: string
}

export default ({onSubmit, disabled, children, submitTitle = I18n.t("Запустить")}: FormProps) => {
	return (
		<form onSubmit={onSubmit}>
			<fieldset>
				{children}
			</fieldset>
			<button disabled={disabled} type='submit' className="btn-submit">{submitTitle}</button>
		</form>
	)
}