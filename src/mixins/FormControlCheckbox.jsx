import React from 'react'

export default ({ label, name, onChange, checked, children }) => {

	return (
		<label>
			<span>{label}</span> <span className='form-control'>
				<input type='checkbox' name={name} onChange={onChange} value='1' checked={checked} />
				{children}
			</span>
		</label>
	)

}