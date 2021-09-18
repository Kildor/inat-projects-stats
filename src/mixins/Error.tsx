import React from 'react'
import { Translate, TranslateJSX } from './Translation';

interface iError {
	state: any
}

export default (state: any) => {
	const errorMessage = 'Error: ' + state.error + '\n' +
		JSON.stringify({
			d1: state.d1, d2: state.d2, project_id: state.project_id, user_id: state.user_id,
			show_first: state.show_first
		});
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
	return (
		<>{!!state.error && <div><Translate>Произошла ошибка при получении или обработке данных. Пожалуйста, попробуйте повторить позже.</Translate><br />
			<TranslateJSX replace={["kromanov@gmail.com", <a href='https://inaturalist.org/peoples/kildor' rel='noopener noreferrer' target='_blank'>@kildor</a>]}>
				Если ошибка повторяется, вы можете написать автору (%1) или %2) и приложить следующую информацию:
			</TranslateJSX>
			<pre style={{ whiteSpace: 'pre-wrap' }} onClick={onClickHandler}>
				{errorMessage}
			</pre>
		</div>
		}</>
	)

}