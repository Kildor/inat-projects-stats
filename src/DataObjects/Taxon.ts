import { iCSVConvert, JSONTaxonObject } from "interfaces";
import { makeCsvString } from "mixins/utils";

export const getCSVHeader = (showTotal: boolean) => ((useRank: boolean) => makeCsvString(
	useRank ? 'Rank' : undefined,
	'ID',
	'Name',
	'Common name',
	'Rank',
	'Observations',
	showTotal ? 'Total' : undefined)
);

export class Taxon implements iCSVConvert {
	toCSV = (index: number | false) => makeCsvString(
		typeof index === 'number' ? index + 1 : null,
		this.id,
		this.name,
		this.commonName || '',
		this.rank,
		this.count,
		this.countTotal > 0 ? this.countTotal : null,
	);

	id: number;
	name: string;
	rank: string;
	commonName: string | null;
	count: number = 0;
	countTotal: number = 0;

	constructor(jsonTaxon: JSONTaxonObject) {
		this.id = jsonTaxon.id;
		this.name = jsonTaxon.name;
		this.commonName = jsonTaxon.preferred_common_name;
		this.rank = jsonTaxon.rank;
	}

	get fullName() {
		return !!this.commonName ? `${this.commonName} (${this.name})` : this.name;
	}
}
