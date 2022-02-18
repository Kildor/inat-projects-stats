import { Taxon, User } from "DataObjects";
import React from "react";

export interface iComment {
	id: number
	user: User
	created: Date
	comment: string | null
}

export interface iIdentification extends iComment {
	taxon: Taxon
	current: boolean
	disagreement: boolean
}

export interface iLanguage {
	language: string
	code: string
}

export interface iLookupPlace {
	id: number
	name: string
	displayName?: string
	lookupSuccess?: boolean
}

export interface iLookupTaxon {
	score?: number;
	id: number
	name: string
	commonName?: string
	lookupSuccess?: boolean
}

export interface iModule {
	url: string;
	component: string; // unused
	title: {
		menu?: string;
		list?: string;
	} | string;
	description?: string;
	note?: string;
}

export interface iObjectsList {
	ids: Set<number>
	objects: Map<number, object | undefined | null>
	total: number
}

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

export interface iCSVConvert {
	toCSV(index?: number | boolean): string
}

export * from './FormControlTypes';
export * from './JSON'