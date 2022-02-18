import  { JSONCommentObject } from "./JSONCommentObject";
import { JSONIdentificationObject } from "./JSONIdentificationObject";
import { JSONTaxonObject } from "./JSONTaxonObject";
import { JSONUserObject } from "./JSONUserObject";

export interface JSONObservationObject {
	quality_grade: string;
	observed_on: string;
	geoprivacy: string;
	created_at: string;
	time_observed_at: string | null;
	id: number
	taxon: JSONTaxonObject
	geojson: {
		coordinates: number[] | null
	}
	place_guess: string | null | undefined;
	user: JSONUserObject
	identifications: Array<JSONIdentificationObject>
	comments: Array<JSONCommentObject>

}