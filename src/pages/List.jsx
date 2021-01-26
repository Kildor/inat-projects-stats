import React from 'react'
import { Link } from 'react-router-dom';
import modules from '../assets/modules.json';
import Page from '../mixins/Page'

export default ()=>{
	// document.title = 'Список утилит';
	return (
		<Page className='page-main' pageTitle='Список утилит'>
			<p>
				Выберите один из доступных вариантов:
			</p>
			<dl>
				{
					modules.map(module=>{
						return (
							<React.Fragment key={module.url}><dt><Link to={module.url}>{module.title}</Link></dt>
								{!!module.description ? <dd><p>{module.description} {!!module.note ? <><br/><small><strong>*</strong> {module.note}</small></> :null } </p></dd> : null}
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