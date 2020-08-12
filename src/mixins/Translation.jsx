import I18n from './I18n'
import React from 'react'

export default ({props})=> {
	return (
		<>{I18n.t(props.children, props.placeholders)}</>
	)
}