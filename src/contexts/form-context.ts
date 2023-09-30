import { PresentationSettingsList } from "interfaces";
import React from "react";

const context = {
	usedSettings: {},
	onChangeHandler: (name: string, value: string | boolean) => { },
	// setPresentation: ({ csv }: {csv: boolean}) => { },
};

export const FormContext = React.createContext(context);