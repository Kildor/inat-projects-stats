import { iDataListItem, iLookupPlace, iLookupTaxon } from "interfaces";
import { ChangeEvent, PropsWithChildren } from "react"

interface GenericFormControlProps extends PropsWithChildren {
	label: string
	name: string
	comment?: string | React.ReactNode
	className?: string
	children?: React.ReactNode
	disabled?: boolean
}

interface DatalistFormControlProps extends GenericFormControlProps {
	list?: Array<iDataListItem>
	clearDatalistHandler?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
	listName?: string
	datalistId?: string
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
export interface FormControlCheckboxFieldProps extends GenericFormControlProps {
	handler?: (name: string, value: boolean) => void
}

export interface FormControlRadioProps extends GenericFormControlProps {
	value: string | number | undefined | null
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	values: Map<string | number, string>
}
export interface FormControlSelectProps extends GenericFormControlProps {
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void
	value: string | readonly string[] | number | undefined
	values: Map<string | number, string>
	multiple?: boolean
}

export interface FormControlSelectFieldProps extends GenericFormControlProps {
	// onChange: (e: ChangeEvent<HTMLSelectElement>) => void
	values: Map<string | number, string>
	multipley?: boolean
}

export interface FormControlProps extends DatalistFormControlProps {
	type: string
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void
	value?: string | number
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void

	min?: string | number
	max?: string | number
	step?: string | number
}

export interface FormControlFieldProps extends Omit<FormControlProps, 'onChange'> {
	changeHandler?: (name: string, value: string) => void
	// field?: JSX.Element | React.ReactNode | ((props: FieldRenderProps<any, HTMLElement, any>) => any)
	// field?: JSX.Element | React.ReactNode
	field?: any
}

export interface FormControlTaxonProps extends DatalistFormControlProps {
	onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	updateState: (newState: Object) => void
	value: iLookupTaxon
}

export interface FormControlTaxonFieldProps extends DatalistFormControlProps {
	changeHandler?: (name: string, value: string) => void
}

export interface FormControlPlaceProps extends DatalistFormControlProps {
	onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	updateState: (newState: Object) => void
	value: iLookupPlace
}

export interface FormControlPlaceFieldProps extends DatalistFormControlProps {
	onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export interface MultilineControlProps extends GenericFormControlProps {
	value?: string | iDataListItem[]
	handler?: (e: ChangeEvent<HTMLTextAreaElement>) => void
}
export interface MultilineControlFieldProps extends GenericFormControlProps {
	handler?: (name: string, value: string) => void
}