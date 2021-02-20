import User from "../DataObjects/User";

export default interface CommentInterface {
	id: number
	user: User
	created: Date
	comment: string | null
}