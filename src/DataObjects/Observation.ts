import { ObservationComment } from "./ObservationComment";
import { ObservationIdentification } from "./ObservationIdentification";
import { Taxon } from "./Taxon";
import { User } from "./User";
import { DateTimeFormat, makeCsvString } from "mixins/utils";
import { iCSVConvert, JSONObservationObject } from "interfaces";

export const getCSVHeader = () => makeCsvString('ID', 'Name', 'Common name', 'Quality grade', 'Observed', 'Uploaded', 'Coordinates', 'Location', 'User');

export class Observation implements iCSVConvert {
	created: Date;
	observed: Date;
	id: number;
	name: string;
	commonName: string | null;
	taxon: Taxon;
	user: User;
	coordinates: Array<number> | null;
	location: string | null | undefined;
	quality_grade: string;
	geoprivacy: string;
	activity: Array<ObservationComment | ObservationIdentification>;

	toCSV(onlyObservations = false) {
		let str = '';
		str += makeCsvString(
			this.id,
			this.name,
			this.commonName ?? '',
			this.quality_grade,
			DateTimeFormat.format(this.observed),
			DateTimeFormat.format(this.created),
			`${!!this.coordinates ? this.coordinates.toString() : 'Coordinates missed'}${this.geoprivacy === null ? '' : ' (' + this.geoprivacy + ')'}`,
			this.location ?? '',
			this.user.fullName,
		);

		if (onlyObservations !== false) str += '\t' + makeCsvString(...this.activity.map((activity) => activity.toCSVString()));

		return str;
	}
	constructor(jsonObservation: JSONObservationObject) {
		this.id = jsonObservation.id;
		this.taxon = new Taxon(jsonObservation.taxon);
		this.user = new User(jsonObservation.user);
		this.name = jsonObservation.taxon.name;
		this.commonName = jsonObservation.taxon.preferred_common_name;
		this.coordinates = jsonObservation?.geojson?.coordinates || null;
		this.location = jsonObservation.place_guess;
		this.quality_grade = jsonObservation.quality_grade;
		this.geoprivacy = jsonObservation.geoprivacy;
		this.created = new Date(jsonObservation.created_at);
		this.observed = new Date(jsonObservation.time_observed_at !== null ? jsonObservation.time_observed_at : jsonObservation.observed_on);
		this.activity = new Array<ObservationIdentification | ObservationComment>();

		jsonObservation.identifications.forEach(ident => {
			this.activity.push(new ObservationIdentification(ident))
		});
		jsonObservation.comments.forEach(item => {
			this.activity.push(new ObservationComment(item))
		});
		this.activity.sort((a, b) => +a.created - +b.created)
	}
}
