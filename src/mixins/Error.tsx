import React from 'react'
import { Translate, TranslateJSX } from './Translation';
import { CopyIcon } from './icons';
import { Panel } from './panel';
import { I18n } from 'classes';

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
	const errorMessage = 'Error: ' + error + '\n' + JSON.stringify(state);

	return (
		<Panel title={I18n.t("Ошибка")} className='error-info'><Translate>Произошла ошибка при получении или обработке данных. Пожалуйста, попробуйте повторить позже.</Translate><br />
			<TranslateJSX replace={["kromanov@gmail.com", <a href='https://inaturalist.org/people/kildor' rel='noopener noreferrer' target='_blank'>@kildor</a>]}>
				Если ошибка повторяется, вы можете написать автору (%1 или %2) и приложить следующую информацию:
			</TranslateJSX>
			<pre style={{ whiteSpace: 'pre-wrap' }} onClick={onClickHandler}>
				{errorMessage}
			</pre>
			<CopyIcon handleClick={() => navigator.clipboard.writeText(errorMessage)} label={I18n.t("Копировать информацию")} />
		</Panel>
	)

}
