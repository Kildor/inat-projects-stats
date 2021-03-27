import JSONTaxonObject from '../interfaces/JSONTaxonObject';
import JSONUserObject from '../interfaces/JSONUserObject';
import Taxon from '../DataObjects/Taxon'
import User from '../DataObjects/User';
import iObjectsList from '../interfaces/ObjectsList';
import JSONLookupTaxonObject from '../interfaces/JSONLookupTaxonObject';
import Observation from '../DataObjects/Observation';
import LookupTaxon from '../interfaces/LookupTaxon';
import I18n from '../classes/I18n';

// import debug_observation_json from '../assets/debug-observations.json';


const API = () => { };
API.BASE_URL = 'https://api.inaturalist.org/v1/';
API.LOCALE = 'ru';
API.DEBUG = !1;
function addCustomParams(customParams: any): string {
	let url = '';
	for (let key in customParams) {
		if (customParams.hasOwnProperty(key)) {
			url += `&${key}=${customParams[key]}`;
		}
	}
	return url;
}

const cache = new Map<string, any>();

API.lookupTaxon = async (taxonName: string) => {
	// https://api.inaturalist.org/v1/search?q=Ophioglossum%20vulgatum&sources=taxa
	let json;
	const taxon: LookupTaxon = {
		score: 0.0, id: 0, name: taxonName, commonName: '', lookupSuccess: false
	}
	taxonName = taxonName.toLowerCase();

	// if (cache.has(taxonName)) json = cache.get(taxonName);
	if (cache.has(taxonName)) return cache.get(taxonName);
		let url = API.getBaseUrl('search', `q=${encodeURIComponent(taxonName)}&sources=taxa`);
		json = await fetch(url).then(res => res.json());
		// cache.set(taxonName, json);

	if (!!json.total_results) {
		json.results.forEach((result: JSONLookupTaxonObject) => {
			if (!taxon.score || taxon.score < result.score) {
				taxon.score = result.score;
				taxon.id = result.record.id;
				taxon.name = result.record.name;
				taxon.commonName = !!result.record.preferred_common_name ? result.record.preferred_common_name : taxon.name;
			}
		});
		taxon.lookupSuccess = true;
		cache.set(taxonName, taxon);
	}
	return taxon;
}
API.getBaseUrl = (endpoint: string, tail: string = '') =>{
	let url = `${API.BASE_URL}${endpoint}?locale=${window.navigator.language}&preferred_place_id=7161`;
	if (tail !=='') url+='&'+tail;
	return url;

}
API.fetchSpecies = async (project_id: string, user_id: string, dateFrom: string, dateTo: string, callback: Function, customParams: any = {}) => {
	let taxons: iObjectsList = { ids: new Set(), objects: new Map<number, Taxon>(), total: 0 };
	// let url = `${API.BASE_URL}observations/species_counts?user_id=kildor&project_id=${project_id}&locale=${window.navigator.language}&preferred_place_id=7161`;
	let url = API.getBaseUrl('observations/species_counts');
	if (!!project_id) url += '&project_id=' + project_id;
	if (!!user_id) url += '&user_id=' + user_id;
	if (!!dateFrom) url += '&created_d1=' + dateFrom;
	if (!!dateTo) url += '&created_d2=' + dateTo;
	url += addCustomParams(customParams);

	let limit = customParams.limit || 0;
	let totalCount = 0;
	let page = 0;
	let perPage = 0;

	if (limit > 0) url += `&per_page=${limit}`;


	do {
		page++;

		if (!!callback) {
			callback(`Загрузка ${page} cтраницы` + (perPage > 0 ? ` из ${1 + ~~(totalCount / perPage)}` : ''), true);
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
	let users: iObjectsList = { ids: new Set(), objects: new Map(), total: 0 };
	// let url = `${API.BASE_URL}observations/species_counts?user_id=kildor&project_id=${project_id}&locale=${window.navigator.language}&preferred_place_id=7161`;
	// let url = `${API.BASE_URL}observations/species_counts?project_id=${project_id}&locale=${window.navigator.language}&preferred_place_id=7161`; 
	let url = `${API.BASE_URL}projects/${project_id}/members?order_by=id&order=asc`;

	let totalCount = 0;
	let page = 0;
	let perPageFromJSON = 0;

	let perPage = 100;

	do {
		page++;

		if (!!callback) {
			callback(`Загрузка ${page} cтраницы` + (perPageFromJSON > 0 ? ` из ${1 + ~~(totalCount / perPageFromJSON)}` : ''), true);
		}
		// const json = await API.debounceFetch(url + '&page=' + page);
		const json = await fetch(url + '&per_page=' + perPage + '&page=' + page).then(res => res.json()).catch(e => { throw e });
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

API.fetchObservations = async (
	taxon_id: number, dateFrom: string, dateTo: string, date_created: boolean, limit: number = 0, customParams: any = {}, callback?: Function
) => {
	let url = API.getBaseUrl('observations')
	if (taxon_id > 0 ) url +=`&taxon_id=${taxon_id}`;
	const datePrefix = date_created ? "created_" : "";
	if (!!dateFrom) url += `&${datePrefix}d1=${dateFrom}`;
	if (!!dateTo) url += `&${datePrefix}d2=${dateTo}`;
	url += addCustomParams(customParams);
	console.dir(url);

	let observations: iObjectsList = { ids: new Set(), objects: new Map(), total: 0 };
	// if (!!API.DEBUG) {
	// 	const json = debug_observation_json;
	// 	json.results.forEach((observation: JSONObservationObject) => {
	// 		let o = new Observation(observation);
	// 		observations.objects.set(o.id, o);
	// 		observations.ids.add(o.id);
	// 	});
	// 	observations.total = observations.ids.size;
	// 	return observations;
	// }

	let totalCount = 0;
	let page = 0;
	let perPageFromJSON = 0;

	let perPage = limit > 0 && limit < 100 ? limit : 100;
	let loadedObservations = 0;
	do {
		page++;

		if (!!callback) {
			callback(`Загрузка ${page} cтраницы` + (perPageFromJSON > 0 ? ` из ${1 + ~~(totalCount / perPageFromJSON)}` : ''), true);
		}
		const json = await fetch(url + '&per_page=' + perPage + '&page=' + page).then(res => res.json()).catch(e => { throw e });
		totalCount = json.total_results;
		page = json.page;
		perPageFromJSON = json.per_page;
		console.dir(typeof json.results);
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

API.concatObjects = function (...objects: Array<iObjectsList>) {
	let out: iObjectsList = { ids: new Set(), total: 0, objects: new Map() };
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

API.filterArray = (array: Array<any>) => Array.from(new Set(array.map(item => JSON.stringify(item)))).map(json => JSON.parse(json))

export default API;


const setTaxon = async function (taxon: LookupTaxon, setState: Function) {
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
		const newState: any = { taxon };
		if (taxon.id > 0) {
			let taxons = prevState.taxons;
			taxons.push({ name: taxon.name, title: taxon.commonName });
			newState['taxons'] = API.filterArray(taxons);
		}
		return newState;
	})
	if (taxon.id === 0) {
		setState({ loadingTitle: I18n.t("Поиск не удался, проверьте корректность введёного имени") });
	} else {
		setState({ loading: false });
	}
}

export { setTaxon };

export const DateTimeFormat = new Intl.DateTimeFormat([...navigator.languages], {
	year: 'numeric', month: 'numeric', day: 'numeric',
	hour: 'numeric', minute: 'numeric', second: 'numeric'
});