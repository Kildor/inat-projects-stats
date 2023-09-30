import { Observer } from 'DataObjects/Observer';
import React from 'react';
import { UserLink } from './UserLink';
import 'assets/Observers.scss';
import I18n from 'classes/I18n';

export enum Strategy {
	new_faces = 'new_faces'
}

export interface CommonObserverChange {
	currentPosition: number;
	prevPosition: number;
}

interface ObserverPrevChange extends CommonObserverChange {
	prevState: Observer;
	currentState?: Observer;
}
interface ObserverCurrentChange extends CommonObserverChange {
	prevState?: Observer;
	currentState: Observer;
}

export type iObserverChange = ObserverCurrentChange | ObserverPrevChange;

/** Свойства списка. */
export interface iObserverChangesListProps {
	/** Наблюдатели. */
	observers: iObserverChange[];
	/** Стратегия списка. */
	strategy: Strategy;
	/** Скрывать наблюдателей с разницей меньше чем. */
	difference: number;
	/** Показывать предыдущее состояние. */
	showPrevState: boolean;
	/** Показывать выбывших наблюдателей. */
	showRetired: boolean;
	/** Колонка для сортировки. */
	orderBy: 'species_count' | 'observation_count';
}

const getClassName = (diff: number, isNewFace: boolean, isRetiredFace: boolean) => {
	if (isRetiredFace) return 'retired';
	if (isNewFace) return 'new';
	if (diff < 0) return 'decreased';
	if (diff > 0) return 'increased';

	return 'same';
}


export const ObserverChangesList: React.FC<iObserverChangesListProps> = ({ observers, strategy = Strategy.new_faces, difference = 0, showPrevState = false, showRetired = true, orderBy }) => {
	if (!observers || observers.length === 0) return null;

	return (
		<ul className={`observers-list order-${orderBy}`}>
			<li className='header'>
				<span className="icon" />
				<span className="position" />
				<span className='difference' />
				<span className='user'>{I18n.t("Пользователь")}</span>
				<span className='observations'>{I18n.t("Наблюдения")} {orderBy === 'observation_count' && ' ▼'}</span>
				<span className='species'>{I18n.t("Виды")} {orderBy === 'species_count' && ' ▼'}</span>
			</li>
			{observers.filter(({ currentPosition }) => ((showRetired && showPrevState) || currentPosition > 0)).map(({ currentState, prevState, prevPosition, currentPosition }) => {
				const diff = prevPosition - currentPosition;
				const isNewFace = prevPosition === 0;
				const isRetiredFace = currentPosition === 0;
				if (Math.abs(diff) < difference && !isNewFace) return null;
				const cnPosition = `position-${getClassName(diff, isNewFace, isRetiredFace)}`;
				const key = currentState?.id ?? prevState!.id;

				return <li key={key} className={`observer ${cnPosition}`}>
					<span className="position">{currentPosition}</span>
					<span className='difference'>
						{!isNewFace ? (diff > 0 && !isRetiredFace ? '+' : diff === 0 ? ` ` : '') + diff : ''}
					</span> <UserLink user={currentState ?? prevState!} /> <span className='observations'>{currentState?.observations ?? 0} {showPrevState && `/ ${prevState?.observations ?? 0}`}</span> <span className='species'>{currentState?.species ?? 0} {showPrevState && <>/ {prevState?.species ?? 0}</>}</span>
				</li>
			})}

		</ul>
	)

}
