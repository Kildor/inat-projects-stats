import React from 'react'
import DataList from './DataList'

export default ({ label, type, name, onChange, value, list, children }) => {
	const dlId = (!!list && list.length > 0) ? `form-control-dl-${name}-${new Date().getMilliseconds()}` : undefined;

	return (
		<label>
			<span>{label}</span> <span className='form-control'>
				<input type={type} name={name} onChange={onChange} value={value} list={dlId} />
				{children}
				{(!!dlId) && <DataList list={list} id={dlId} />}
			</span>
		</label>
	)

}