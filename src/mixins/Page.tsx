import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom';

import '../assets/pages/Page.scss';


interface iHeader {
	title?: string
	backlink?: string | false
}
interface iPage {
	title?: string
	pageTitle?: string
	backlink?: string | false
	className?: string
}

const Header = ({title, backlink}: iHeader) => {
	if (!title && !backlink) return null;
	return (
		<header className={'page-title' + (!title?' no-title':'')}>
			{!!backlink && <Link to={backlink} className='title-backlink'>&#10094;&#10094;</Link> }
			{!!title && <span>{title}</span>}
		</header>
	);
}
export const Page: FunctionComponent<iPage> = ({title, children, backlink='/', className, pageTitle=title})=>{
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
export default Page;