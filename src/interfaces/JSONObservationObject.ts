import  JSONCommentObject from "./JSONCommentObject";
import JSONGeoJSONObject from "./JSONGeoJSONObject";
import { JSONIdentificationObject } from "./JSONIdentificationObject";
import JSONTaxonObject from "./JSONTaxonObject";
import JSONUserObject from "./JSONUserObject";

export default interface JSONObservationObject {
	created_at: any;
	time_observed_at: any;
	id: number
	taxon: JSONTaxonObject
	geojson: JSONGeoJSONObject
	user: JSONUserObject
	identifications: Array<JSONIdentificationObject>
	comments: Array<JSONCommentObject>

}