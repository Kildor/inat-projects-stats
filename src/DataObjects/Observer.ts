import { iCSVConvert, JSONUserObject } from "interfaces";
import { User } from "./User";

export const getCSVHeader = (useRank: boolean) => (`${useRank ? 'Rank\t' : ''}ID\tLogin\tName\tObservations\tSpecies\n`);

export interface iObserverProps {
	user: JSONUserObject;
	species_count: number;
	observation_count: number;
}
export class Observer extends User implements iCSVConvert {
	observations: number;
	species: number;

	constructor({ user, species_count, observation_count }: iObserverProps) {
		super(user);
		this.observations = observation_count;
		this.species = species_count;
	}

	toCSV(index: number | false) {
		let str = '';
		if (typeof index === 'number') {
			str += `${index + 1}\t`;
		}
		return str + `${this.id}\t${this.login}\t${!!this.name ? '"' + this.name + '"' : ''}\t${this.observations}\t${this.species}`;
	}


}