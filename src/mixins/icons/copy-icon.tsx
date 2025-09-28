import React, { MouseEventHandler } from "react";

/** Иконка копирования. */
export const CopyIcon: React.FC<{ handleClick: MouseEventHandler, label?: string }> = ({ handleClick, label }) => {

	return (
		<span tabIndex={0} className='icon copy-icon' role='button' onClick={handleClick} style={{ display: 'inline-flex', gap: '3px', alignItems: 'baseline', cursor: 'pointer' }} >
			<span style={{ fontSize: '.875em', marginRight: '.125em', position: 'relative', top: '-.25em', left: '-.125em' }}>
				📄<span style={{ position: 'absolute', top: '.25em', left: '.25em' }}>📄</span>
			</span>
			{label && <span>{label}</span>}
		</span>
	);
};