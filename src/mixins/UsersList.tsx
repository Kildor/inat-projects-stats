import React, { ReactElement } from 'react'
import CSV from './CSV';
import User, { getCSVHeader } from './User';

export interface UsersListProps {
	users?: Array<User> | null
	total?: number
	csv: boolean | false
	filename?: string | "users.csv"
}
export default ({ users, total, csv = false, filename }: UsersListProps) => {
	let url = `https://www.inaturalist.org/people/`;
	if (!users || users.length === 0) return (
		<div>Нет данных</div>
	);


	let list: ReactElement;
	if (csv) {
		list = <CSV header={getCSVHeader} useRank={false} filename={filename}>{users}</CSV>
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