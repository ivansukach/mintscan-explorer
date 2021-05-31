import React from "react";
import {_, empty, formatNumber, reduceString} from "src/lib/scripts";
import {NavLink} from "react-router-dom";

import txTypes from "src/constants/txTypes";
import * as Big from "src/lib/Big";
import getTxType from "src/constants/getTxType";
//  components
import Skeleton from "react-skeleton-loader";
import SvgDisplay from "src/components/common/SvgDisplay";
//  assets
import greenArrowSVG from "src/assets/common/transferarrow_gr.svg";
import {txCheckHTLT} from "src/components/Tx/TxData/TxCase";

export const CELL_TYPES = Object.freeze(["Tx Hash", "Type", "From", "To", "Value"]);

const BASE_MULT = Math.pow(10, 6);

export default function(blockData, cx, cell) {
	switch (cell) {
		case "Tx Hash":
			if (!_.isNil(blockData.tx_hash))
				return (
					<NavLink className={cx("blueColor")} to={`/txs/${blockData.tx_hash}`}>
						{reduceString(blockData.tx_hash, 6, 6)}
					</NavLink>
				);
			return <Skeleton />;
		case "Type":
			if (!_.isNil(blockData?.messages?.[0]?.type)) return <span className={cx("type")}>{getTxType(blockData?.messages?.[0]?.type)}</span>;
			return <Skeleton />;
		case "From": {
			// TODO
			//  pretty much divide all the cases
			// if (_.isNil(blockData?.messages)) return <Skeleton />;
			let address;
			if (!_.isNil(blockData?.sender)) address = `${blockData?.sender}`;
			if (_.isString(address))
				return (
					<NavLink className={cx("blueColor", blockData?.messages?.[0]?.type === txTypes.COSMOS.SEND ? "address" : undefined)} to={`/account/${address}`}>
						<span>{reduceString(address, 6, 6)}</span>
					</NavLink>
				);
			return <Skeleton />;
		}
		case "To": {
			// TODO
			//  pretty much divide all the cases
			// if (blockData?.messages?.[0]?.type !== txTypes.COSMOS.SEND) return "";
			// if (blockData?.messages?.[0]?.value?.outputs.length > 1) return <span>Multiple Address</span>;
			const address = `${blockData?.receiver}`;
			return (
				<>
					<SvgDisplay svgSrc={greenArrowSVG} customClass={"upsideDown"} />
					<NavLink className={cx("blueColor", blockData?.messages?.[0]?.type === txTypes.COSMOS.SEND ? "address" : undefined)} to={`/account/${address}`}>
						<span>{reduceString(address, 6, 6)}</span>
					</NavLink>
				</>
			);
		}
		case "Value": {
			const amount = Big.divide(blockData?.messages?.[0]?.value?.amount[0]?.amount, BASE_MULT);
			if (!_.isNil(amount)) {
				const split = amount.split(".");
				return (
					<>
						<span className={cx("text")}>{formatNumber(split[0])}</span>.<span className={cx("text", "decimal")}>{split[1]}</span>
					</>
				);
			}
			return "-";
		}
		default:
			return "DEFAULT";
	}
}
