import { User } from "./User";
import { iComment, iCSVConvert, JSONCommentObject } from "interfaces";

export class ObservationComment implements iCSVConvert, iComment {
	toCSV() {
		return `\t"${this.user.fullName}, ${this.created.toLocaleDateString()}: ${this.comment}"`;
	}
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
}
