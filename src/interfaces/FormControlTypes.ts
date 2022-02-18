import { iDataListItem, iLookupPlace, iLookupTaxon } from "interfaces";
import { ChangeEvent } from "react"

interface GenericFormControlProps {
	label: string
	name: string
	comment?: string
	className?: string
	children?: React.ReactNode
}

interface DatalistFormControlProps extends GenericFormControlProps {
	list?: Array<iDataListItem>
	clearDatalistHandler?: (e: React.MouseEvent) => void
	listName?: string
}

export interface BooleanControlProps extends GenericFormControlProps {
	handler: (e: React.ChangeEvent<HTMLInputElement>) => void,
	value: boolean
}

export interface NumberControlProps extends FormControlProps {
	handler: (e: React.ChangeEvent<HTMLInputElement>) => void,
	value: number
}

export interface FormControlCheckboxProps extends GenericFormControlProps {
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	checked: boolean
}
export interface FormControlRadioProps extends GenericFormControlProps {
	value: string | number | undefined | null
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	values: Map<string|number,string>
}
export interface FormControlSelectProps extends GenericFormControlProps {
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void
	value: string | readonly string[] | number | undefined
	values: Map<string | number, string>
	multiline?: boolean
}

export interface FormControlProps extends DatalistFormControlProps {
	type: string
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	value: string | number
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void

	min?: string | number
	max?: string | number
	step?: string | number
}

export interface FormControlTaxonProps extends DatalistFormControlProps {
	onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	updateState: (newState: Object)=>void
	value: iLookupTaxon
}

export interface FormControlPlaceProps extends DatalistFormControlProps {
	onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	updateState: (newState: Object)=>void
	value: iLookupPlace
}

export interface MultilineControlProps extends GenericFormControlProps {
	value: string | iDataListItem[]
	handler: (e: ChangeEvent<HTMLTextAreaElement>) => void
}