import React from 'react';
import { CloseIcon } from './icons';

import 'assets/panel.scss';

interface PanelPros extends React.PropsWithChildren {
	/** Заголовок панели. */
	title?: string;
	/** Класс панели. */
	className?: string;
	/** Обработчик закрытия панели. */
	onClick?(): void;

}

export const Panel: React.FC<PanelPros> = ({ title, children, onClick, className }) => {
	return (
		<div className={'panel' + (className ? ' '+className : '')}>
			{onClick && <CloseIcon onClick={onClick} />}
			{title && <h3 className='title'>{title}</h3>}
			{children}
		</div>
	)
}