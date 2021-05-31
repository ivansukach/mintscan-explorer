import * as React from "react";
import cn from "classnames/bind";
import axios from "axios";

import {_, empty, getUnixTimes} from "src/lib/scripts";
import {getMarketChartPriceAndVolume} from "src/lib/api";

import ErrorPage from "src/components/common/ErrorPage";
import Chart from "src/components/common/Chart";
import styles from "./GraphDisplay.scss";
import consts from "../../../../constants/consts";

const cx = cn.bind(styles);

//  coingecko api
/*
	0: prices
	1: market_caps
	2: total_volumes
*/

export default function(props) {
	const [data, setData] = React.useState(null);
	// let timeNow = Date.now()-600000;
	// let prices = new Array(10);
	// let volumes = new Array(10);
	// for(let i = 0; i<10; i++){
	// 	prices[i]=[timeNow+i*60000, 0.08]
	// 	volumes[i]=[timeNow+i*60000, 0]
	// }
	const [showPrice, setShowPrice] = React.useState(true);
	// const data = [prices, volumes];
	// const setData = undefined;
	React.useEffect(() => {
		const interval = setInterval(() => {
			const cancelToken = axios.CancelToken;
			const source = cancelToken.source();
			getMarketChartPriceAndVolume(source.token)
				.then(res => {
					if (_.isObject(res.data)) {
						res.data.priceStats = res.data.priceStats.map(ps => {
							ps.price = Math.round(ps.price * 100) / 100;
							return [ps.time * 1000, ps.price];
						});
						res.data.volumeStats = res.data.volumeStats.map(vs => {
							vs.volume = Math.round(vs.volume * 100) / 100;
							return [vs.time * 1000, vs.volume];
						});
						setData(res.data);
					}
				})
				.catch(ex => {
					console.log("exception querying RATES API: ", ex);
				});
			return () => {
				source.cancel("cleanup cancel");
			};
		}, consts.NUM.BASIC_DATA_FETCH_INTERVAL_MS);
	}, []);
	const clickTab = React.useMemo(() => () => setShowPrice(v => !v), []);
	return (
		<div className={cx("GraphDisplay")}>
			<div className={cx("tab-wrapper")}>
				<button className={cx({selected: showPrice})} onClick={clickTab}>
					<p>Price</p>
				</button>
				<button className={cx({selected: !showPrice})} onClick={clickTab}>
					<p>Volume</p>
				</button>
			</div>
			<div className={cx("Graph-wrapper")}>
				{_.isNil(data) ? (
					undefined
				) : empty(data?.priceStats) || empty(data?.volumeStats) ? (
					<ErrorPage />
				) : (
					<Chart key={showPrice} options={options} data={showPrice ? data.priceStats : data.volumeStats} />
				)}
			</div>
		</div>
	);
}

const options = {
	chart: {
		type: "areaspline",
		margin: [5, 15, 20, 15],
		height: "180px",
		width: null,
		spacing: [20, 20, 20, 20],
		renderTo: "container",
	},
};
