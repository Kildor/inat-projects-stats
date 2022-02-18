import React, { ReactElement } from 'react'
import '../assets/Taxons.scss';
import '../assets/Observations.scss';
import CSV from './CSV';
import { getCSVHeader, Observation } from '../DataObjects/Observation';
import { ObservationIdentification } from '../DataObjects/ObservationIdentification';
import { ObservationComment } from '../DataObjects/ObservationComment';
import { DateTimeFormat } from '../mixins/API';
import I18n from '../classes/I18n';

interface iCommon {
	current_ids: boolean | false
	hide_activity: boolean | false
	show_discussion: boolean | false
}

interface ObservationsListProps extends iCommon {
	observations: Array<Observation>
	csv: boolean | false
	filename?: string | "observations.csv"
}

interface ActivitiesListProps extends Omit<iCommon, 'hide_activity'> {
	activityFilter: FilterFunction
	activities: Array<ObservationComment | ObservationIdentification >
}

interface ObservationItemProps extends iCommon {
	observation: Observation
}

interface FilterFunction {
	(act: ObservationComment | ObservationIdentification) : boolean
}


const ActivityItem: React.FC<{ activity: ObservationComment | ObservationIdentification; className: string}> = ({ activity: { id, created, user: { login }, comment }, className, children}) =>{
	return (
		<li key={id} className={className}>
			{DateTimeFormat.format(created)}, <strong>{login}:</strong> {children}<br />
			<div className="comment">
				{comment}
			</div>
		</li>

	)
}
const ActivityIdentification: React.FC<{ activity: ObservationIdentification }> = ({ activity })=>{
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

const BASE_URL = `https://www.inaturalist.org/observations/`;

const ObservationItem: React.FC<ObservationItemProps> = ({ observation, hide_activity, current_ids, show_discussion } ) => {
	let className = 'observation quality-' + observation.quality_grade;
	if (!!observation.commonName) className += ' has-common-name';
	let url = BASE_URL;

	return (<li className={className}>
		<a href={url + '' + observation.id} target='_blank' rel='noopener noreferrer' className='observation-name'>
			{observation.commonName} <em>{observation.name}</em>, @{observation.user.login}
		</a> <span className={'location' + (observation.geoprivacy !== null ? ' location-' + observation.geoprivacy : '')}>({observation.location}, {DateTimeFormat.format(observation.observed)})</span>
		{(!hide_activity && observation.activity.length > 0) && <ActivityList activities={observation.activity} current_ids={current_ids} show_discussion={show_discussion} activityFilter={getFilterForActivities(current_ids, show_discussion)} />}
	</li>)
}

export const ObservationList: React.FC<ObservationsListProps> = ({ observations, csv, filename, current_ids, hide_activity, show_discussion }) => {
	if (observations.length === 0) return (
		<div>{I18n.t("Нет данных")}</div>
	);

	let list: ReactElement;
	if (csv) {
		list = <CSV header={getCSVHeader} useRank={!hide_activity} filename={filename}>{observations}</CSV>
	} else {
		list = <ol className='taxons'>{observations.map(obs => <ObservationItem key={obs.id} observation={obs} hide_activity={hide_activity} current_ids={current_ids} show_discussion={show_discussion} />)}</ol>;
	}

	return (
		<>
			<p>{I18n.t("Наблюдений:")} {observations.length}</p>
			{list}
		</>
	)
}

export default ObservationList;