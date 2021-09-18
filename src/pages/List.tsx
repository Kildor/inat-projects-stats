import React from 'react'
import { Link } from 'react-router-dom';
import modules from '../assets/modules.json';
import I18n from '../classes/I18n';
import Page from '../mixins/Page'

interface iDescription {
	description?: string
	note?: string
};

const Description = ({ description, note }: iDescription) => {
	if (!description) return null
	return (
		<dd><p>{I18n.t(description)} {!!note ? <><br /><small><strong>*</strong> {I18n.t(note)}</small></> : null} </p></dd>
	);
};

export default ()=>{
	return (
		<Page className='page-main' title={I18n.t("Список утилит")} backlink={false}>
			<dl>
				{
					modules.map(module=>{
						if(module.url==='/') return null;
						return (
							<React.Fragment key={module.url}><dt><Link to={module.url}>{I18n.t(module.title)}</Link></dt>
								<Description description={module.description} note={module.note} ></Description>
							</React.Fragment>
						)
					})
				}
				<dt>
					<a href='/react/inat-converter'>{I18n.t("Редактор постов в журналы")}</a>
					</dt>
					<dd><p>{I18n.t("Конвертер для табличных данных с йната, а так же редактор для постов.")}</p></dd>
				<dt style={{borderTop:"1px solid", marginTop:".5em", paddingTop: ".5em"}}>
					<a href='/about'>{I18n.t("О сайте")}</a>
					</dt>
					<dd><p>{I18n.t("Некоторая информация об этом сайте.")}</p></dd>
			</dl>
		</Page>
	)
}