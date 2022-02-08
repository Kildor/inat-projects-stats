import CSVConvertInterface from "../interfaces/CSVConvertInterface";
import JSONTaxonObject from "../interfaces/JSON/JSONTaxonObject";

export const getCSVHeader = (useRank: boolean) => (`${useRank ? 'Rank\t' : ''}ID\tName\tCommon name\tRank\tCount\n`);

class Taxon implements CSVConvertInterface {
	toCSV(index: number | false) {
		let str = '';
		if (typeof index === 'number') {
			str += `${index + 1}\t`;
		}
		return str + `${this.id}\t"${this.name}"\t${!!this.commonName ? '"' + this.commonName + '"' : ''}\t${this.rank}\t${this.count}`;
	}
	id: number;
	name: string;
	rank: string;
	commonName: string | null;
	_count: number;
	constructor(jsonTaxon: JSONTaxonObject) {
		this.id = jsonTaxon.id;
		this.name = jsonTaxon.name;
		this.commonName = jsonTaxon.preferred_common_name;
		this.rank = jsonTaxon.rank;
		this._count = 0;
	}
	get fullName() {
		return !!this.commonName ? `${this.commonName} (${this.name})` : this.name;
	}
	/**
	 * @param {int} count
	 */
	set count(count: number) {
		this._count = count;
	}
	get count() {
		return this._count;
	}
}

export default Taxon;