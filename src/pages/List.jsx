import React from 'react'
import { Link } from 'react-router-dom';

import Page from './Page'

export default ()=>{
	document.title = 'Список утилит';
	return (
		<Page className='page-main'>
			<p>
				Выберите один из доступных вариантов:
			</p>
			<dl>
				<dt>
					<Link to='/new-species'>Новые виды в проекте</Link>
				</dt>
				<dd><p>Просмотр списка новых видов, появившихся в проекте за выбранный промежуток времени.
					<br/><small><strong>*</strong> Данный список примерен, и может не учитывать какие-то из наблюдений, в особенности если проект требует "Исследовательского уровня"</small>
					</p></dd>
				<dt>
					<a href='/react/inat-converter'>Редактор постов в журналы</a>
				</dt>
				<dd><p>Конвертер для табличных данных с йната, а так же редактор для постов.
					</p></dd>
			</dl>
		</Page>
	)
}