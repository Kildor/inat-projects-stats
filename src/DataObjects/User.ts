import { iCSVConvert, JSONUserObject } from "interfaces";
import { getTitleForUserRole, makeCsvString } from "mixins/API";

export const getCSVHeader = (useRank: boolean) => makeCsvString(
	useRank ? 'Rank' : undefined,
	'ID',
	'Login',
	'Name',
	'Role');

export class User implements iCSVConvert {
	id: number;
	name: string;
	login: string;
	_role: string | null = null;
	constructor(json: JSONUserObject) {
		this.id = json.id;
		this.name = json.name;
		this.login = json.login;
		this.role = json.role || null;
	}
	set role(role: string | null) {
		this._role = role || null;
	}
	get role(): string | null {
		return this._role || '';
	}
	get fullName(): string {
		let fullName = this.login;
		if (!!this.name) fullName += ' (' + this.name + ')'
		return fullName;
	}

	toCSV = (index: number | false) => makeCsvString(
		typeof index === 'number' ? index + 1 : null,
		this.id,
		this.login,
		this.name ?? '',
		getTitleForUserRole(this.role)
	);
}
