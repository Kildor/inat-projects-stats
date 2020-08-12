import React from 'react'

import {ReactComponent as Spinner} from '../assets/load.svg'

export default ({title, message, show})=>{
	if (!show) return null;
	return (
		<div className='loader'>

			<h2><Spinner/> {title}</h2>
			{!!message && <p>{message}</p>}
		</div>
	)
}