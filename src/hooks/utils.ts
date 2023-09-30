import { useCallback, useState } from "react";

export const useToggler = (defState: boolean) => {
	const [state, setState] = useState(defState);
	const toggleState = useCallback(() => { setState(prevState => !prevState) }, [])
	const setFalse = useCallback(() => { setState(false) }, []);
	const setTrue = useCallback(() => { setState(true) }, []);

	return [state, toggleState, setFalse, setTrue] as const;
}