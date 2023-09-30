import React, { useCallback } from "react";
import { useField, useForm } from "react-final-form";

export const SwapIcon: React.FC<{ fieldA: string, fieldB: string }> = ({ fieldA, fieldB }) => {
	const { input: { value: valueA } } = useField(fieldA);
	const { input: { value: valueB } } = useField(fieldB);
	const { batch, change } = useForm()

	const swapStateValues = useCallback(() => {
		batch(() => {
			change(fieldA, valueB);
			change(fieldB, valueA);
		})
	}, [valueA, valueB, batch, change, fieldA, fieldB]);

	return (
		<span tabIndex={0} className='icon-swap' role='button' onClick={swapStateValues} >⇅</span>
	);
};