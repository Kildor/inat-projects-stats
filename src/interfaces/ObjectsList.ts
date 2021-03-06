// import Taxon from "../mixins/Taxon";
// import User from "../mixins/User";

export default interface iObjectsList {
	ids: Set<number>
	objects: Map<number, object|undefined|null>
	total: number
}