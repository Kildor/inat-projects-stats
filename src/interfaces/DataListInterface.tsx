import React from 'react';


export interface iDataListItem {
	title?: string;
	translated?: boolean | false;
	name: string;
}
export interface iDataList {
	list?: Array<iDataListItem>;
	id: string;
	clearDatalistHandler?: (e: React.MouseEvent) => void;
	listName?: string;
}
