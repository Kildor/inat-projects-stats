import React, { FunctionComponent, ReactChildren } from 'react'
import { Link } from 'react-router-dom';

import '../assets/pages/Page.scss';
import { Note } from './Note';


interface iHeader {
	title?: string
	backlink?: string | false
	infoText?: ReactChildren
	defCollapsed?: boolean | true
}
interface iPage {
	title?: string
	pageTitle?: string
	backlink?: string | false
	className?: string
	infoText?: ReactChildren
	defCollapsed?: boolean | true
}

const Header = ({title, backlink, infoText, defCollapsed}: iHeader) => {
	if (!title && !backlink) return null;
	return (
		<header className={'page-title' + (!title?' no-title':'')}>
			{!!backlink && <Link to={backlink} className='title-backlink'>&#10094;&#10094;</Link> }
			{!!title && <span>{title}</span>}
			{!!infoText && <Note defCollapsed={defCollapsed}>{infoText}</Note>}
		</header>
	);
}
export const Page: FunctionComponent<iPage> = ({title, children, backlink='/', className, pageTitle=title, infoText, defCollapsed})=>{
	if (!!pageTitle) document.title = pageTitle;
	else if(!!title) document.title = title;

	return (
		<div className={"page"+(!!className ? " "+className : "")}>
			<Header title={title} backlink={backlink} infoText={infoText} defCollapsed={defCollapsed} />
			<div className='page-content'>
				{children}
			</div>
		</div>
	)
}
export default Page;