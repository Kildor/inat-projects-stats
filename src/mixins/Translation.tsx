import React from 'react'
import I18n from '../classes/I18n'
			
			
export const Translate = (
	{ children, replace = [] }: {children: string, replace?: Array<string|number>}
) => <>{I18n.t(children, replace)}</>;
		
export const TranslateJSX = (
	{ children, replace = [] }: {children: string, replace?: React.ReactNode[]}
) => {
	const translatedString = I18n.t(children).replaceAll(/[{](\d+)[}]/g, "||>$1||").replaceAll(/%(\d+)/g, "||>$1||").split('||');
	return <>{translatedString.map((part: string, i: string) => {
		if( part.startsWith('>')) {
			const index = parseInt(part.substring(1));
			return index <= replace.length ? <React.Fragment key={i}>{replace[index - 1]}</React.Fragment> : `{${index}}`
		}
		return part;
	})}</>;
}