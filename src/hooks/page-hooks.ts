import { useCallback, useState } from "react";

export interface SetStatusProps {
	message?: string
	title?: string
};

/**
 * Хук для работы со статусным сообщением, выдаваемым скриптом пользователю.
 * 
 * @param defaultMessage Сообщение по умолчанию.
 */
export const useStatusMessage = (props: { defaultMessage?: string, defaultTitle?: string } | string = '', defaultStatus: boolean = false) => {
	const defaultMessage = typeof props === 'string' ? '' : props.defaultMessage || '';
	const defaultTitle = typeof props === 'string' ? props : props.defaultTitle || '';

	const [statusMessage, setStatusMessage] = useState<string>(defaultMessage);

	const [statusTitle, setStatusTitle] = useState<string>(defaultTitle);

	const [show, setShow] = useState<boolean>(defaultStatus);

	const setStatus = useCallback(
		(props: SetStatusProps | string = '') => {
			const title = typeof props === 'string' ? props : props.title;
			const message = typeof props === 'string' ? undefined : props.message;

			typeof message === 'string' && setStatusMessage(message);
			typeof title === 'string' && setStatusTitle(title);
		},
		[setStatusMessage, setStatusTitle],
	);

	const getStatus = () => ({ statusTitle, statusMessage });

	const clearStatus = () => {
		setShow(false);
		setStatusMessage('');
		setStatusTitle('');
	};

	return { setStatus, getStatus, clearStatus, show, setShow, setMessage: setStatusMessage };
}