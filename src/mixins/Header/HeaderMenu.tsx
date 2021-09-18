import React, { useContext, useState } from 'react'
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import modules from '../../assets/modules.json';
import I18n, { applicationLanguage } from '../../classes/I18n';
import { iLanguage } from '../../interfaces/LanguageInterface';
import { LanguageContext } from '../LanguageContext';
			
type tState = React.Dispatch<React.SetStateAction<boolean>>;
			
const ListLangugeItem = (language: iLanguage, setState: tState) => {
	const context = useContext(LanguageContext);
	return <li
		className={language.code === context.code ? "active" : ""}
		onClick={() => { setState(false); context.changeLanguage(language.code); }} key={language.code}><span role='button'>{language.language}</span></li>;
};
			
const ListLinkItem = (module: { url: string; title: string; }, setstate: any): JSX.Element => {
// const ListLinkItem = (module: { url: string; title: string; }, setstate: tState): JSX.Element => {
	let match = useRouteMatch({
		path: module.url,
		exact: true
		});
		
	return <li key={module.url} className={match ? 'active' : ''}>
		<Link onClick={() => {setstate(false);}} to={module.url}>{I18n.t(module.title)}</Link>
	</li>;
};
			
			
const HeaderMenuWrapper = ({title, className, children} : {title: string; className: string; children: any } ) => {
	const [state, setState] = useState(false);
	const Children = children;
	return (
		<div className={'header-menu menu-'+className}>
			<button className={'button btn-menu ' + (state ? 'open' : '')} onClick={() => setState(!state)}>{title}</button>
				<Children setState={setState} />
		</div>
	)
}
		
export const MenuPages = ({ setState }: { setState: tState }) => (
		<ul>
			{modules.map(module => ListLinkItem(module, setState))}
		</ul>
	);
	
export const MenuLanguages = ({ setState }: { setState: tState }) => (
	<ul className="languages">
		{applicationLanguage.map(language => ListLangugeItem(language, setState))}
	</ul>
);
	
export const MenuPagesWrapped = () => (
	<HeaderMenuWrapper title={`☰ ${I18n.t('Меню')}`} className={'pages'}>
		{MenuPages}
	</HeaderMenuWrapper>);
		
export const MenuLanguagesWrapped = () => (
	<HeaderMenuWrapper title={I18n.t('Язык')} className={'languages'}>
		{MenuLanguages}
	</HeaderMenuWrapper>);
