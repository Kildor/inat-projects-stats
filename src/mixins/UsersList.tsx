import React, { ReactElement } from 'react'
import User from './User';

export interface UsersListProps {
	users?: Array<User> | null
	total?: number
	csv: boolean
}
export default ({ users, total, csv = false }: UsersListProps) => {
	let url = `https://www.inaturalist.org/people/`;
	if (!users || users.length === 0) return (
		<div>Нет данных</div>
	);


	let list: ReactElement;
	if (csv) {
		let value = `ID\tLogin\tName\tRole\n`+
		users.map((user) => `${user.id}\t${user.login}\t${!!user.name ? '"'+user.name+'"' : ''}\t${!!user.role ? user.role : ''}`).join("\n");
		list = <textarea value={value} readOnly style={{width:"700px",maxWidth:"90vw", height:"200px"}} onFocus={(e)=>{e.target.select()}}/>
	}else {
		list = <ol className='users'>{users.map(user => <li key={user.id}>
			<a href={url + user.login} target='_blank' rel='noopener noreferrer'>
				{!!user.name ? `${user.name} (@${user.login})` : `@${user.login}`}
				</a>
		</li>)}</ol>;

	}
	return (
		<>
			<p>{users.length} пользователей:</p>
			{users.length !== total && <p>* Список неполон, должно быть {total} пользователей!</p>}
			{list}
		</>
	)
} 