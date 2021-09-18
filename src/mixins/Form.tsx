import React, { ReactNode } from 'react'

import '../assets/Form.scss'
import I18n from '../classes/I18n'

export interface FormProps {
	onSubmit: any
	disabled: boolean
	children: ReactNode
}
export default ({onSubmit, disabled, children}: FormProps)=>{
	return (
		<form onSubmit={onSubmit}>
			<fieldset>
				{children}
			</fieldset>
			<button disabled={disabled} type='submit' className="btn-submit">{I18n.t("Запустить")}</button>
		</form>
	)
}