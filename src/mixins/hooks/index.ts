import { useCallback, useState } from "react";

export const useToggler = (defState: boolean) => {
	const [state, setState] = useState(defState);
	const toggleState = useCallback( () => {setState(prevState => !prevState)}, [])
	return [state, toggleState] as const;
}