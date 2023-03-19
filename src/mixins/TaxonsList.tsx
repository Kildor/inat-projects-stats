import React, { ReactElement } from 'react'
import { getCSVHeader, Taxon } from '../DataObjects/Taxon';
import 'assets/Taxons.scss';
import CSV from './CSV';
import I18n from '../classes/I18n';
import { addCustomParams, fillDateParams } from './API';

export interface TaxonListProps {
	taxons: Array<Taxon>
	d1?: string
	d2?: string
	date_created?: boolean
	date_any?: boolean
	project_id?: number | string
	user_id?: number | string
	place_id?: number
	csv: boolean | false
	filename?: string | "taxons.csv"
}
export const TaxonList: React.FC<TaxonListProps> = ({ taxons, d1, d2, date_created = true, date_any = false, project_id, user_id, place_id, csv, filename }) => {
	if (taxons.length === 0) return (
		<div>{I18n.t("Нет данных")}</div>
	);

	let list: ReactElement;
	if (csv) {
		list = <CSV header={getCSVHeader} useRank={true} filename={filename}>{taxons}</CSV>
	} else {
		let url = `https://www.inaturalist.org/observations?subview=table`;
		if (!!project_id) url += `&project_id=${project_id}`;
		if (!!user_id) url += `&user_id=${user_id}`;
		url += `&place_id=${!!place_id ? place_id : "any"}`;
		url += addCustomParams(fillDateParams({ d1, d2, date_created, date_any }))

		list = <ol className='taxons'>{taxons.map(taxon => <li key={taxon.id} className={!!taxon.commonName ? 'has-common-name' : ''}>
			<a href={url + '&taxon_id=' + taxon.id} target='_blank' rel='noopener noreferrer'>
				{taxon.commonName} <em>{taxon.name}</em>
			</a>
			{`, ${I18n.t("{1} наблюдений", [taxon.count])}`}
		</li>)}</ol>;

	}


	return (
		<>
			<p>{I18n.t("{1} видов:", [taxons.length])}</p>
			{list}
		</>
	)
};
TaxonList.displayName = 'TaxonList';

export default TaxonList;
