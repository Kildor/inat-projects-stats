import React from 'react'
import { Link } from 'react-router-dom';

import '../assets/Page.scss';

const Header = ({title, backlink}) => {
	if (!title && !backlink) return null;
	return (
		<header className={'page-title' + (!title?' no-title':'')}>
			{!!backlink && <Link to={backlink} className='title-backlink'>&#10094;&#10094;</Link> }
			{!!title && <span>{title}</span>}
		</header>
	);
}
export default ({title, children, backlink, className, pageTitle})=>{
	if (!!pageTitle) document.title = pageTitle;
	else if(!!title) document.title = title;

	return (
		<div className={"page"+(!!className ? " "+className : "")}>
			<Header title={title} backlink={backlink} />
			<div className='page-content'>
				{children}
			</div>
		</div>
	)

}