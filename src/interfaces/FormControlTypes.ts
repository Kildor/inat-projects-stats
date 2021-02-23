import { ChangeEvent } from "react"

interface GenericFormControlProps {
	label: string
	name: string
	comment?: string
	className?: string
	children?: React.ReactNode
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

export interface FormControlProps extends GenericFormControlProps {
	type: string
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	value: string | number
	list?: Array<Object>
	clearDatalistHandler?: (e: React.MouseEvent) => void
	listName?: string

	min?: string | number
	max?: string | number
	step?: string | number
}
