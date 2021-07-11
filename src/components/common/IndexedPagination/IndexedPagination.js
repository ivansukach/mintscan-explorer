import React from "react";
import cn from "classnames/bind";
import styles from "./IndexedPagination.scss";
import {getPercentage} from "src/lib/scripts";

const cx = cn.bind(styles);

// TODO
//  memoize this in the future
export const footerRender = (
	state,
	// realTime, realTimeButtonClick,
	formattedMaxHeight,
	nextPage,
	previousPage,
	baseProperty,
	indexDisplayDecimals,
	jumpToEnd,
	jumpToStart
) => {
	// // console.log(state.maxIndex, state.isFront, state.pageData?.[0]?.[baseProperty]);
	// const jumpEnd = bool => {
	// 	if (state.isFront && !bool) return;
	// 	jumpToEnd(bool);
	// };
	// const forceInActive = state.pageData[0] === undefined;
	// const nextPage = bool => {
	// 	if (forceInActive) return;
	// 	if (state.pageData?.[state.pageData.length - 1]?.[baseProperty] <= 2 && !bool) return;
	// 	nextPageClick(bool);
	// };
	return (
		<div className={cx("table-footer")}>
			<div className={cx("paginationWrapper")}>
				<div
					className={cx(
						"realtime"
						// {inactive: !state.isFront || state.maxIndex !== state.pageData?.[0]?.[baseProperty]}
					)}>
					<button
						// onClick={realTimeButtonClick}
						className={cx("checkBox")}>
						<img
							alt={"checkbox"}
							className={cx()
							// {clicked: realTime}
							}
						/>
					</button>
					<div className={cx("text")}>Real Time</div>
				</div>
				<div className={cx("heightWrapper")}>
					<p>
						<span>index </span>
						{state.maxIndex ? getPercentage(state.pageData[0]?.[baseProperty], state.maxIndex, indexDisplayDecimals) : ""}%<span> of </span>
						{state.maxIndex ? formattedMaxHeight : ""}
					</p>
				</div>
				<div className={cx("buttonsWrapper")}>
					<img
						alt={"first"}
						className={cx(
							"last",
							"flip"
							// {inactive: forceInActive || (state.isFront && state.maxIndex === state.pageData?.[0]?.[baseProperty])}
						)}
						onClick={() => jumpToStart()}
					/>
					<img
						alt={"left"}
						className={cx(
							"right",
							"flip"
							// {inactive: forceInActive || (state.isFront && state.maxIndex === state.pageData?.[0]?.[baseProperty])}
						)}
						onClick={() => previousPage()}
					/>
					<img
						alt={"right"}
						className={cx(
							"right"
							// 	{
							// 	inactive: state.pageData?.[state.pageData.length - 1]?.[baseProperty] <= 2 || state.index[1] + state.pageSize > state.maxIndex,
							// }
						)}
						onClick={() => nextPage()}
					/>
					<img alt={"last"} className={cx("last")} onClick={() => jumpToEnd()} />
				</div>
			</div>
		</div>
	);
};
