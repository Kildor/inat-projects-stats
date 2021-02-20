import React, { ReactElement } from 'react'
import '../assets/Taxons.scss';
import '../assets/Observations.scss';
import CSV from './CSV';
import Observation, { getCSVHeader } from '../DataObjects/Observation';
import ObservationIdentification from '../DataObjects/ObservationIdentification';
import ObservationComment from '../DataObjects/ObservationComment';

export interface ObservationsListProps {
	observations: Array<Observation>
	csv: boolean | false
	filename?: string | "observations.csv"
}

interface ActivitiesListProps {
	activities: Array<ObservationComment | ObservationIdentification >
}

const ActivityItem = ({ activity, className, children}: { activity: ObservationComment | ObservationIdentification, className: string, children?: React.ReactNode}) =>{
	return (
		<li key={activity.id} className={className}>
			{/* { isIdentification ? <span role='img' aria-label='Identification'>👁‍🗨</span> : <span role='img' aria-label='Comment'>💬</span> } */}
			{activity.created.toLocaleString()}, <strong>{activity.user.login}:</strong> {children}<br />
			<div className="comment">
				{activity.comment}
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

const ActivityList = ({activities } : ActivitiesListProps ) => {
	return (
		<ul className='activity'>
			{activities.map(act => {
				return (
					'taxon' in act ? <ActivityIdentification key={act.id} activity={act} /> : <ActivityComment activity={act} key={act.id}/>
				)
			})}
			{/* {obs.activity.map(act => <li key={act.id}>{act.id} - {act.created.toString()}, {act.user.login}: {act.comment}</li>)} */}
		</ul>

	)
}
export default ({ observations, csv, filename }: ObservationsListProps) => {
	if (observations.length === 0) return (
		<div>Нет данных</div>
	);
	let list: ReactElement;
	if (csv) {
		list = <CSV header={getCSVHeader} useRank={true} filename={filename}>{observations}</CSV>
	} else {
		let url = `https://www.inaturalist.org/observations/`;
		list = <ol className='taxons'>{observations.map(obs => {
		return (<li key={obs.id} className={!!obs.commonName ? 'has-common-name' : ''}>
			<a href={url + '' + obs.id} target='_blank' rel='noopener noreferrer'>
				{obs.commonName} <em>{obs.name}</em> by @{obs.user.login}
			</a>
			{(obs.activity.length > 0) && <ActivityList activities={obs.activity} />}
		</li>)})}</ol>;

	}


	return(
		<>
			<p>Наблюдений: {observations.length}</p>
			{list}
			</>
	)
}