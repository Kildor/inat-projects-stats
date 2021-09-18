import React, { ReactChildren, useState } from 'react'
import I18n from '../classes/I18n';

export default ({defCollapsed=true, children}: {defCollapsed: boolean, children: ReactChildren})=>{
	const [collapsed, setCollapsed] = useState(defCollapsed);
	return (
		<p className={'note ' + (collapsed ? 'collapsed' : '')}>
			<strong onClick={() => setCollapsed(!collapsed)}>{I18n.t("Описание работы")}:</strong><br />
			{children}
		</p>

	);
}