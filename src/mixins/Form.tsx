import React, { ReactNode } from 'react'

import '../assets/Form.scss'

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
			<button disabled={disabled} type='submit' className="btn-submit">Запустить</button>
		</form>

	)
}