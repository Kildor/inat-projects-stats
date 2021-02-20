import CSVConvertInterface from "../interfaces/CSVConvertInterface";

export function getCSVHeader (useRank: boolean) {
	let str = '';
	if (useRank) str += 'Rank\t';
	return str + `ID\tLogin\tName\tRole\n`
}

class User implements CSVConvertInterface {
	id: number;
	name: string;
	login: string;
	_role: string|null = null;
	constructor(json:any) {
		this.id = json.id;
		this.name = json.name;
		this.login = json.login;
	}
	set role (role:string|null) {
		this._role = role
	}
	get role(): string|null {
		return this._role;
	}
	get fullName() : string {
		let fullName = this.login;
		if (!!this.name) fullName+=' ('+this.name+')'
		return fullName;
	}

	toCSV(index: number | false) {
		let str = '';
		if (typeof index === 'number') {
			str += `${index + 1}\t`;
		}
		return str + `${this.id}\t${this.login}\t${!!this.name ? '"' + this.name + '"' : ''}\t${!!this.role ? this.role : ''}`;		
	}

}

export default User;