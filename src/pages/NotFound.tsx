import React from 'react'
import Page from 'mixins/Page';
import { Link } from 'react-router-dom';
import I18n from 'classes/I18n';
import 'assets/pages/page-404.scss'

export default () => {
	return (
		<Page className='page-404' title={I18n.t('Страница не найдена')}>
			<p>
				{I18n.t("Страница не найдена")}<br/>
				<Link to='/'>{I18n.t("Вернуться на главную")}</Link>

			</p>
		</Page>
	)
}