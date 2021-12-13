import React, { ReactElement } from 'react'
import '../assets/Taxons.scss';
import '../assets/Observations.scss';
import CSV from './CSV';
import Observation, { getCSVHeader } from '../DataObjects/Observation';
import ObservationIdentification from '../DataObjects/ObservationIdentification';
import ObservationComment from '../DataObjects/ObservationComment';
import { DateTimeFormat } from '../mixins/API';
import I18n from '../classes/I18n';

export interface ObservationsListProps {
	observations: Array<Observation>
	csv: boolean | false
	current_ids: boolean | false
	hide_activity: boolean | false
	show_discussion: boolean | false
	filename?: string | "observations.csv"
}

interface ActivitiesListProps {
	current_ids: boolean|false
	show_discussion: boolean|false
	activityFilter: FilterFunction
	activities: Array<ObservationComment | ObservationIdentification >
}
interface FilterFunction {
	(act: ObservationComment | ObservationIdentification) : boolean
}


const ActivityItem = ({ activity: { id, created, user: { login }, comment }, className, children}: { activity: ObservationComment | ObservationIdentification, className: string, children?: React.ReactNode}) =>{
	return (
		<li key={id} className={className}>
			{DateTimeFormat.format(created)}, <strong>{login}:</strong> {children}<br />
			<div className="comment">
				{comment}
			</div>
		</li>

	)
}
const ActivityIdentification = ({ activity }: { activity: ObservationIdentification})=>{
	const isCurrent = 'current' in activity && activity.current;
	let className = 'identification ' + (isCurrent ? 'identification-current' : 'identification-outdated');
	if (!!activity.taxon.commonName) className+= ' has-common-name';
	return <ActivityItem className={className} activity={activity}>
		<a className='taxon-link' href={'https://www.inaturalist.org/taxa/'+activity.taxon.id}>{activity.taxon.commonName} <em>{activity.taxon.name}</em></a>
	</ActivityItem>
}

const ActivityComment = ({ activity }: { activity: ObservationComment})=>{
	return <ActivityItem className='comment' activity={activity}/>
}

const getFilterForActivities = (current_ids = false, show_discussion = false): FilterFunction => {
	if (current_ids) {
		return (act) => !('current' in act) || act.current
	} else if (show_discussion) {
		return (act) => !!act.comment
	}
	return (act) => true
}

const ActivityList = ({activities, current_ids, show_discussion, activityFilter } : ActivitiesListProps ) => {
	activities = activities.filter(activityFilter);
	if (activities.length === 0) return null;

	return (
		<ul className='activity'>
			{activities.map(act => {
				return (
					'taxon' in act ? <ActivityIdentification key={act.id} activity={act} /> : <ActivityComment activity={act} key={act.id}/>
				)
			})}
		</ul>
	)
}

export const ObservationList = ({ observations, csv, filename, current_ids, hide_activity, show_discussion }: ObservationsListProps) => {
	if (observations.length === 0) return (
		<div>{I18n.t("Нет данных")}</div>
	);

	let list: ReactElement;
	if (csv) {
		list = <CSV header={getCSVHeader} useRank={!hide_activity} filename={filename}>{observations}</CSV>
	} else {
		let url = `https://www.inaturalist.org/observations/`;
		list = <ol className='taxons'>{observations.map(obs => {
			let className = 'observation quality-' + obs.quality_grade;
			if (!!obs.commonName) className += ' has-common-name';

			return (<li key={obs.id} className={className}>
				<a href={url + '' + obs.id} target='_blank' rel='noopener noreferrer' className='observation-name'>
					{obs.commonName} <em>{obs.name}</em>, @{obs.user.login}
				</a> <span className={'location' + (obs.geoprivacy !== null ? ' location-' + obs.geoprivacy : '')}>({obs.location}, {DateTimeFormat.format(obs.observed)})</span>
				{(!hide_activity && obs.activity.length > 0) && <ActivityList activities={obs.activity} current_ids={current_ids} show_discussion={show_discussion} activityFilter={getFilterForActivities(current_ids, show_discussion)} />}
			</li>)
		})}</ol>;

	}

	return (
		<>
			<p>{I18n.t("Наблюдений:")} {observations.length}</p>
			{list}
		</>
	)
}

export default ObservationList;