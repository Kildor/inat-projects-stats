import ObservationComment from "./ObservationComment";
import ObservationIdentification from "./ObservationIdentification";
import CSVConvertInterface from "../interfaces/CSVConvertInterface";
import JSONObservationObject from "../interfaces/JSONObservationObject";
import Taxon from "./Taxon";
import User from "./User";

const getCSVHeader = () => {
	let str = '';
	return str+`ID\tName\tCommon name\tQuality grade\tData\tCoordinates\tLocation\tUser\n`
}

class Observation implements CSVConvertInterface {
	created: Date;
	observed: Date;
	id: number;
	name: string;
	commonName: string | null;
	taxon: Taxon;
	user: User;
	coordinates: Array<number> | null;
	location: string|null|undefined;
	quality_grade: string;
	geoprivacy: string;
	activity: Array<ObservationComment | ObservationIdentification>;
	toCSV(onlyObservations = false ) {
		let str = '';	
		str += `${this.id}\t"${this.name}"\t${!!this.commonName ? '"' + this.commonName + '"' : ''}\t${this.quality_grade}\t${this.created.toLocaleString()}\t`
			+ `${!!this.coordinates ? this.coordinates.toString():'coordinates missed'}${this.geoprivacy===null?'':' ('+this.geoprivacy+')'}\t"${this.location}"\t${this.user.fullName}`;
		if (onlyObservations!==false) this.activity.forEach(activity=>{
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
		this.coordinates = !! !!jsonObservation.geojson ? jsonObservation.geojson.coordinates : null;
		this.location = jsonObservation.place_guess;
		this.quality_grade = jsonObservation.quality_grade;
		this.geoprivacy = jsonObservation.geoprivacy;
		this.created = new Date(jsonObservation.created_at);
		this.observed = new Date(jsonObservation.time_observed_at !== null ? jsonObservation.time_observed_at : jsonObservation.observed_on);
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