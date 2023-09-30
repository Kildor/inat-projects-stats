import React, { useCallback } from 'react';
import I18n from 'classes/I18n';
import API from 'mixins/API';
import { Form as RFF } from 'react-final-form';
import { Settings as SettingsStore } from 'classes/settings';
import { FormWrapper } from 'mixins/Form/form-wrapper';
import { FormControlField, FormControlMultilineField } from 'mixins/Form/FormControl';
import Page from 'mixins/Page';
import defaultPlaces from '../assets/places.json';
import defaultProjects from '../assets/projects.json'
import { useInitialValues } from 'hooks/use-initial-values';
import { useClearDatalistHandler } from 'hooks';
import { useStatusMessageContext } from 'hooks/use-status-message-context';

interface SettingsFields {
	default_place: string;
	default_language: string;
	projects: string[];
	users: string[];
	taxons: string[];
	places: string[];
}
/**
 * Страница пользовательских настроек.
 */
export const Settings = () => {
	const { getStatus, setStatus, show, setShow } = useStatusMessageContext();

	const clearDatalistHandler = useClearDatalistHandler();

	const { values: initialValues, onChangeHandler } = useInitialValues<SettingsFields>(
		["default_place", "default_language", "projects", "users", "taxons", "places"],
		{ "projects": defaultProjects }
	);

	const onChangeMultilineHandler = useCallback(
		(fieldName: string, value: string) => {
			if (!value || typeof fieldName !== 'string' || typeof value !== 'string') return;

			const newState = API.filterDatalist(value.trim().split('\n').filter(s => s.trim().length > 2).map(s => {
				const [name, title] = s.trim().split(/(?<=^(?:\S|[^:])+):\s/);
				return { name, title: title || name }
			}));
			SettingsStore.set(fieldName, newState);
		},
		[]
	);

	const onSubmitHandler = useCallback(() => {
		setStatus(I18n.t("Настройки сохранены"));
		setShow(true);
		setTimeout(() => {
			setStatus(I18n.t(""));
			setShow(false);
		}, 2000);
	}, [setShow, setStatus]);

	return (
		<>
			<Page title={I18n.t("Настройки пользователя")} className='page-settings'>
				<RFF
					onSubmit={onSubmitHandler}
					initialValues={initialValues}

					render={({ handleSubmit }) => (
						<FormWrapper disabled={false} submitTitle={I18n.t("Сохранить")} onSubmit={handleSubmit}>
							<fieldset className="noborder">
								<FormControlField
									type="number"
									name="default_place"
									label={I18n.t("Место по умолчанию")}
									comment={`${I18n.t("Цифровое значение")}. ${I18n.t("Используется для показа региональных имён таксонов")}. ${I18n.t("Можно оставить пустым.")}`}
									list={defaultPlaces}
									listName="places"
									clearDatalistHandler={clearDatalistHandler}
									changeHandler={onChangeHandler}
								/>
								<FormControlField
									type="text"
									label={I18n.t("Язык по умолчанию")}
									comment={I18n.t("Оставьте пустым для использования языка из настроек браузера")}
									name="default_language"
									changeHandler={onChangeHandler}
								/>
								<FormControlMultilineField
									name='projects'
									label={I18n.t("Сохранённые проекты")}
									handler={onChangeMultilineHandler}
									comment={<>{I18n.t("Записи разделяются переводом строки.")}<br />{I18n.t("Вначале идентификатор, затем, через двоеточие и пробел, отображаемое название.")}</>}
								/>
								<FormControlMultilineField
									name='users'
									label={I18n.t("Сохранённые пользователи")}
									handler={onChangeMultilineHandler}
									comment={I18n.t("Записи разделяются переводом строки.")}
								/>
								<FormControlMultilineField
									name='taxons'
									label={I18n.t("Сохранённые таксоны")}
									handler={onChangeMultilineHandler}
									comment={<>{I18n.t("Записи разделяются переводом строки.")}<br />{I18n.t("Вначале идентификатор, затем, через двоеточие и пробел, отображаемое название.")}</>}
								/>
								<FormControlMultilineField
									name='places'
									label={I18n.t("Сохранённые места")}
									handler={onChangeMultilineHandler}
									comment={<>{I18n.t("Записи разделяются переводом строки.")}<br />{I18n.t("Вначале идентификатор, затем, через двоеточие и пробел, отображаемое название.")}</>}
								/>
							</fieldset>
						</FormWrapper>

					)}
				/>
				{show && <div className='loader'>{getStatus()['statusTitle']}</div>}
			</Page>
		</>
	);

};
