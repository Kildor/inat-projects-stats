import React from 'react'

import { ReactComponent as Spinner } from '../assets/load.svg'

interface iLoader {
	title: string
	message?: string
	show?: boolean
}
export const Loader = ({ title, message, show }: iLoader) => {
	if (!show) return null;

	return (
		<div className='loader'>

			<h2><Spinner /> {title}</h2>
			{!!message && <p>{message}</p>}
		</div>
	)
}
