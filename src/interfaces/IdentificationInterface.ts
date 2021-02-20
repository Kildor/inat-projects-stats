import Taxon from "../DataObjects/Taxon";
import CommentInterface from "./CommentInterface";

export default interface IdentificationInterface extends CommentInterface {
	taxon: Taxon
	current: boolean
	disagreement: boolean
}
