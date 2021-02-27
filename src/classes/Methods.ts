import LookupTaxon from "../interfaces/LookupTaxon";
import API from "../mixins/API";
import I18n from "./I18n";

const changeTaxonHandler = async function (this: React.Component<any, any>) {
	let taxonName = "";
	if (!!this.state.taxon && !!this.state.taxon.name) taxonName = this.state.taxon.name
	else if (!!this.state.taxon_name) taxonName = this.state.taxon_name;
	if (taxonName.trim().length < 3) return;
	this.setState({ loading: true, loadingTitle: I18n.t("Поиск ID вида") });
	const regexp = /[0-9]+/;
	let taxon: LookupTaxon;
	if (!taxonName.match(regexp)) {
		taxon = await API.lookupTaxon(taxonName);
	} else {
		taxon = { id: parseInt(taxonName), name: taxonName, commonName: taxonName, lookupSuccess: false };
	}
	this.setState((prevState: any) => {
		const newState: any = { taxon };
		if (taxon.id > 0) {
		let taxons = prevState.taxons;
		taxons.push({ name: taxon.name, title: taxon.commonName });
			newState['taxons'] = API.filterArray(taxons);
		}
		return newState;
	})
	if (taxon.id === 0) {
		this.setState({ loadingTitle: I18n.t("Поиск не удался, проверьте корректность введёного имени") });
	} else {
		this.setState({ loading: false });
	}
}

export { changeTaxonHandler };