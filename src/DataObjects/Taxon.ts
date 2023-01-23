import { iCSVConvert, JSONTaxonObject } from "interfaces";
import { makeCsvString } from "mixins/API";

export const getCSVHeader = (useRank: boolean) => makeCsvString(
	useRank ? 'Rank' : undefined,
	'ID',
	'Name',
	'Common name',
	'Rank',
	'Count');

export class Taxon implements iCSVConvert {
	toCSV = (index: number | false) => makeCsvString(
		typeof index === 'number' ? index + 1 : null,
		this.id,
		this.name,
		this.commonName || '',
		this.rank,
		this.count
	);

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
