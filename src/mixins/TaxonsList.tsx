import React, { ReactElement } from 'react'
import Taxon, { getCSVHeader } from '../DataObjects/Taxon';
import '../assets/Taxons.scss';
import CSV from './CSV';

export interface TaxonListProps {
	taxons: Array<Taxon>
	d1?: string
	d2?:string
	project_id?: number|string
	user_id?: number|string
	place_id?: number
	csv: boolean | false
	filename?: string | "taxons.csv"
}
export default ({ taxons, d1, d2, project_id, user_id, place_id, csv, filename }: TaxonListProps) => {
	if (taxons.length === 0) return (
		<div>Нет данных</div>
	);
	let list: ReactElement;
	if (csv) {
		list = <CSV header={getCSVHeader} useRank={true} filename={filename}>{taxons}</CSV>
	} else {
		let url = `https://www.inaturalist.org/observations?subview=table&verifiable=any`;
		if (!!project_id) url += `&project_id=${project_id}`;
		if (!!user_id) url += `&user_id=${user_id}`;
		url += `&place_id=${!!place_id?place_id:"any"}`;
		if (!!d1) url += `&created_d1=${d1}`;
		if (!!d2) url += `&created_d2=${d2}`;
		list = <ol className='taxons'>{taxons.map(taxon => <li key={taxon.id} className={!!taxon.commonName ? 'has-common-name' : ''}>
			<a href={url + '&taxon_id=' + taxon.id} target='_blank' rel='noopener noreferrer'>
				{taxon.commonName} <em>{taxon.name}</em>
			</a>
		</li>)}</ol>;

	}


	return(
		<>
			<p>{taxons.length} видов:</p>
			{list}
			</>
	)
}