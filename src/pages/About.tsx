/* eslint-disable react/jsx-no-target-blank */
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import I18n from '../classes/I18n';
import { LanguageContext } from '../mixins/LanguageContext';
import Page from '../mixins/Page'

interface iChanges {
	date: string
	changes: React.ReactNode
};

const Changelog = ({ changes } : {changes: Array<iChanges>}) => <dl className='changelog'>
	{changes.map(change => <React.Fragment key={change.date}>
		<dt>{change.date}</dt>
		<dd>{change.changes}</dd>
	</React.Fragment> )}
</dl>
const Content = () => {
	const { code } = useContext(LanguageContext);
	switch (code) {
		case 'en': 
		return (
			<>
				<p>This set of scripts is designed to retrieve various information from the iNaturalist database using their <a href="https://api.inaturalist.org" target='_blank'>API</a>.
					The scripts were originally created for convenient data processing in the "Flora of Russia" project, but later they began to be used in other projects as well.</p>
				<p>
					The script can only be used for non-commercial purposes (scientific, educational, etc.). If you want to use it for commercial purposes, please contact me.
				</p>
				<p>
					I'm accepting requests to add new scripts to the set and modify existing ones. In fact, almost all of the scripts were made based on workers' requests.
					You can send your requests to e-mail (kromanov@gmail.com), personal mail at <a href="https://www.inaturalist.org/people/1360998" target='_blank'>inat</a>, <a href="https://vk.com/kildor" target='_blank'>vkontakte</a> or <a href="https://www.facebook.com/kostia.kildor.romanov/" target='_blank'>facebook</a>.
					The source code is available at <a href="https://github.com/Kildor/inat-projects-stats" target='_blank'>github</a> under the GPL.
				</p>
				<h2>Changelog</h2>
				<Changelog changes={[
					{
						date: "10/22/2021",
						changes: "Add user settings page."
						},
					{
						date: "09/18/2021",
						changes: "Add internationalisation support. Many internal changes."
					},
					{
						date: "06/09/2021",
						changes: <>Fixed the script <Link to='/members'>to get a list of subscribers</Link></>
					}, {
						date: "02/20/2021",
						changes: <>Added <Link to='/download-observations'>observation download script</Link>. Refactoring and small changes.</>
					}
				]} />
			</>
		)
		case 'ru':
		default:
	return <>
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
		<Changelog changes={[
			{
				date: "22.10.2021",
				changes: "Добавлена форма пользовательских настроек (язык и место для предпочтительного названия таксонов). "
			},
			{
				date: "18.09.2021",
				changes: "Добавлена интернационализация, множество разных изменений"
			},
			{
				date: "09.06.2021",
				changes: <>Поправлен скрипт <Link to='/members'>получения списка подписчиков</Link></>
			}, {
				date: "20.02.2021",
				changes: <>Добавлен скрипт <Link to='/download-observations'>скачивания наблюдений</Link>. Рефакторинг и мелкие правки</>
			}

		]}/>
	</>;
}
}
	
export default () => (
	<Page className='page-main' title={I18n.t("О сайте")}>
		<Content />
	</Page>
)