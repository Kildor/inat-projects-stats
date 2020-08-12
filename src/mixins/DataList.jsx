import React from 'react'

export default({list, id})=>{
	return (
		<datalist id={id}>
			{list.map(item => <option key={item.name} value={item.name}>{!!item.title ? item.title : item.name}</option>)}
		</datalist>
	);
}