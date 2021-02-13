import { ChangeEvent } from "react"

export type BooleanControlProps = {
	handler: (e: React.ChangeEvent<HTMLInputElement>) => void,
	value: boolean
}

export type NumberControlProps = {
	handler: (e: React.ChangeEvent<HTMLInputElement>) => void,
	value: number
}

export interface FormControlCheckboxProps {
	label: string
	name: string
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	checked: boolean
	children?: React.ReactNode
}

export interface FormControlProps {
	label: string
	type: string
	name: string
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	value: string | number
	list?: Array<Object>
	clearDatalistHandler?: (e: React.MouseEvent) => void
	listName?: string
	min?: string | number
	max?: string | number
	step?: string | number
}
