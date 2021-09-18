import  JSONCommentObject from "./JSONCommentObject";
import JSONGeoJSONObject from "./JSONGeoJSONObject";
import { JSONIdentificationObject } from "./JSONIdentificationObject";
import JSONTaxonObject from "./JSONTaxonObject";
import JSONUserObject from "./JSONUserObject";

export default interface JSONObservationObject {
	quality_grade: string;
	observed_on: string;
	geoprivacy: string;
	created_at: string;
	time_observed_at: string | null;
	id: number
	taxon: JSONTaxonObject
	geojson: JSONGeoJSONObject
	place_guess: string | null | undefined;
	user: JSONUserObject
	identifications: Array<JSONIdentificationObject>
	comments: Array<JSONCommentObject>

}