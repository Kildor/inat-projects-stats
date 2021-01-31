import React, { ReactElement } from 'react'
import I18n from '../classes/I18n';
import CSVConvertInterface from '../interfaces/CSVConvertInterface';
import FileSaver from 'file-saver'

export interface CSVProps {
	header: Function
	useRank: boolean
	children: Array<CSVConvertInterface>
};

const download = (csv: string, filename?: string)=>{
	const blob = new Blob([csv], {type: 'text/csv'});
	FileSaver.saveAs(blob, filename || "stats.csv");
}
export default ({ header, children, useRank = true }: CSVProps): ReactElement => {
	let value = header(useRank) +
		children.map((element: CSVConvertInterface, index: number) => element.toCSV(useRank ? index : false)).join("\n");
	return (
		<div className="csv-wrapper" style={{ width: "700px", maxWidth: "90vw" }}>
			<textarea value={value} readOnly style={{ width: "100%", height: "200px", }} onFocus={(e) => { e.target.select() }} />
			<button style={{display:"block", margin:"5px auto"}} className="button button-download" onClick={e=>{download(value)}}>{I18n.t("Download")}</button>
		</div>
	)
}