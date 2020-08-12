import Taxon from './Taxon'
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

API.fetchSpecies = async (project_id, user_id, dateFrom, dateTo, callback)=>{
	let taxons = {ids:new Set(), taxons:{}, total:0};
	// let url = `${API.BASE_URL}observations/species_counts?user_id=kildor&project_id=${project_id}&locale=${window.navigator.language}&preferred_place_id=7161`;
	let url = `${API.BASE_URL}observations/species_counts?project_id=${project_id}&locale=${window.navigator.language}&preferred_place_id=7161`; 
	if (!!user_id) url +='&user_id='+user_id;
	if (!!dateFrom) url +='&created_d1='+dateFrom;
	if (!!dateTo) url +='&created_d2='+dateTo;

	let totalCount = 0;
	let page = 0;
	let perPage = 0;


	do {
		page++;

		if(!!callback) {
			callback(`Загрузка ${page} cтраницы` + (perPage > 0 ?` из ${1+~~(totalCount/perPage)}` : '' ), true);
		}
		const json = await fetch(url+'&page='+page).then(res=>res.json());
		totalCount = json.total_results;
		page = json.page;
		perPage = json.per_page;
		json.results.forEach(result=>{
			let t = new Taxon(result.taxon);
			taxons.taxons[t.id] = t;
			taxons.ids.add(t.id);
		})
	} while (totalCount > page*perPage);
	taxons.total = totalCount;
	return taxons;
}

API.concatTaxons = function () {
	let taxonsOut = { ids: new Set(), taxons: {}, total: 0 };
	for(let arg in arguments) {
		const taxonsIn = arguments[arg];
		console.dir(taxonsIn);
		if (!taxonsIn.taxons) continue;
	for( let id of taxonsIn.ids) {
		if (!taxonsOut.ids.has(id)) {
			console.dir(id)
			console.dir(typeof id)
		taxonsOut.ids.add(id);
		taxonsOut.taxons[id] = taxonsIn.taxons[id];
		}
	}
}
	taxonsOut.total = taxonsOut.ids.size;
	console.dir(taxonsOut)
	return taxonsOut;
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