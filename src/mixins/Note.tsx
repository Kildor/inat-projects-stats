import React, { ReactChildren, useState } from 'react'

export default ({defCollapsed=true, children}: {defCollapsed: boolean, children: ReactChildren})=>{
	const [collapsed, setCollapsed] = useState(defCollapsed);
	return (
		<p className={'note ' + (collapsed ? 'collapsed' : '')}>
			<strong onClick={() => setCollapsed(!collapsed)}>Описание работы:</strong><br />
			{children}
		</p>

	);
}