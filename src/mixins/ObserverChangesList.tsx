import { Observer } from 'DataObjects/Observer';
import React from 'react';
import { UserLink } from './UserLink';
import 'assets/Observers.scss';
import I18n from 'classes/I18n';

export enum Strategy {
	new_faces = 'new_faces'
}

export interface iObserverChange {
	observer: Observer;
	currentPosition: number;
	prevPosition: number;
}

export interface iObserverChangesListProps {
	observers: iObserverChange[];
	strategy: Strategy;
	difference: number;

}

export const ObserverChangesList: React.FC<iObserverChangesListProps> = ({ observers, strategy = Strategy.new_faces, difference = 0 }) => {
	if (!observers || observers.length === 0) return null;
	const obsTitle = I18n.t("Наблюдения");
	const spTitle = I18n.t("Виды");

	return (
		<ul className='observers-list'>
			{observers.map(({ observer, prevPosition, currentPosition }) => {
				const diff = prevPosition - currentPosition;
				const newFace = prevPosition === 0;
				if (Math.abs(diff) < difference && !newFace) return null;
				const cnPosition = `position-${diff < 0 ? newFace ? 'new' : 'decreased' : diff > 0 ? 'increased' : 'same'}`;

				return <li key={observer.id} className={`observer ${cnPosition}`}>
					<span className="position">{currentPosition}</span>
					<span className='difference'>
					{!newFace ? (diff > 0 ? '+' : diff===0 ? ` ` : '') + diff : ''}
					</span> <UserLink user={observer} /> <span className='observations'>{obsTitle}: {observer.observations}</span> <span className='species'>{spTitle}: {observer.species}</span> 
				</li>
			})}

		</ul>
	)

}