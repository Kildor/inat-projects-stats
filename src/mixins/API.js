import Taxon from './Taxon'
import User from './User';
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

const trottle = 1000 // 1 sec;
API.awaiting = false;


API.debounceFetch = async function(url) {
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
API.fetchSpecies = async (project_id, user_id, dateFrom, dateTo, callback, customParams={})=>{
	let taxons = {ids:new Set(), taxons:{}, total:0};
	// let url = `${API.BASE_URL}observations/species_counts?user_id=kildor&project_id=${project_id}&locale=${window.navigator.language}&preferred_place_id=7161`;
	let url = `${API.BASE_URL}observations/species_counts?project_id=${project_id}&locale=${window.navigator.language}&preferred_place_id=7161`; 
	if (!!user_id) url +='&user_id='+user_id;
	if (!!dateFrom) url +='&created_d1='+dateFrom;
	if (!!dateTo) url +='&created_d2='+dateTo;
	for(let key in customParams) {
		if (customParams.hasOwnProperty(key)) {
			url +=`&${key}=${customParams[key]}`;
		}
	}

	let totalCount = 0;
	let page = 0;
	let perPage = 0;

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
		json.results.forEach(result=>{
			let t = new Taxon(result.taxon);
			t.count = result.count;
			taxons.taxons[t.id] = t;
			taxons.ids.add(t.id);
		})
	} while (totalCount > page*perPage);
	taxons.total = totalCount;
	return taxons;
}
API.fetchMembers = async (project_id, callback)=>{
	let users = {ids:new Set(), users:{}, total:0};
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
		json.results.forEach(result=>{
			let u = new User(result.user);
			u.role = result.role;
			users.users[u.id] = u;
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

API.concatObjects = function (key, ...objects) {
	let out = { ids: new Set(), total: 0 };
	out[key] = {};
	console.dir(objects);
	for (let obj in objects[0]) {
		const objIn = objects[0][obj];
		if (!objIn[key]) continue;
		const inObjects = objIn[key];
		let outObjects = out[key];
		for (let id of objIn.ids) {
			if (!out.ids.has(id)) {
				out.ids.add(id);
				outObjects[id] = inObjects[id];
			}
		}
		console.dir(outObjects);
		out[key] = outObjects;
	}
	out.total = out.ids.size;
	console.dir(out);
	return out;
}
API.concatTaxons = function () {
	return API.concatObjects('taxons', arguments);
}

export class Settings {
	static SettingsName = 'inat-projects-stats';

	static loadFromStorage = ()=> {
		try {
		let val = localStorage.getItem(this.SettingsName);
		if (val === null) val = "{}";
		return JSON.parse(val);
		} catch(e) {
		}
		return {};
	}
	static get = (name, def) => {
		const settings = this.loadFromStorage();
	
		if (settings.hasOwnProperty(name)) return settings[name];
		return def;
	}
	static set = (name, value) => {
		const settings = this.loadFromStorage();
		settings[name] = value;
		localStorage.setItem(this.SettingsName, JSON.stringify(settings));
		return value;
	}
}

export default API;