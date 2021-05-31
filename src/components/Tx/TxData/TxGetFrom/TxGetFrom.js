import * as React from "react";

import {_} from "src/lib/scripts";
import {txCheckFUBM, txCheckHTLT, txCheckOrder, txCheckSend} from "../TxCase";
import {NavLink} from "react-router-dom";

import txTypes from "src/constants/txTypes";
import DisplayLongString from "src/components/common/DisplayLongString";

const aBunch = [
	txTypes.DEX.LIST,
	txTypes.TOKENS.TIME_LOCK,
	txTypes.TOKENS.TIME_UNLOCK,
	txTypes.TOKENS.TIME_RELOCK,
	txTypes.TOKENS.HTLT_CLAIM,
	txTypes.TOKENS.HTLT_REFUND,
];

export default function({type, txData, value, cx}) {
	let from = null;
	if (txCheckSend(type)) from = value?.inputs?.[0]?.address;
	else if (txCheckOrder(type)) from = value.sender;
	else if (txCheckFUBM(type) || _.find(aBunch, v => v === type)) from = value.from;
	else if (txTypes.COSMOS.VOTE === type) from = value.voter;
	else if (txTypes.COSMOS.PROPOSAL_SUBMIT) from = value.proposer;
	if (_.isString(from))
		return (
			<NavLink className={cx("blueColor")} to={`/account/${from}`}>
				<DisplayLongString inputString={from} />
			</NavLink>
		);
	return <>-</>;
}
