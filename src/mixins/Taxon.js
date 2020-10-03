
class Taxon {
	id;
	name;
	rank;
	commonName;
	_count;
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
		this._count = count;
	}
	get count() {
		return this._count;
	}
}

export default Taxon;