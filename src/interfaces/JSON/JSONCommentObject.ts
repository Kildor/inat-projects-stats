import JSONUserObject from "./JSONUserObject";


export default interface JSONCommentObject {
	id: number;
	user: JSONUserObject;
	created_at: string;
	body: string|null;
}
