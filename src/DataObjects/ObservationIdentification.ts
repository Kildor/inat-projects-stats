import CSVConvertInterface from "../interfaces/CSVConvertInterface";
import Taxon from "./Taxon";
import User from "./User";
import { JSONIdentificationObject } from "../interfaces/JSON/JSONIdentificationObject";
import IdentificationInterface from "../interfaces/IdentificationInterface";
import { DateTimeFormat } from "../mixins/API";

class ObservationIdentification implements CSVConvertInterface, IdentificationInterface {
	toCSV() {
		return `\t"${!this.current ? "[Dismissed] " : ""}${this.user.fullName}, ${DateTimeFormat.format(this.created)}: ${this.taxon.fullName} ${!!this.comment ? '\n' + this.comment + '' : ''}"`;
	}
	taxon: Taxon;
	id: number;
	user: User;
	created: Date;
	comment: string | null;
	current: boolean;
	disagreement: boolean;

	constructor(jsonComment: JSONIdentificationObject) {
		this.id = jsonComment.id;
		this.user = new User(jsonComment.user);
		this.taxon = new Taxon(jsonComment.taxon);
		this.comment = jsonComment.body;
		this.created = new Date(jsonComment.created_at);
		this.current = jsonComment.current;
		this.disagreement = jsonComment.disagreement;

	}
}

export default ObservationIdentification;