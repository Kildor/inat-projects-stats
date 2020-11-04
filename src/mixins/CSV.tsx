import React, { ReactElement } from 'react'
import CSVConvertInterface from '../interfaces/CSVConvertInterface';

export interface CSVProps {
	header: Function
	useRank: boolean
	children: Array<CSVConvertInterface>
};

export default ({header, children, useRank=true} : CSVProps) : ReactElement => {
	let value = header(useRank) +
		children.map((element : CSVConvertInterface, index : number) => element.toCSV(useRank ? index : false)).join("\n");
	 return (
	 <textarea value={value} readOnly style={{ width: "700px", maxWidth: "90vw", height: "200px" }} onFocus={(e) => { e.target.select() }} />
	 )
}