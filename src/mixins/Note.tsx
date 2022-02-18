import React, { memo, ReactChildren } from 'react'
import I18n from 'classes/I18n';
import 'assets/Note.scss'
import { useToggler } from 'hooks';

export const Note = memo(({defCollapsed=true, children}: {defCollapsed?: boolean, children: ReactChildren | string})=>{
	const [collapsed, setCollapsed] = useToggler(defCollapsed);
	return (
		<div className={'note ' + (collapsed ? 'collapsed' : '')}>
			<span role='img' className='icon' aria-label={I18n.t("Описание работы")} title={I18n.t("Описание работы")} onClick={setCollapsed}>ℹ️</span>
			<p>{children}</p>
		</div>

	);
});