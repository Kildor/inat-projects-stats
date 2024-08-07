import React, { ReactElement, useState } from 'react'
import { getCSVHeader, Taxon } from '../DataObjects/Taxon';
import 'assets/Taxons.scss';
import CSV from './CSV';
import I18n from '../classes/I18n';
import { addCustomParams, fillDateParams } from './API';
import { SearchWidget } from './search-widget';

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
	markObserved?: boolean
}
export const TaxonsList: React.FC<TaxonListProps> = ({ taxons, d1, d2, date_created = true, date_any = false, project_id, user_id, place_id, csv, filename, markObserved = false }) => {
	const [search, setSearch] = useState('');

	if (taxons.length === 0) return (
		<div>{I18n.t("Нет данных")}</div>
	);

	let list: ReactElement;
	if (csv) {
		list = <CSV header={getCSVHeader(taxons[0].countTotal > 0)} useRank={true} filename={filename}>{taxons}</CSV>
	} else {
		let url = `https://www.inaturalist.org/observations?subview=table`;
		if (!!project_id) url += `&project_id=${project_id}`;
		if (!!user_id) url += `&user_id=${user_id}`;
		url += `&place_id=${!!place_id ? place_id : "any"}`;
		url += addCustomParams(fillDateParams({ d1, d2, date_created, date_any }))

		list = <ol className='taxons'>
			{taxons.filter(({ name = '', commonName = '' }) => search === '' || name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || commonName?.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ).map(taxon => (
				<li key={taxon.id} className={(!!taxon.commonName ? 'has-common-name' : '') + ' ' + (markObserved ? taxon.isObserved ? 'observed' : 'unobserved' : '')}>
					<a href={url + '&taxon_id=' + taxon.id} target='_blank' rel='noopener noreferrer'>
						{taxon.commonName} <em>{taxon.name}</em>
					</a>
					<span className="observation_count">
						{`, ${I18n.t("{1} наблюдений", [taxon.count])}`}
					</span>
					{taxon.countTotal > 0 &&
						<span className="observation_count_total">
							{`, ${I18n.t("{1} всего", [taxon.countTotal])}`}
						</span>
					}
				</li>
			))}</ol>;

	}


	return (
		<>
			<p>{I18n.t("{1} видов:", [taxons.length])}</p>
			<SearchWidget value={search} setValue={setSearch} />
			{list}
		</>
	)
};
TaxonsList.displayName = 'TaxonsList';

export default TaxonsList;
