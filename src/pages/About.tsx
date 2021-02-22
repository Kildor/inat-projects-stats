/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import { Link } from 'react-router-dom';
import I18n from '../classes/I18n';
import Page from '../mixins/Page'


export default () => {
	return (
		<Page className='page-main' title={I18n.t("О сайте")}>
			<p>Данный набор скриптов предназначен для получения различной информации из базы iNaturalist с использованием их <a href="https://api.inaturalist.org" target='_blank'>API</a>.
			Изначально скрипты создавались для удобства обработки данных в проекте "Флора России", но затем начали использоваться и в других.</p>
			<p>
				Скрипт может использоваться исключительно с некоммерческими целями (научными, просветительскими и т.д.). Если вы хотите воспользоваться им в коммерческих интересах, просьба связаться со мной.
			</p>
			<p>
				Я принимаю запросы на добавление в набор новых скриптов и доработку имеющихся. Собственно практически все скрипты были сделаны по запросам трудящихся.
				Запросы можно присылать на почту (kromanov@gmail.com), в личную почту на <a href='https://www.inaturalist.org/people/1360998' target='_blank'>йнате</a>, <a href="https://vk.com/kildor" target='_blank'>вконтакте</a> или <a href="https://www.facebook.com/kostia.kildor.romanov/" target='_blank'>фейсбуке</a>.
				Исходники доступны на <a href="https://github.com/Kildor/inat-projects-stats" target='_blank'>гитхабе</a> под лицензией GPL.
			</p>
			<h2>Изменения</h2>
			<dl className='changelog'>
				<dt>20.02.2021</dt>
				<dd>Добавлен скрипт <Link to='/download-observations'>скачивания наблюдений</Link>. Рефакторинг и мелкие правки</dd>
			</dl>

		</Page>
	)
}