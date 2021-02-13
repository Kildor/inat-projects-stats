import React from 'react'
import ButtonClear from './ButtonClear';

interface iDataList {
	list: Array<any>
	id: string
	clearDatalistHandler?: (e: React.MouseEvent) => void
	listName?: string
}
export default ({ list, id, clearDatalistHandler, listName }: iDataList) => {
	const clearButton = !!clearDatalistHandler && !!listName && list.length > 0 ? <ButtonClear onClickHandler={clearDatalistHandler} listName={listName} /> : null;
	return (
		<>
			{clearButton}
			<datalist id={id}>
				{list.map(item => <option key={item.name} value={item.name}>{!!item.title ? item.title : item.name}</option>)}
			</datalist>
		</>
	);
}