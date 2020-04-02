import * as React from "react";
import {useEffect} from "react";
import styles from "./TxMessage.scss";
import cn from "classnames/bind";
import {NavLink} from "react-router-dom";
import {divide, multiply} from "src/lib/Big";
import {_, empty, formatNumber, reduceString, refineAddress, getTotalTime} from "src/lib/scripts";
//  redux
import {useSelector} from "react-redux";
//  hooks
import {useGetImage, useHistory} from "src/hooks";
//  constants
import getTxTypeIcon from "src/constants/getTxTypeIcon";
import consts from "src/constants/consts";
import txTypes from "src/constants/txTypes";
import getTxType from "src/constants/getTxType";
//  components
import {txCheckFUBM, txCheckOrder, txCheckSend, txGetSide, txGetTimeInforce} from "src/components/Tx/TxData/TxCase";
import {Fade, Tooltip} from "@material-ui/core";
import InfoRow from "src/components/common/InfoRow/InfoRow";
import TxGetFrom from "src/components/Tx/TxData/TxGetFrom/TxGetFrom";
import tooltips from "src/constants/tooltips";
import Decimal from "src/components/common/Decimal";
import DisplayIcon from "src/components/common/DisplayIcon";

//  assets
import arrowSVG from "src/assets/transactions/symbol_arrow.svg";
import symbolNone from "src/assets/transactions/symbol_none.svg";
import detailSVG from "src/assets/transactions/symbol_detail_btn.svg";
import bnbSVG from "src/assets/common/binance_token.svg";

// const bnbSVG = "https://static.binance.org/icon/8fedcd202fb549d28b2f313b2bf97033";

const cx = cn.bind(styles);

export default function({msg, txData}) {
	const {type, value} = msg;
	const MsgGridRender = React.useMemo(() => {
		const displaySymbol = () => {
			if (!value.symbol) return "";
			const split = value.symbol.split("_");
			return split[0].split("-")[0] + "_" + split[1].split("-")[0];
		};
		return (
			<div className={cx("grid")}>
				{txCheckSend(type) ? (
					<>
						<div className={cx("toValue-row")}>
							<div className={cx("row-label")}>To / Value</div>
							<div className={cx("row-content-wrapper")}>
								<div className={cx("row-content")}>
									<ul className={cx("To-wrapper")}>
										<li className={cx("label")}>To</li>
										<li className={cx("value")}>
											{_.map(value.outputs, v => (
												<NavLink key={v.address} className={cx("blueColor")} to={`/account/${refineAddress(v.address)}`}>
													{reduceString(refineAddress(v.address), 10, 10)}
												</NavLink>
											))}
										</li>
									</ul>
									<ul className={cx("value-wrapper")}>
										<li className={cx("label")}>Value</li>
										<li className={cx("value")}>
											{_.map(value.outputs, v => (
												<span key={v.address}>
													{divide(v?.coins?.[0]?.amount, consts.NUM.BASE_MULT)} {v?.coins?.[0]?.denom}
												</span>
											))}
										</li>
									</ul>
								</div>
							</div>
						</div>
					</>
				) : (
					undefined
				)}
				{txCheckFUBM(type) ? (
					<>
						<InfoRow label='Value'>
							<span className={cx("flexIt")}>
								<Decimal fontSizeBase={15} value={divide(value?.amount, consts.NUM.BASE_MULT)} />
								<span className={cx("currency", {BNB: value.symbol === "BNB"})}>{value?.symbol?.split("-")[0]}</span>
							</span>
						</InfoRow>
					</>
				) : (
					undefined
				)}
				{txCheckOrder(type) ? (
					<>
						{txTypes.DEX.ORDER_NEW === type ? (
							<InfoRow label='Side'>
								<span className={cx({"color-red": value?.side === 2, "color-blue": value?.side === 1})}>{txGetSide[value?.side]} </span>
								{value?.symbol.split("-")[0]}
							</InfoRow>
						) : (
							undefined
						)}
						<InfoRow label='Symbol'>
							<div className={cx("symbol-link")} onClick={() => clickSymbol(value?.symbol)}>
								<p>{displaySymbol()}</p>
								<img src={detailSVG} alt='detail' />
							</div>
						</InfoRow>
						{txTypes.DEX.ORDER_NEW === type ? (
							<>
								<TradeDisplay value={value} />
								<InfoRow label='Price'>
									{/*{(() => console.log(value))()}*/}
									<span className={cx("flexIt")}>
										<Decimal fontSizeBase={15} value={divide(value?.price, consts.NUM.BASE_MULT, 8)} /> {_.split(_.split(value?.symbol, "_")[1], "-")[0]} / 1{" "}
										{_.split(_.split(value?.symbol, "_")[0], "-")[0]}
									</span>
								</InfoRow>
								{/*Removed because only one type is possible ATM*/}
								{/*<InfoRow label='Order Type'>*/}
								{/*	<span>{txGetOrderType[value?.ordertype]}</span>*/}
								{/*</InfoRow>*/}
								<InfoRow label='Time Inforce'>
									<Tooltip
										placement={"right-end"}
										TransitionComponent={Fade}
										TransitionProps={{timeout: 300}}
										title={value?.timeinforce === 1 ? tooltips.tx_timeInforce_GTE : tooltips.tx_timeInforce_IOC}
										disableFocusListener
										disableTouchListener>
										<span>{txGetTimeInforce[value?.timeinforce]}</span>
									</Tooltip>
								</InfoRow>
								<InfoRow label='Order ID'>
									<span>{value?.id}</span>
								</InfoRow>
							</>
						) : (
							undefined
						)}
					</>
				) : (
					undefined
				)}
				{type === txTypes.TOKENS.TIME_UNLOCK ? <InfoRow label={"Lock ID"}>{value.time_lock_id}</InfoRow> : undefined}
				{type === txTypes.TOKENS.TIME_LOCK ? (
					<InfoRow label={"Value"}>
						<span className={cx("flexIt")}>
							<Decimal fontSizeBase={15} value={divide(value?.amount?.[0]?.amount, consts.NUM.BASE_MULT)} />
							<span className={cx("currency", {BNB: value?.amount?.[0]?.denom === "BNB"})}>{value?.amount?.[0]?.denom?.split("-")[0]}</span>
						</span>
					</InfoRow>
				) : (
					undefined
				)}
				{type === txTypes.DEX.LIST ? (
					<>
						<InfoRow label='fee'>
							<span className={cx("flexIt")}>
								<Decimal fontSizeBase={15} value={"1000.000000"} />
								<span className={cx("currency", "BNB")}>BNB</span>
							</span>
						</InfoRow>
						<InfoRow label={"Initial Price"}>
							<span className={cx("flexIt")}>
								<Decimal fontSizeBase={15} value={divide(value?.init_price, consts.NUM.BASE_MULT)} />
								<span className={cx("currency", "BNB")}>BNB</span>
							</span>
						</InfoRow>
						<InfoRow label={"Symbol"}>
							<span>{value?.base_asset_symbol?.split("-")[0]}</span>
						</InfoRow>
					</>
				) : (
					undefined
				)}
				{type === txTypes.COSMOS.PROPOSAL_SUBMIT ? <TxSubmitProposal txData={txData} value={value} /> : undefined}
				<InfoRow label='From'>
					<TxGetFrom txData={txData} type={type} value={value} cx={cx} />
				</InfoRow>
				{type === txTypes.COSMOS.VOTE ? (
					<>
						<InfoRow label={"proposal ID"}>{value?.proposal_id}</InfoRow>
						<InfoRow label={"option"}>{value?.option}</InfoRow>
					</>
				) : (
					undefined
				)}
				<InfoRow label='Memo'>
					<span>{txData.memo === "" ? "-" : txData.memo}</span>
				</InfoRow>
			</div>
		);
	}, [txData, type, value]);

	// console.log(txData);
	return (
		<div className={cx("grid-wrapper")}>
			<div className={cx("type-wrapper")}>
				<img className={cx("txType-img")} src={getTxTypeIcon(type)} alt={"icon"} />
				<span>{getTxType(type)}</span>
			</div>
			{MsgGridRender}
		</div>
	);
}

const TxSubmitProposal = ({txData, value}) => {
	const description = JSON.parse(value.description);
	const listingSymbol = description?.description?.split(" ")[1].replace("/", "_");
	const displaySymbol = React.useMemo(() => {
		if (!listingSymbol) return "";
		const split = listingSymbol.split("_");
		return split[0].split("-")[0] + "_" + split[1].split("-")[0];
	}, [listingSymbol]);
	const render = React.useMemo(
		() => (
			<>
				<InfoRow label='Symbol'>
					<div className={cx("symbol-link")} onClick={() => clickSymbol(listingSymbol)}>
						<p>{displaySymbol}</p>
						<img src={detailSVG} alt='detail' />
					</div>
				</InfoRow>
				<ListTradingDisplay description={description} value={divide(1, divide(description.init_price, consts.NUM.BASE_MULT))} />
				<InfoRow label='Price'>
					<span className={cx("flexIt")}>
						<Decimal fontSizeBase={15} value={divide(description.init_price, consts.NUM.BASE_MULT)} /> {_.split(_.split(listingSymbol, "_")[1], "-")[0]} / 1{" "}
						{_.split(_.split(listingSymbol, "_")[0], "-")[0]}
					</span>
				</InfoRow>
				<InfoRow label='Initial Deposit'>
					<span className={cx("flexIt")}>
						<Decimal fontSizeBase={15} value={divide(value?.initial_deposit?.[0].amount, consts.NUM.BASE_MULT)} />
						{/*{"Always BNB anyway"}*/}
						<span className={cx("BNB")}>BNB</span>
					</span>
				</InfoRow>
				<InfoRow label='Expire Time'>{getTotalTime(description.expire_time)}</InfoRow>
			</>
		),
		[description, displaySymbol, listingSymbol]
	);
	if (value.proposal_type !== "ListTradingPair") return <InfoRow label='Type'>{value.proposal_type} - not implemented yet</InfoRow>;
	return render;
};

const ListTradingDisplay = ({description, value}) => {
	// TODO
	//  switch the arrowSVG to one with arrowheads on both sides
	return (
		<div className={cx("trade-wrapper")}>
			<TradeBox symbol={description.base_asset_symbol} value={value} />
			<div className={cx("symbol-wrapper")}>
				<img src={arrowSVG} alt='arrow' />
			</div>
			<TradeBox symbol={description.quote_asset_symbol} value={1} />
		</div>
	);
};

const TradeDisplay = ({value}) => {
	let [left, right] = [{}, {}];
	[left.symbol, right.symbol] = _.split(value.symbol, "_");
	[left.value, right.value] = [
		divide(value?.quantity, consts.NUM.BASE_MULT, 8),
		divide(multiply(value?.price, value?.quantity), multiply(consts.NUM.BASE_MULT, consts.NUM.BASE_MULT), 8),
	];
	// TODO
	//  set symbol source when backend provides
	if (value.side === 1) [left, right] = [right, left];
	return (
		<div className={cx("trade-wrapper")}>
			<TradeBox symbol={left.symbol} value={left.value} />
			<div className={cx("symbol-wrapper")}>
				<img src={arrowSVG} alt='arrow' />
			</div>
			<TradeBox symbol={right.symbol} value={right.value} />
		</div>
	);
};

const TradeBox = ({symbol, value}) => {
	const assets = useSelector(state => state.assets.assets);
	const formattedArr = React.useMemo(() => formatNumber(value).split("."), [value]);
	const [image, setLinkArr] = useGetImage([], symbolNone);
	useEffect(() => {
		if (!empty(assets) && !_.isNil(symbol) && image === symbolNone) {
			if (symbol === "BNB") setLinkArr([bnbSVG]);
			else setLinkArr([consts.GET_LOGO_LINK(symbol), _.filter(assets, v => v.asset === symbol)?.[0]?.assetImg]);
		}
	}, [assets, image, setLinkArr, symbol, value]);
	return (
		<div className={cx("box-wrapper")}>
			<DisplayIcon size={26} image={image}>
				<div className={cx("icon")}>{symbol.split("-")[0]}</div>
			</DisplayIcon>
			<div className={cx("value")}>
				{formattedArr[0]}
				{formattedArr[1] ? <span>.{formattedArr[1]}</span> : undefined}
			</div>
		</div>
	);
};

const clickSymbol = symbol => {
	if (_.isNil(symbol)) return;
	window.open(`${consts.API_BIANCE_DEX}/${symbol}`);
};
