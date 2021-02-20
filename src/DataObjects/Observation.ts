import ObservationComment from "./ObservationComment";
import ObservationIdentification from "./ObservationIdentification";
import CSVConvertInterface from "../interfaces/CSVConvertInterface";
import JSONObservationObject from "../interfaces/JSONObservationObject";
import Taxon from "./Taxon";
import User from "./User";

const getCSVHeader = () => {
	let str = '';
	return str+`ID\tName\tCommon name\tData\tCoordinates\tUser\n`
}

class Observation implements CSVConvertInterface {
	created: Date;
	observed: Date;
	id: number;
	name: string;
	commonName: string | null;
	taxon: Taxon;
	user: User;
	coordinates: Array<number>
	activity: Array<ObservationComment | ObservationIdentification>;
	toCSV() {
		let str = '';
		str += `${this.id}\t"${this.name}"\t${!!this.commonName ? '"' + this.commonName + '"' : ''}\t${this.created.toLocaleString()}\t`
		+`${this.coordinates.toString()}\t${this.user.login} (${this.user.name})`;
		this.activity.forEach(activity=>{
			str+=activity.toCSV();
		})
		return str;

	}
	constructor(jsonObservation: JSONObservationObject) {
		this.id = jsonObservation.id;
		this.taxon = new Taxon(jsonObservation.taxon);
		this.user = new User(jsonObservation.user);
		this.name = jsonObservation.taxon.name;
		this.commonName = jsonObservation.taxon.preferred_common_name;
		this.coordinates = jsonObservation.geojson.coordinates;
		this.created = new Date(jsonObservation.created_at);
		this.observed = new Date(jsonObservation.time_observed_at);
		this.activity = new Array<ObservationIdentification | ObservationComment> ();
		jsonObservation.identifications.forEach(ident=>{
			this.activity.push(new ObservationIdentification(ident))
		});
		jsonObservation.comments.forEach(item=>{
			this.activity.push(new ObservationComment(item))
		});
		this.activity.sort((a, b) => +a.created - +b.created)
	}
}

export {getCSVHeader};
export default Observation;