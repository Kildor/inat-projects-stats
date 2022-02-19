import { User } from "DataObjects";
import React from "react";

export const BASE_USERS_URL = `https://www.inaturalist.org/people/`;

export const UserLink: React.FC<{ user: User }> = ({ user }) => (
	<a href={BASE_USERS_URL + user.login} target='_blank' rel='noopener noreferrer'>
		{!!user.name ? `${user.name} (@${user.login})` : `@${user.login}`}
	</a>
);
