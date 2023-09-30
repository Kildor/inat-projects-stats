import { StatusMessageContext } from 'contexts/status-message-context';
import { useContext, useEffect } from 'react';

export const useStatusMessageContext = () => {
	const context = useContext(StatusMessageContext)
	useEffect(() => {
		context.clearStatus();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])

	return context;
};