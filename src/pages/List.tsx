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
		<dd><p>{description} {!!note ? <><br /><small><strong>*</strong> {note}</small></> : null} </p></dd>
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
							<React.Fragment key={module.url}><dt><Link to={module.url}>{module.title}</Link></dt>
								<Description description={module.description} note={module.note} ></Description>
							</React.Fragment>
						)
					})
				}
				<dt>
					<a href='/react/inat-converter'>Редактор постов в журналы</a>
					</dt>
					<dd><p>Конвертер для табличных данных с йната, а так же редактор для постов.</p></dd>
			</dl>
		</Page>
	)
}