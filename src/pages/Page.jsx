import React from 'react'
import { Link } from 'react-router-dom';

import './Page.scss';

const Header = ({title, backlink}) => {
	if (!title && !backlink) return null;
	return (
		<header className={'page-title' + (!title?' no-title':'')}>
			{!!backlink && <Link to={backlink} className='title-backlink'>{'<<'}</Link>}
			{!!title && <span>{title}</span>}
		</header>
	);
}
export default ({title, children, backlink, className})=>{


	return (
		<div className={"page"+(!!className ? " "+className : "")}>
			<Header title={title} backlink={backlink} />
			<div className='page-content'>
				{children}
			</div>
		</div>
	)

}