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
	showRetired: boolean;
}

const getClassName = (diff: number, isNewFace: boolean, isRetiredFace: boolean) => {
	if (isRetiredFace) return 'retired';
	if (isNewFace) return 'new';
	if (diff < 0) return 'decreased';
	if (diff > 0) return 'increased';

	return 'same';
}


export const ObserverChangesList: React.FC<iObserverChangesListProps> = ({ observers, strategy = Strategy.new_faces, difference = 0, showPrevState = false, showRetired = true }) => {
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
			{observers.filter(({ currentPosition }) => ((showRetired && showPrevState) || currentPosition > 0)).map(({ currentState, prevState, prevPosition, currentPosition }) => {
				const diff = prevPosition - currentPosition;
				const isNewFace = prevPosition === 0;
				const isRetiredFace = currentPosition === 0;
				if (Math.abs(diff) < difference && !isNewFace) return null;
				const cnPosition = `position-${getClassName(diff, isNewFace, isRetiredFace)}`;
				const key = currentState?.id ?? prevState.id;

				return <li key={key} className={`observer ${cnPosition}`}>
					<span className="position">{currentPosition}</span>
					<span className='difference'>
						{!isNewFace ? (diff > 0 && !isRetiredFace ? '+' : diff === 0 ? ` ` : '') + diff : ''}
					</span> <UserLink user={currentState ?? prevState} /> <span className='observations'>{currentState?.observations ?? 0} {showPrevState && <>/ {prevState?.observations ?? 0}</>}</span> <span className='species'>{currentState?.species ?? 0} {showPrevState && <>/ {prevState?.species ?? 0}</>}</span>
				</li>
			})}

		</ul>
	)

}
