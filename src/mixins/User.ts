
class User {
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
}

export default User;