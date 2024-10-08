import { I18n, Settings } from "classes";
import { Observation, Taxon, User } from "DataObjects";
import { iObserverProps, Observer } from "DataObjects/Observer";
import { iDataListItem, iLookupPlace, iLookupTaxon, iObjectsList } from "interfaces";
import { JSONLookupTaxonObject, JSONPlaceObject, JSONTaxonObject, JSONUserObject } from "interfaces/JSON";

const API = () => { };
API.BASE_URL = 'https://api.inaturalist.org/v1/';
API.LOCALE = 'ru';
API.DEBUG = !1;
export const addCustomParams = (customParams: Record<string, string | number>): string =>
	Object.keys(customParams).reduce((url, key) => url + `&${key}=${customParams[key]}`, '');

const cache = new Map<string, any>();

API.lookupTaxon = async (queryString: string) => {
	// https://api.inaturalist.org/v1/search?q=Ophioglossum%20vulgatum&sources=taxa
	let json;
	const taxon: iLookupTaxon = {
		score: 0.0, id: 0, name: queryString, commonName: '', lookupSuccess: false
	};
	queryString = queryString.toLowerCase();

	// if (cache.has(taxonName)) json = cache.get(taxonName);
	if (cache.has(queryString)) return cache.get(queryString);
	let url = API.getBaseUrl('search', `q=${encodeURIComponent(queryString)}&sources=taxa`);
	json = await fetch(url).then(res => res.json());
	// cache.set(taxonName, json);

	if (!!json.total_results) {
		json.results.forEach((result: JSONLookupTaxonObject) => {
			if (!taxon.score || taxon.score < result.score) {
				taxon.score = result.score;
				taxon.id = result.record.id;
				taxon.name = result.record.name;
				taxon.iconicTaxa = result.record.iconic_taxon_name;
				taxon.commonName = !!result.record.preferred_common_name ? result.record.preferred_common_name : taxon.name;
			}
		});
		taxon.lookupSuccess = true;
		cache.set(queryString, taxon);
	}
	return taxon;
}

API.lookupPlaces = async (queryString: string) => {
	// https://api.inaturalist.org/v1/places/autocomplete?q=iskitim
	let json;
	let places: iLookupPlace[] = [{
		id: 0, name: queryString, displayName: '', lookupSuccess: false
	}];
	queryString = queryString.toLowerCase();

	// if (cache.has(taxonName)) json = cache.get(taxonName);
	if (cache.has(queryString)) return cache.get(queryString);
	let url = API.getBaseUrl('search', `q=${encodeURIComponent(queryString)}&sources=taxa`);
	json = await fetch(url).then(res => res.json());
	// cache.set(taxonName, json);

	if (!!json.total_results) {
		places = json.results.map((result: JSONPlaceObject) => (
			{
				id: result.id,
				name: result.name,
				commonName: !!result.display_name ? result.display_name : result.name,
				lookupSuccess: true,
			})
		);
		cache.set(queryString, places);
	}
	return places;
}

API.getBaseUrl = (endpoint: string, tail: string = '') => {
	let locale = Settings.get("default_language", window.navigator.language);
	let place = Settings.get("default_place", "");
	if (place === "0") place = "7161";

	let url = `${API.BASE_URL}${endpoint}?locale=${locale}&preferred_place_id=${place}`;
	if (tail !== '') url += '&' + tail;
	return url;

}
API.fetchSpecies = async (project_id: string | null, user_id: string | null, d1: string | null, d2: string | null, dateCreated: boolean, callback: Function, customParams: Record<string, string | number> = {}) => {
	let taxons: iObjectsList<Taxon> = { ids: new Set(), objects: new Map<number, Taxon>(), total: 0 };
	// let url = `${API.BASE_URL}observations/species_counts?user_id=kildor&project_id=${project_id}&locale=${window.navigator.language}&preferred_place_id=7161`;
	let url = API.getBaseUrl('observations/species_counts');
	if (!!project_id) url += '&project_id=' + project_id;
	if (!!user_id) url += '&user_id=' + user_id;
	url += addCustomParams(fillDateParams({ d1: d1 ?? undefined, d2: d2 ?? undefined, date_created: dateCreated }));
	url += addCustomParams(customParams);

	let limit = (typeof customParams.limit === 'number' ? customParams.limit : parseInt(customParams.limit)) || 0;
	let totalCount = 0;
	let page = 0;
	let perPage = 0;

	if (limit > 0) url += `&per_page=${limit}`;


	do {
		page++;

		if (!!callback) {
			callback(createCallbackMessage(page, perPage, totalCount), true);
		}
		// const json = await API.debounceFetch(url + '&page=' + page);
		const json = await fetch(url + '&page=' + page).then(res => res.json()).catch(e => { throw e });
		// console.dir(json);
		totalCount = json.total_results;
		page = json.page;
		perPage = json.per_page;
		json.results.forEach((result: { taxon: JSONTaxonObject, count: number }) => {
			let t = new Taxon(result.taxon);
			t.count = result.count;
			taxons.objects.set(t.id, t);
			taxons.ids.add(t.id);
		});
		if (limit > 0 && page * perPage >= limit) break;
	} while (totalCount > page * perPage);
	taxons.total = totalCount;
	return taxons;
}

API.fetchSpeciesByDay = async (project_id: string, user_id: string, dateFrom: string, dateTo: string, dateCreated: boolean, callback: Function, customParams: Record<string, string | number> = {}) => {
	let taxons: iObjectsList<Taxon> = { ids: new Set(), objects: new Map<number, Taxon>(), total: 0 };
	// let url = `${API.BASE_URL}observations/species_counts?user_id=kildor&project_id=${project_id}&locale=${window.navigator.language}&preferred_place_id=7161`;
	let url = API.getBaseUrl('observations/species_counts');
	if (!!project_id) url += '&project_id=' + project_id;
	if (!!user_id) url += '&user_id=' + user_id;
	url += addCustomParams(fillDateParams({ d1: dateFrom, d2: dateTo, date_created: dateCreated }));
	url += addCustomParams(customParams);

	let limit = (typeof customParams.limit === 'number' ? customParams.limit : parseInt(customParams.limit)) || 0;
	let totalCount = 0;
	let page = 0;
	let perPage = 0;

	if (limit > 0) url += `&per_page=${limit}`;


	do {
		page++;

		if (!!callback) {
			callback(createCallbackMessage(page, perPage, totalCount), true);
		}
		// const json = await API.debounceFetch(url + '&page=' + page);
		const json = await fetch(url + '&page=' + page).then(res => res.json()).catch(e => { throw e });
		// console.dir(json);
		totalCount = json.total_results;
		page = json.page;
		perPage = json.per_page;
		json.results.forEach((result: { taxon: JSONTaxonObject, count: number }) => {
			let t = new Taxon(result.taxon);
			t.count = result.count;
			taxons.objects.set(t.id, t);
			taxons.ids.add(t.id);
		});
		if (limit > 0 && page * perPage >= limit) break;
	} while (totalCount > page * perPage);
	taxons.total = totalCount;
	return taxons;
}
API.fetchMembers = async (project_id: string, callback: Function) => {
	let users: iObjectsList<User> = { ids: new Set(), objects: new Map(), total: 0 };
	// let url = `${API.BASE_URL}observations/species_counts?user_id=kildor&project_id=${project_id}&locale=${window.navigator.language}&preferred_place_id=7161`;
	// let url = `${API.BASE_URL}observations/species_counts?project_id=${project_id}&locale=${window.navigator.language}&preferred_place_id=7161`; 
	let url = `${API.BASE_URL}projects/${project_id}/members?order_by=login&order=asc`;

	let totalCount = 0;
	let page = 0;
	let perPageFromJSON = 0;

	let perPage = 100;

	do {
		page++;

		if (!!callback) {
			callback(createCallbackMessage(page, perPageFromJSON, totalCount), true);
		}
		// const json = await API.debounceFetch(url + '&page=' + page);
		const json = await fetch(url + '&per_page=' + perPage + '&page=' + page).then(res => res.json()).catch(e => { throw new Error(`${e.message}, ${url}`) });
		totalCount = json.total_results;
		page = json.page;
		perPageFromJSON = json.per_page;
		json.results.forEach((result: { user: JSONUserObject, role: string }) => {
			let u = new User(result.user);
			u.role = result.role;
			users.objects.set(u.id, u);
			users.ids.add(u.id);
		});
		// console.dir(users.ids.size);
		// if (totalCount < page*perPageFromJSON && totalCount !== users.ids.size ) {
		// page = 0;
		// perPage-=20;
		// }
	} while (totalCount > page * perPageFromJSON);
	users.total = totalCount;
	return users;
}

API.fetchObservers = async (customParams: Record<string, string | number> = {}, limit: number = 0, callback?: Function) => {
	let url = API.getBaseUrl('observations/observers');
	url += addCustomParams(customParams);

	let observers: iObjectsList<Observer> = { ids: new Set(), objects: new Map(), total: 0 };

	let totalCount = 0;
	let page = 0;
	let perPageFromJSON = 0;

	let perPage = limit > 0 && limit < 501 ? limit : 500;
	do {
		page++;

		if (!!callback) {
			callback(createCallbackMessage(page, perPageFromJSON, totalCount), true);
		}
		const json = await fetch(url + '&per_page=' + perPage + '&page=' + page + '&limit=' + limit).then(res => res.json()).catch(e => { throw e });
		totalCount = json.total_results;
		page = json.page;
		perPageFromJSON = json.per_page;
		json.results.forEach((result: iObserverProps) => {
			let u = new Observer(result);

			observers.objects.set(u.id, u);
			observers.ids.add(u.id);
		});

		if (limit > 0 && limit <= observers.ids.size) break;
	} while (totalCount > page * perPageFromJSON);
	observers.total = totalCount;
	return observers;



}

API.fetchObservations = async (
	taxon_id: number, limit: number = 0, customParams: Record<string, string | number> = {}, callback?: Function
) => {
	let url = API.getBaseUrl('observations')
	if (taxon_id > 0) url += `&taxon_id=${taxon_id}`;

	url += addCustomParams(customParams);

	let observations: iObjectsList<Observation> = { ids: new Set(), objects: new Map(), total: 0 };

	let totalCount = 0;
	let page = 0;
	let perPageFromJSON = 0;

	let perPage = limit > 0 && limit < 100 ? limit : 100;
	let loadedObservations = 0;
	do {
		page++;

		if (!!callback) {
			callback(createCallbackMessage(page, perPageFromJSON, totalCount), true);
		}
		const json = await fetch(url + '&per_page=' + perPage + '&page=' + page).then(res => res.json()).catch(e => { throw e });
		totalCount = json.total_results;
		page = json.page;
		perPageFromJSON = json.per_page;
		for (let observation of json.results) {
			let o = new Observation(observation);
			observations.objects.set(o.id, o);
			observations.ids.add(o.id);
			if (limit > 0 && limit <= ++loadedObservations) break;
		}
		if (limit > 0 && limit <= loadedObservations) break;
	} while (totalCount > page * perPageFromJSON);
	observations.total = totalCount;
	return observations;
}

API.concatObjects = function (...objects: Array<iObjectsList<unknown>>) {
	let out: iObjectsList<unknown> = { ids: new Set(), total: 0, objects: new Map() };
	for (let obj in objects) {
		const objIn = objects[obj];
		if (!objIn.objects) continue;
		const inObjects = objIn.objects;
		let outObjects = out.objects;
		for (let id of objIn.ids) {
			if (!out.ids.has(id)) {
				out.ids.add(id);
				outObjects.set(id, inObjects.get(id));
			}
		}
		out.objects = outObjects;
	}
	out.total = out.ids.size;
	return out;
}
API.concatTaxons = API.concatObjects;

API.filterArray = (array: Array<Object>) => Array.from(new Set(array.map(item => JSON.stringify(item)))).map(json => JSON.parse(json))

API.filterDatalist = (datalist: iDataListItem[]) => Array.from(
	datalist.reduce((m, item) => m.set(item.name, item), new Map()).values()
)

export default API;


export const setTaxon = async function (taxon: iLookupTaxon, setState: Function) {
	let taxonName = "";
	if (!!taxon && !!taxon.name) taxonName = taxon.name
	else if (!!taxon.name) taxonName = taxon.name;
	if (taxonName.trim().length < 3) return;
	setState({ loading: true, loadingTitle: I18n.t("Поиск ID вида") });
	const regexp = /[0-9]+/;
	if (!taxonName.match(regexp)) {
		taxon = await API.lookupTaxon(taxonName);
	} else {
		taxon = { id: parseInt(taxonName), name: taxonName, commonName: taxonName, lookupSuccess: false };
	}
	setState((prevState: any) => {
		const newState: Record<string, iLookupTaxon | iDataListItem[]> = { taxon };
		if (taxon.id > 0) {
			newState['taxons'] = saveDatalist(taxon.name, taxon.commonName, prevState.taxons, 'taxons')
		}
		return newState;
	})
	if (taxon.id === 0) {
		setState({ loadingTitle: I18n.t("Поиск не удался, проверьте корректность введёного имени") });
	} else {
		setState({ loading: false });
	}
}

export const lookupTaxon = async function (taxonName: string | iLookupTaxon, setStatus: Function, setShow: Function) {
	if (typeof taxonName !== 'string') return taxonName;

	if (taxonName.trim().length < 3) return;
	setStatus(I18n.t("Поиск ID вида"));
	setShow(true);

	let taxon: iLookupTaxon;

	const regexpNumber = /[0-9]+/;
	const regexpCommon = /.+\(([ a-zA-Z]+)\)/;
	if (!taxonName.match(regexpNumber)) {
		const taxonCommon = taxonName.match(regexpCommon);
		if (taxonCommon && taxonCommon[1]) {
			taxonName = taxonCommon[1];
		}
		taxon = await API.lookupTaxon(taxonName);
	} else {
		taxon = { id: parseInt(taxonName), name: taxonName, commonName: taxonName, lookupSuccess: false };
	}

	if (taxon.id === 0) {
		setStatus(I18n.t("Поиск не удался, проверьте корректность введёного имени"));
	} else {
		setShow(false);
	}
	return taxon;
}

export const createCallbackMessage = (page: number, perPageFromJSON: number, totalCount: number): string => {
	return perPageFromJSON > 0 ?
		I18n.t('Загрузка {1} cтраницы из {2}', [page, 1 + ~~(totalCount / perPageFromJSON)]) :
		I18n.t('Загрузка {1} cтраницы', [page])
}

export const fillDateParams = ({ d1, d2, date_created, date_any = false }: { d1?: string, d2?: string, date_created?: boolean, date_any?: boolean }): Record<string, string> => {
	const dateParams: Record<string, string> = {}
	if (date_any) return dateParams;

	const datePrefix = date_created ? 'created_' : '';

	if (!!d1) dateParams[`${datePrefix}d1`] = d1;
	if (!!d2) dateParams[`${datePrefix}d2`] = d2;
	return dateParams;
}

export const saveDatalist = (name: string, title = name, datalist: iDataListItem[] = [], settingName: string): iDataListItem[] => {
	if (name.trim().length > 2 && !datalist.some(item => item.name === name)) {
		datalist.push({ name: name, title: title });
		datalist = API.filterDatalist(datalist);
		Settings.set(settingName, datalist);
	}
	return datalist;
}

export const getTitleForUserRole = (role: string | null): string => {
	switch (role) {
		case 'manager':
			return I18n.t('Менеджер проекта');
		case 'curator':
			return I18n.t('Куратор');
	}

	return '';
};
