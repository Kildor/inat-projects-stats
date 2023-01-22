import { iCSVConvert, JSONUserObject } from "interfaces";
import { makeCsvString } from "mixins/API";
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

	toCSV = (index: number | false) => makeCsvString(
		typeof index === 'number' ? index + 1 : null,
		this.id,
		this.login,
		this.name ?? '',
		this.observations,
		this.species
	);
}