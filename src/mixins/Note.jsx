import React, { useState } from 'react'

export default ({defCollapsed=true, children})=>{
	const [collapsed, setCollapsed] = useState(defCollapsed);
	return (
		<p className={'note ' + (collapsed ? 'collapsed' : '')}>
			<strong onClick={() => setCollapsed(!collapsed)}>Описание работы:</strong><br />
			{children}
		</p>

	);
}