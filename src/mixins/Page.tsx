import React, { FunctionComponent, memo, ReactNode, useEffect } from 'react'
import { Link } from 'react-router-dom';

import 'assets/pages/Page.scss';
import { Note } from './Note';


interface iHeader {
	title?: string
	backlink?: string | false
	infoText?: ReactNode
	defCollapsed?: boolean | true
}
interface iPage {
	title?: string
	children: ReactNode
	pageTitle?: string
	backlink?: string | false
	className?: string
	infoText?: ReactNode
	defCollapsed?: boolean | true
}

const Header = memo(({title, backlink, infoText, defCollapsed}: iHeader) => {
	if (!title && !backlink) return null;
	return (
		<header className={'page-title' + (!title?' no-title':'')}>
			{!!backlink && <Link to={backlink} className='title-backlink'>&#10094;&#10094;</Link> }
			{!!title && <span>{title}</span>}
			{!!infoText && <Note defCollapsed>{infoText}</Note>}
		</header>
	);
});

export const Page: FunctionComponent<iPage> = memo(({title, children, backlink='/', className, pageTitle=title, infoText, defCollapsed})=>{
	useEffect(() => {
		if (!!pageTitle) document.title = pageTitle;
		else if(!!title) document.title = title;
	},
		[pageTitle, title]
	);

	return (
		<div className={"page"+(!!className ? " "+className : "")}>
			<Header title={title} backlink={backlink} infoText={infoText} defCollapsed={defCollapsed} />
			<div className='page-content'>
				{children}
			</div>
		</div>
	)
});

export default Page;