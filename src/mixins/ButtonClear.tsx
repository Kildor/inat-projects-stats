import React from 'react'
import I18n from '../classes/I18n';

interface iButtonClearProps {
	onClickHandler: (e: React.MouseEvent) => void
	listName: string
}
const ButtonClear = ({onClickHandler, listName}: iButtonClearProps) => {
	return (
		<button onClick={onClickHandler} data-clear={listName} type='button' className='btn-small clear-datalist' 
		title={I18n.t("Очистить сохранённые имена")}><span role='img' aria-label={I18n.t("Очистить")}>❌</span></button>
	);
}

export default ButtonClear;