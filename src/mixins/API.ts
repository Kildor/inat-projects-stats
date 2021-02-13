import JSONTaxonObject from '../interfaces/JSONTaxonObject';
import JSONUserObject from '../interfaces/JSONUserObject';
import Taxon from './Taxon'
import User from './User';
import iObjectsList from '../interfaces/ObjectsList';
import JSONLookupTaxonObject from '../interfaces/JSONLookupTaxonObject';
const API = ()=>{};
API.BASE_URL = 'https://api.inaturalist.org/v1/';
API.LOCALE = 'ru';
// https://api.inaturalist.org/v1/ 
//         observations?project_id=bioraznoobrazie-zameshalkinskogo-lesa&
//         user_id=kildor&created_d1=2020-05-01&created_d2=2020-06-01&
//         updated_since=2020-05-20&order=desc&order_by=created_at

/**
 * https://api.inaturalist.org/v1/observations/species_counts?
 * project_id=75512&user_id=kildor&
 * created_d1=2020-05-01&created_d2=2020-06-01
 * 
 */
 
/*
https://api.inaturalist.org/v1/observations/species_counts?project_id=75512
https://api.inaturalist.org/v1/observations/species-counts?project_id=75512&page=1
*/

/*
const trottle = 1000 // 1 sec;
API.awaiting = false;
API.debounceFetch = async function(url:string) {
	console.dir(url);
	console.dir(API.awaiting);
	if (!API.awaiting) {
		API.awaiting=true;
		setTimeout(()=>API.awaiting = false,trottle);
		return await fetch(url).then(res => res.json()).catch(e => { throw e });
	} else {
		setTimeout(API.debounceFetch(url),300);
	}
}
*/

API.lookupTaxon = async (taxonName: string) => {
	// https://api.inaturalist.org/v1/search?q=Ophioglossum%20vulgatum&sources=taxa
	let url = `${API.BASE_URL}search?q=${encodeURIComponent(taxonName)}&sources=taxa`;
	const json = await fetch(url).then(res=>res.json());
	let score = 0.0, id=0;
	if (!!json.total_results) {
		json.results.forEach((result: JSONLookupTaxonObject ) => {
			if (score < result.score) {
				score = result.score;
				id = result.record.id;
			}
		});
		console.dir(id);
		return id;
	}

	return 0;
}
API.fetchSpecies = async (project_id: string, user_id: string, dateFrom: string, dateTo: string, callback: Function, customParams: any={})=>{
	let taxons: iObjectsList = {ids:new Set(), objects: new Map<number, Taxon>(), total:0};
	// let url = `${API.BASE_URL}observations/species_counts?user_id=kildor&project_id=${project_id}&locale=${window.navigator.language}&preferred_place_id=7161`;
	let url = `${API.BASE_URL}observations/species_counts?locale=${window.navigator.language}&preferred_place_id=7161`; 
	if (!!project_id) url +='&project_id='+project_id;
	if (!!user_id) url +='&user_id='+user_id;
	if (!!dateFrom) url +='&created_d1='+dateFrom;
	if (!!dateTo) url +='&created_d2='+dateTo;
	for(let key in customParams) {
		if (customParams.hasOwnProperty(key)) {
			url +=`&${key}=${customParams[key]}`;
		}
	}

	let limit = customParams.limit || 0;
	let totalCount = 0;
	let page = 0;
	let perPage = 0;

	if (limit > 0) url += `&per_page=${limit}`;


	do {
		page++;

		if(!!callback) {
			callback(`Загрузка ${page} cтраницы` + (perPage > 0 ?` из ${1+~~(totalCount/perPage)}` : '' ), true);
		}
		// const json = await API.debounceFetch(url + '&page=' + page);
		const json = await fetch(url + '&page=' + page).then(res=>res.json()).catch(e=>{throw e});
		// console.dir(json);
		totalCount = json.total_results;
		page = json.page;
		perPage = json.per_page;
		json.results.forEach((result: {taxon: JSONTaxonObject, count: number} )=>{
			let t = new Taxon(result.taxon);
			t.count = result.count;
			taxons.objects.set(t.id, t);
			taxons.ids.add(t.id);
		});
		if (limit > 0 && page* perPage >= limit) break;
	} while (totalCount > page*perPage);
	taxons.total = totalCount;
	return taxons;
}
API.fetchMembers = async (project_id: string, callback:Function)=>{
	let users: iObjectsList = {ids:new Set(), objects: new Map(), total:0};
	// let url = `${API.BASE_URL}observations/species_counts?user_id=kildor&project_id=${project_id}&locale=${window.navigator.language}&preferred_place_id=7161`;
	// let url = `${API.BASE_URL}observations/species_counts?project_id=${project_id}&locale=${window.navigator.language}&preferred_place_id=7161`; 
	let url = `${API.BASE_URL}projects/${project_id}/members?order_by=id&order=asc`; 

	let totalCount = 0;
	let page = 0;
	let perPageFromJSON = 0;

	let perPage = 100;

	do {
		page++;

		if(!!callback) {
			callback(`Загрузка ${page} cтраницы` + (perPageFromJSON > 0 ?` из ${1+~~(totalCount/perPageFromJSON)}` : '' ), true);
		}
		// const json = await API.debounceFetch(url + '&page=' + page);
		const json = await fetch(url + '&per_page=' + perPage + '&page=' + page).then(res=>res.json()).catch(e=>{throw e});
		totalCount = json.total_results;
		page = json.page;
		perPageFromJSON = json.per_page;
		json.results.forEach((result: {user: JSONUserObject, role: string})=>{
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
	} while (totalCount > page*perPageFromJSON);
	users.total = totalCount;
	return users;
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
				outObjects.set(id,inObjects.get(id));
			}
		}
		out.objects = outObjects;
	}
	out.total = out.ids.size;
	return out;
}
API.concatTaxons = API.concatObjects;

export default API;