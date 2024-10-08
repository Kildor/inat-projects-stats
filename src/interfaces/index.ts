import { Taxon, User } from "DataObjects";
import React from "react";
import { JSONTaxonObject } from "./JSON";

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

export interface iLanguageInfo {
	strings: Record<string, string | string[]>
	code: string,
	name: string,
	nplurals: number,
	plural: string,
}

export interface iLookupPlace {
	id: number
	name: string
	displayName?: string
	lookupSuccess?: boolean
}

export interface iLookupTaxon {
	score?: number;
	lookupSuccess?: boolean;
	id: JSONTaxonObject['id'];
	name: JSONTaxonObject['name'];
	commonName?: JSONTaxonObject['preferred_common_name'];
	iconicTaxa?: JSONTaxonObject['iconic_taxon_name'];
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

export interface iObjectsList<T> {
	ids: Set<number>
	objects: Map<number, T>
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
	clearDatalistHandler?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	listName?: string;
}

export interface iCSVConvert {
	toCSV(index?: number | boolean): string
}

export * from './FormControlTypes';
export * from './JSON';
export * from './form';
export * from './settingsTypes';