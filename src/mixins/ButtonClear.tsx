import React from 'react'

interface iButtonClearProps {
	onClickHandler: (e: React.MouseEvent) => void
	listName: string
}
const ButtonClear = ({onClickHandler, listName}: iButtonClearProps) => {
	return (
		<button onClick={onClickHandler} data-clear={listName} type='button' className='btn-small clear-datalist' 
		title='Очистить сохранённые имена'><span role='img' aria-label='Clear'>❌</span></button>
	);
}

export default ButtonClear;