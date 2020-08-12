
class Taxon {
	id;
	name;
	rank;
	commonName;
	constructor(jsonTaxon) {
		this.id = jsonTaxon.id;
		this.name = jsonTaxon.name;
		this.commonName = jsonTaxon.preferred_common_name;
		this.rank = jsonTaxon.rank;
	}
	/**
	 * @param {int} count
	 */
	set count(count) {
		this.count = count;
	}
}

export default Taxon;