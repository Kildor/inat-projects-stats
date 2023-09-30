export {};
/*
import { StatusMessageContext } from 'contexts/status-message-context';
import { iObjectsList } from 'interfaces';
import React, { useCallback, useContext } from 'react';

export const useSubmitHandler = () => {
	const { setShow: setLoading } = useContext(StatusMessageContext);

	const submitHandler = useCallback(
		(values: Record<string, unknown>, counter: (values: Record<string, any>) => Promise<iObjectsList>): void => {
		setFilename(values.project_id + '-members.csv');
		setLoading(true);
		counter(values).then(data => {
			if (data.members) {
				setData(data);
				setLoading(false);
			}
		}).catch((e) => {
			console.log(e);
			setData({ members: [], total: 0 });
			setError(e.message);

		}).finally(() => {
			setLoading(false);
		});
	}, []);

	return submitHandler;
};
*/
