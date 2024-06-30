import React from 'react'
import { I18n } from 'classes';
import 'assets/common.scss';

interface ButtonClearProps {
	onClickHandler: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
	listName: string
}

export const ButtonClear = ({ onClickHandler, listName }: ButtonClearProps) => {
	return (
		<button onClick={onClickHandler} data-clear={listName} type='button' className='btn-small clear-datalist'
			title={I18n.t("Очистить сохранённые имена")}><span role='img' aria-label={I18n.t("Очистить")}>❌</span></button>
	);
};
