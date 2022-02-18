import { iCSVConvert, JSONUserObject } from "interfaces";

export const getCSVHeader = (useRank: boolean) => (`${useRank ? 'Rank\t' : ''}ID\tLogin\tName\tRole\n`);

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

	toCSV(index: number | false) {
		let str = '';
		if (typeof index === 'number') {
			str += `${index + 1}\t`;
		}
		return str + `${this.id}\t${this.login}\t${!!this.name ? '"' + this.name + '"' : ''}\t${this.role}`;
	}

}
