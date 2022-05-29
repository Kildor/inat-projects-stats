import { Observer } from 'DataObjects/Observer';
import React from 'react';
import { UserLink } from './UserLink';
import 'assets/Observers.scss';
import I18n from 'classes/I18n';

export enum Strategy {
	new_faces = 'new_faces'
}

export interface iObserverChange {
	currentState: Observer;
	prevState: Observer;
	currentPosition: number;
	prevPosition: number;
}

export interface iObserverChangesListProps {
	observers: iObserverChange[];
	strategy: Strategy;
	difference: number;
	showPrevState: boolean;
}

export const ObserverChangesList: React.FC<iObserverChangesListProps> = ({ observers, strategy = Strategy.new_faces, difference = 0, showPrevState = false }) => {
	if (!observers || observers.length === 0) return null;

	return (
		<ul className='observers-list'>
			<li className='header'>
				<span className="icon" />
				<span className="position" />
				<span className='difference' />
				<span className='user'>{I18n.t("Пользователь")}</span>
				<span className='observations'>{I18n.t("Наблюдения")}</span>
				<span className='species'>{I18n.t("Виды")}</span>
			</li>
			{observers.map(({ currentState, prevState, prevPosition, currentPosition }) => {
				const diff = prevPosition - currentPosition;
				const newFace = prevPosition === 0;
				if (Math.abs(diff) < difference && !newFace) return null;
				const cnPosition = `position-${diff < 0 ? newFace ? 'new' : 'decreased' : diff > 0 ? 'increased' : 'same'}`;

				return <li key={currentState.id} className={`observer ${cnPosition}`}>
					<span className="position">{currentPosition}</span>
					<span className='difference'>
						{!newFace ? (diff > 0 ? '+' : diff === 0 ? ` ` : '') + diff : ''}
					</span> <UserLink user={currentState} /> <span className='observations'>{currentState.observations} {showPrevState && <>/ {prevState?.observations ?? 0}</>}</span> <span className='species'>{currentState.species} {showPrevState && <>/ {prevState?.species ?? 0}</>}</span>
				</li>
			})}

		</ul>
	)

}