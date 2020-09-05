import React from 'react'

export default (state) => {
	const errorMessage = 'Error: '+state.error+'\n'+
		JSON.stringify({
			d1: state.d1, d2: state.d2, project_id: state.project_id, user_id: state.user_id,
			show_first: state.show_first
		});
	const onClickHandler = e => {
		const node = e.currentTarget;
		if (document.body.createTextRange) {
			const range = document.body.createTextRange();
			range.moveToElementText(node);
			range.select();
		} else if (window.getSelection) {
			const selection = window.getSelection();
			const range = document.createRange();
			range.selectNodeContents(node);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	};
	return (
		<>{!!state.error && <div>Произошла ошибка при получении или обработке данных. Пожалуйста, попробуйте повторить позже.<br />
						Если ошибка повторяется, вы можете написать автору (kromanov@gmail.com или <a href='https://inaturalist.org/peoples/kildor' rel='noopener noreferrer' target='_blank'>@kildor</a>) и приложить следующую информацию:
						<pre style={{whiteSpace:'pre-wrap'}} onClick={onClickHandler}>
							{errorMessage}
						</pre>
							 </div>
			}</>
	)

}