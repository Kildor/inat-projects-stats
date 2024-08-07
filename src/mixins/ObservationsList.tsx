import React, { ReactElement } from 'react'
import '../assets/Taxons.scss';
import '../assets/Observations.scss';
import CSV from './CSV';
import { getCSVHeader, Observation } from '../DataObjects/Observation';
import { ObservationIdentification } from '../DataObjects/ObservationIdentification';
import { ObservationComment } from '../DataObjects/ObservationComment';
import I18n from '../classes/I18n';
import { DateTimeFormat } from './utils';

interface CommonListProps {
	current_ids: boolean;
	hide_activity: boolean;
	show_discussion: boolean;
}

interface ObservationsListProps extends CommonListProps {
	observations: Array<Observation>;
	csv: boolean;
	filename?: string;
}

interface ActivitiesListProps extends Omit<CommonListProps, 'hide_activity'> {
	activityFilter: FilterFunction;
	activities: Array<ObservationComment | ObservationIdentification >;
}

interface ObservationItemProps extends CommonListProps {
	observation: Observation;
}

type FilterFunction = (act: ObservationComment | ObservationIdentification)  => boolean;


interface ActivityItemPros {
	activity: ObservationComment | ObservationIdentification;
	className: string;
	children?: React.ReactNode;
}

const ActivityItem: React.FC<ActivityItemPros> = ({ activity: { id, created, user: { login }, comment }, className, children}) =>{
	return (
		<li key={id} className={className}>
			{DateTimeFormat.format(created)}, <strong>{login}:</strong> {children}<br />
			<div className="comment">
				{comment}
			</div>
		</li>
	)
};
ActivityItem.displayName = 'ActivityItem';

const ActivityIdentification: React.FC<{ activity: ObservationIdentification }> = ({ activity })=>{
	const isCurrent = Boolean(activity?.current);
	let className = 'identification ' + (isCurrent ? 'identification-current' : 'identification-outdated');
	if (activity.vision) className+= ' has-vision';
	if (activity.taxon?.commonName) className+= ' has-common-name';
	return <ActivityItem className={className} activity={activity}>
		{!isCurrent && <span role='img' title={I18n.t('Отозванная идентификация')} aria-label={I18n.t('Отозванная идентификация')}>❌</span>}
		{activity.vision && <span role='img' title={I18n.t('Идентификация сделана при помощи визуальной модели iNaturalist')} aria-label={I18n.t('Идентификация сделана при помощи визуальной модели iNaturalist')}>✨</span>}
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
