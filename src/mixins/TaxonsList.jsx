import React from 'react'

export default ({taxons,d1, d2, project_id, user_id}) => {
	let url = `https://www.inaturalist.org/observations?place_id=any&subview=table&verifiable=any`;
	if (!!project_id) url += `&project_id=${project_id}`;
	if (!!user_id) url += `&user_id=${user_id}`;
	if (!!d1) url += `&created_d1=${d1}`;
	if (!!d2) url += `&created_d2=${d2}`;
	if (taxons.length === 0) return (
		<div>Нет данных</div>
	);
	return(
		<>
			<p>{taxons.length} видов:</p>
			<ul className='taxons'>{taxons.map(taxon => <li key={taxon.id} className={!!taxon.commonName ? 'has-common-name' : ''}>
				<a href={url +'&taxon_id=' +taxon.id} target='_blank' rel='noopener noreferrer'>
					{taxon.commonName} <em>{taxon.name}</em>
				</a>
			</li>)}</ul>
			</>
	)
}