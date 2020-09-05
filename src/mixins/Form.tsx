import React, { ReactChildren } from 'react'

import '../assets/Form.scss'

export interface FormProps {
	onSubmit: any
	disabled: boolean
	children: ReactChildren
}
export default ({onSubmit, disabled, children}: FormProps)=>{
	return (
		<form onSubmit={onSubmit}>
			<fieldset>
				{children}
			</fieldset>
			<button disabled={disabled} type='submit'>Запустить</button>
		</form>

	)
}