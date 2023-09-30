import React from 'react'
import { Translate, TranslateJSX } from './Translation';

const onClickHandler = (e: React.MouseEvent<HTMLElement>) => {
	const node = e.currentTarget;
	if (window.getSelection) {
		const selection = window.getSelection();
		const range = document.createRange();
		range.selectNodeContents(node);
		if (selection) {
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}
};

export const Error = ({ error, ...state }: Record<string, any>) => {
	if (!error) return null;
	const { projects, users, taxons, places, csv, loading, loadingTitle, loadingMessage, lookupSuccess, data, current_ids, hide_activity, show_discussion, filename, ...rest } = state;

	const errorMessage = 'Error: ' + error + '\n' + JSON.stringify(rest);

	return (
		<div><Translate>Произошла ошибка при получении или обработке данных. Пожалуйста, попробуйте повторить позже.</Translate><br />
			<TranslateJSX replace={["kromanov@gmail.com", <a href='https://inaturalist.org/people/kildor' rel='noopener noreferrer' target='_blank'>@kildor</a>]}>
				Если ошибка повторяется, вы можете написать автору (%1) или %2) и приложить следующую информацию:
			</TranslateJSX>
			<pre style={{ whiteSpace: 'pre-wrap' }} onClick={onClickHandler}>
				{errorMessage}
			</pre>
		</div>
	)

}
