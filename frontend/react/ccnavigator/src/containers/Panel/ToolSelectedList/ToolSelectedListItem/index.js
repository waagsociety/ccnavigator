import React from 'react';
import { css } from 'util/aphrodite-custom.js';
import Style from './style.js';

/**
 * make a row
 */
const ToolSelectedListItem = (props) =>
	<div className={css(Style.row)}>
		<div className={css(Style.cell, Style["cell-1"])}>{props.title}</div>
		<div className={css(Style.cell, Style["cell-2"])}><button className={css(Style.delete)} onClick={() => {props.onDelete(props)}}>delete</button></div>
	</div>

export default ToolSelectedListItem;
