import React from 'react';
import '../assets/fontastic-icons/fontastic-icons.scss';
import '../assets/taxa-icon.scss';
import { Taxon } from 'DataObjects';

export const TaxaIcon: React.FC<{ iconicTaxa: Taxon['iconicTaxa'] }> = ({ iconicTaxa }) => {

	return <span data-icon={iconicTaxa} className={`taxa-icon ${iconicTaxa} icon-iconic-${iconicTaxa.toLocaleLowerCase()}`}></span>
};

TaxaIcon.displayName = 'TaxaIcon';