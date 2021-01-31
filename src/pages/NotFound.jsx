import React from 'react'
import Page from '../mixins/Page';
import { Link } from 'react-router-dom';

export default () => {
	document.title = 'Страница не найдена';
	return (
		<Page className='page-404' title="404">
			<p>
				Страница не найдена<br/>
				<Link to='/'>Вернуться на главную</Link>

			</p>
		</Page>
	)
}