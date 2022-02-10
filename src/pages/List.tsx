import React from 'react'
import { Link } from 'react-router-dom';
import modules from '../assets/modules.json';
import I18n from '../classes/I18n';
import Page from '../mixins/Page'
import '../assets/pages/page-list.scss'


interface iDescription {
	description: string
	note?: string
}

const Description = ({ description, note }: iDescription) => (
	<dd><p>{I18n.t(description)} {!!note && <small className='description-note'>{I18n.t(note)}</small>}</p></dd>
);

export default () => {
	return (
		<Page className='page-main' title={I18n.t("Список утилит")} backlink={false}>
			<dl className='pages-list'>
				{
					modules.map(module => {
						if (module.url === '/') return null;
						const title = typeof module.title === 'object' && module.title.list ? module.title.list : module.title;

						return (
							<React.Fragment key={module.url}><dt><Link to={module.url}>{I18n.t(title as string)}</Link></dt>
								{module.description && <Description description={module.description} note={module.note} />}
							</React.Fragment>
						)
					})
				}
				<dt>
					<a href='/react/inat-converter'>{I18n.t("Редактор постов в журналы")}</a>
				</dt>
				<dd><p>{I18n.t("Конвертер для табличных данных с йната, а так же редактор для постов.")}</p></dd>
				<dt style={{ borderTop: "1px solid #aaa", marginTop: ".5em", paddingTop: ".5em" }}>
					<Link to='/about'>{I18n.t("О сайте")}</Link>
				</dt>
				<dd><p>{I18n.t("Некоторая информация об этом сайте.")}</p></dd>
			</dl>
		</Page>
	)
}
