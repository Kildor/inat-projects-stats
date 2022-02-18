import React, { ReactElement } from 'react'
import CSV from './CSV';
import { getCSVHeader, User } from '../DataObjects/User';
import I18n from '../classes/I18n';
import { getTitleForUserRole } from './API';
import '../assets/Users.scss';

export interface UsersListProps {
	users?: Array<User> | null
	total?: number
	csv: boolean | false
	filename?: string | "users.csv"
}
export default ({ users, total, csv = false, filename }: UsersListProps) => {
	let url = `https://www.inaturalist.org/people/`;
	if (!users || users.length === 0) return (
		<div>{I18n.t("Нет данных")}</div>
	);


	let list: ReactElement;
	if (csv) {
		list = <CSV header={getCSVHeader} useRank={false} filename={filename}>{users}</CSV>
	}else {
		list = <ol className='users'>{users.map(user => <li key={user.id} className={!!user.role ? `has-role has-role-${user.role}` : ''} title={getTitleForUserRole(user.role)}>
			<a href={url + user.login} target='_blank' rel='noopener noreferrer'>
				{!!user.name ? `${user.name} (@${user.login})` : `@${user.login}`}
				</a>
		</li>)}</ol>;

	}
	return (
		<>
			<p>{I18n.t("{1} пользователей:", [users.length])}</p>
			{users.length !== total && <p>{I18n.t("* Список неполон, должно быть {1} пользователей!", [''+total])}</p>}
			{list}
		</>
	)
} 