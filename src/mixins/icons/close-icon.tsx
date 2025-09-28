import React, { MouseEventHandler } from "react";

/** Иконка копирования. */
export const CloseIcon: React.FC<{ onClick: MouseEventHandler }> = ({ onClick }) => {

	return (
		<span tabIndex={0} className='icon icon-close' role='button' onClick={onClick} >🗙</span>
	);
};

CloseIcon.displayName = 'CloseIcon';