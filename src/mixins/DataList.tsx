import React from 'react'

interface iDataList {
	list: Array<any>
	id: string
}
export default({list, id}: iDataList)=>{
	return (
		<datalist id={id}>
			{list.map(item => <option key={item.name} value={item.name}>{!!item.title ? item.title : item.name}</option>)}
		</datalist>
	);
}