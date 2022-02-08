import CSVConvertInterface from "../interfaces/CSVConvertInterface";
import JSONUserObject from "../interfaces/JSON/JSONUserObject";

export const getCSVHeader = (useRank: boolean) => (`${useRank ? 'Rank\t' : ''}ID\tLogin\tName\tRole\n`);

class User implements CSVConvertInterface {
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

export default User;