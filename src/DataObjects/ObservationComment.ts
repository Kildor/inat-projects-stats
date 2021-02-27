import CSVConvertInterface from "../interfaces/CSVConvertInterface";
import User from "./User";
import JSONCommentObject from "../interfaces/JSONCommentObject";
import CommentInterface from "../interfaces/CommentInterface";

class ObservationComment implements CSVConvertInterface, CommentInterface {
	toCSV() {
		return `\t"${this.user.fullName}, ${this.created.toLocaleDateString()}: ${this.comment}"`;
	}
	id: number;
	user: User;
	created: Date;
	comment: string|null;

	constructor(jsonComment: JSONCommentObject) {
		this.id = jsonComment.id;
		this.user = new User(jsonComment.user);
		this.comment = jsonComment.body;
		this.created = new Date(jsonComment.created_at);

	}
}

export default ObservationComment;