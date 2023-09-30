import { SetStatusProps, useStatusMessage } from "hooks/page-hooks";
import React from "react";

const context = {
	// statusMessage: '',
	// statusTitle: '',
	show: false,
	setShow: (show: boolean) => { },
	setStatus: (props: SetStatusProps | string = '') => { },
	setMessage: (message: string) => { },
	getStatus: () => ({ statusMessage: '', statusTitle: '' }),
	clearStatus: () => { },
};

export const StatusMessageContext = React.createContext(context);

export const StatusMessageContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const statusMessageContext = useStatusMessage();

	return (
		<StatusMessageContext.Provider value={statusMessageContext}>
			{children}
		</StatusMessageContext.Provider>
	);
};

// export const StatusMessageContextProvider: React.FC<React.PropsWithChildren<{value?: any}>> = ({ children, value }) => {
// 	const statusMessageContext = useStatusMessage(value);

// 	return (
// 		<StatusMessageContext.Provider value={statusMessageContext}>
// 			{children}
// 		</StatusMessageContext.Provider>
// 	);
// };

