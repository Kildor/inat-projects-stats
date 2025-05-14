import { iCSVConvert, JSONTaxonObject } from "interfaces";
import { makeCsvString } from "mixins/utils";

export const getCSVHeader = (showTotal: boolean, firstObserved: boolean = false) => ((useRank: boolean) => makeCsvString(
	useRank ? 'Rank' : undefined,
	'ID',
	'Name',
	'Common name',
	'Rank',
	'Observations',
	showTotal ? 'Total' : undefined,
	firstObserved ? 'First observed' : undefined
));

export class Taxon implements iCSVConvert {
	toCSV = (index: number | false) => makeCsvString(
		typeof index === 'number' ? index + 1 : null,
		this.id,
		this.name,
		this.commonName || '',
		this.rank,
		this.count,
		this.countTotal > 0 ? this.countTotal : null,
		this.firstObserved ? this.firstObserved.toDateString() : null,
	);

	id: JSONTaxonObject['id'];
	name: JSONTaxonObject['name'];
	rank: JSONTaxonObject['rank'];
	commonName: JSONTaxonObject['preferred_common_name'];
	iconicTaxa: JSONTaxonObject['iconic_taxon_name'];
	count: number = 0;
	countTotal: number = 0;
	isObserved: boolean = false;
	firstObserved?: Date = undefined;

	constructor(jsonTaxon: JSONTaxonObject, count?: number) {
		this.id = jsonTaxon.id;
		this.name = jsonTaxon.name;
		this.commonName = jsonTaxon.preferred_common_name;
		this.rank = jsonTaxon.rank;
		this.iconicTaxa = jsonTaxon.iconic_taxon_name;

		if (count) {
			this.count = count;
		}
	}

	get fullName() {
		return !!this.commonName ? `${this.commonName} (${this.name})` : this.name;
	}
}
