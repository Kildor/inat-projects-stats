import API from "../mixins/API";
import I18n from "./I18n";

const changeTaxonHandler = async function (this: React.Component<any, any>) {
	if (this.state.taxon_name.trim().length < 3) return;
	this.setState({ loading: true, loadingTitle: I18n.t("Поиск ID вида") });
	const regexp = /[0-9]+/;
	const taxonName = this.state.taxon_name;
	let taxon: {
		id: number
		name: string
		common: string
		lookupSuccess: boolean
	};
	if (!taxonName.match(regexp)) {
		taxon = await API.lookupTaxon(taxonName);
	} else {
		taxon = { id: taxonName, name: taxonName, common: taxonName, lookupSuccess: true };
	}
	this.setState((prevState: any) => {
		let taxons = prevState.taxons;
		taxons.push({ name: taxon.name, title: taxon.common });
		return { taxon_id: taxon.id, taxon_name: taxon.name, lookupSuccess: taxon.id !== 0, taxons: API.filterArray(taxons) };
	})
	if (taxon.id === 0) {
		this.setState({ loadingTitle: I18n.t("Поиск не удался, проверьте корректность введёного имени") });
	} else {
		this.setState({ loading: false });
	}
}

export { changeTaxonHandler };