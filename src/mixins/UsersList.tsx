import React, { ReactElement, useState } from 'react'
import CSV from './CSV';
import { getCSVHeader, User } from '../DataObjects/User';
import I18n from '../classes/I18n';
import { getTitleForUserRole } from './API';
import '../assets/Users.scss';
import { UserLink } from './UserLink';
import { SearchWidget } from './search-widget';

export interface UsersListProps {
	users?: Array<User> | null
	total?: number
	csv: boolean | false
	filename?: string | "users.csv"
}

export const UsersList: React.FC<UsersListProps> = ({ users, total, csv = false, filename }) => {
	const [search, setSearch] = useState('');

	if (!users || users.length === 0) return (
		<div>{I18n.t("Нет данных")}</div>
	);

	let list: ReactElement;
	if (csv) {
		list = <CSV header={getCSVHeader} useRank={false} filename={filename}>{users}</CSV>
	}else {
		list = <ol className='users'>{users.filter(user => search === '' || user.fullName.toLocaleLowerCase().includes(search.toLocaleLowerCase())).map(user => <li key={user.id} className={!!user.role ? `has-role has-role-${user.role}` : ''} title={getTitleForUserRole(user.role)}>
			<UserLink user={user} />
		</li>)}</ol>;

	}
	return (
		<>
			<p>{I18n.t("{1} пользователей:", [users.length])}</p>
			{users.length !== total && <p>{I18n.t("* Список неполон, должно быть {1} пользователей!", [''+total])}</p>}
			<SearchWidget value={search} setValue={setSearch} />
			{list}
		</>
	)
};
UsersList.displayName = 'UsersList';

export default UsersList;
