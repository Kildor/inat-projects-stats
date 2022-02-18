import React, { ReactElement } from 'react'
import FileSaver from 'file-saver'
import { iCSVConvert } from 'interfaces'
import I18n from 'classes/I18n'

export interface CSVProps {
	header: Function
	useRank: boolean
	filename?: string
	children: Array<iCSVConvert>
};

const download = (csv: string, filename?: string) => {
	const blob = new Blob([csv], { type: 'text/csv' });
	FileSaver.saveAs(blob, filename || "stats.csv");
}
export const CSV = ({ header, children, useRank = true, filename = "stats.csv" }: CSVProps): ReactElement => {
	let value = header(useRank) +
		children.map((element: iCSVConvert, index: number) => element.toCSV(useRank ? index : false)).join("\n");
	return (
		<div className="csv-wrapper" style={{ maxWidth: "90vw" }}>
			<textarea value={value} readOnly style={{ width: "100%", height: "500px", }} onFocus={(e) => { e.target.select() }} />
			<button style={{ display: "block", margin: "5px auto" }} className="button button-download" onClick={e => { download(value, filename) }}>{I18n.t("Скачать")}</button>
		</div>
	)
}

export default CSV;