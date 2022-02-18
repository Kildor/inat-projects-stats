import React from 'react'
import I18n from '../classes/I18n';
import ButtonClear from './ButtonClear';
import API from './API';
import { iDataList } from 'interfaces';

export default ({ list = [], id, clearDatalistHandler, listName }: iDataList) => {
	const clearButton = !!clearDatalistHandler && !!listName && list.length > 0 ? <ButtonClear onClickHandler={clearDatalistHandler} listName={listName} /> : null;
	return (
		<>
			{clearButton}
			<datalist id={id}>
				{API.filterDatalist(list).map(item => {
					const title = !!item.title ? item.title : item.name;
					return ({ ...item, title: item.translated ? I18n.t(title) : title });
				}).map(item => <option key={item.name} value={item.name}>{item.title}</option>)}
			</datalist>
		</>
	);
}