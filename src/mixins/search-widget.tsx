import { I18n } from 'classes';
import React from 'react';
import 'assets/common.scss';

export interface SearchWidgetProps {
	/** Текущее значение поиска. */
	value: string;
	/** Функция для выставления поиска. */
	setValue: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({ value, setValue }) => {

	return (
		<p>{I18n.t('Быстрый поиск по списку')}:{' '}
			<input
				type='text'
				value={value}
				onChange={({ target: { value } }) => { setValue(value) }}
			/>
			{value && (<button onClick={() => setValue('')} type='button' className='btn-small' title={I18n.t("Очистить")}>
				<span role='img' aria-label={I18n.t("Очистить")}>❌</span>
			</button>)}
		</p>
	);
};

SearchWidget.displayName = 'SearchWidget'