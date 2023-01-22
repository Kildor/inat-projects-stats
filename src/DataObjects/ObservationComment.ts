import { User } from "./User";
import { iComment, iCSVConvert, JSONCommentObject } from "interfaces";
import { DateTimeFormat } from "mixins/API";

export class ObservationComment implements iCSVConvert, iComment {
	id: number;
	user: User;
	created: Date;
	comment: string | null;

	constructor(jsonComment: JSONCommentObject) {
		this.id = jsonComment.id;
		this.user = new User(jsonComment.user);
		this.comment = jsonComment.body;
		this.created = new Date(jsonComment.created_at);

	}

	toCSV = () => '\t' + this.toCSVString();
	
	toCSVString = () => `${this.user.fullName}, ${DateTimeFormat.format(this.created)}: ${this.comment ?? ''}`;
}
