import React, { useContext } from 'react'
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import modules from '../../assets/modules.json';
import I18n, { applicationLanguage } from '../../classes/I18n';
import { iLanguage } from '../../interfaces/LanguageInterface';
import { iModule } from '../../interfaces/ModulesInterface';
import { useToggler } from '../hooks';
import { LanguageContext } from '../LanguageContext';
			
type tState = React.Dispatch<React.SetStateAction<boolean>>;
			
const ListLangugeItem = (language: iLanguage, setState: tState) => {
	const context = useContext(LanguageContext);
	return <li
		className={language.code === context.code ? "active" : ""} key={language.code}>
			<span role='button' onClick={() => { setState(false); context.changeLanguage(language.code); }} >{language.language}</span>
			</li>;
};
			
const ListLinkItem = (module: iModule, setstate: any): JSX.Element => {
// const ListLinkItem = (module: { url: string; title: string; }, setstate: tState): JSX.Element => {
	let match = useRouteMatch({
		path: module.url,
		exact: true
		});

	const title = typeof module.title === 'object' && module.title.menu ? module.title.menu : module.title;
		
	return <li key={module.url} className={match ? 'active' : ''}>
		<Link onClick={() => {setstate(false);}} to={module.url}>{I18n.t(title as string)}</Link>
	</li>;
};


const HeaderMenuWrapper = ({title, className, children: Children} : {title: string; className: string; children: any } ) => {
	const [open, setOpen] = useToggler(false);
	return (
		<div className={'header-menu menu-'+className}>
			<button className={'button btn-menu ' + (open ? 'open' : '')} onClick={setOpen}>{title}</button>
				<Children setState={setOpen} />
		</div>
	)
}
		
export const MenuPages = ({ setState }: { setState: tState }) => (
		<ul className='menu'>
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
