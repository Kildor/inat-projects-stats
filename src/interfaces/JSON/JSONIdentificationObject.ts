import { JSONCommentObject } from "./JSONCommentObject";
import { JSONTaxonObject } from "./JSONTaxonObject";

export interface JSONIdentificationObject extends JSONCommentObject {
	taxon: JSONTaxonObject
	current: boolean
	disagreement: boolean
	/** Использовались ли подсказки моделей компьютерного зрения. */
	vision: boolean
}
