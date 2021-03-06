import axios from "axios";
import consts from "src/constants/consts";
import {_} from "src/lib/scripts";

// export const getAssets = cancelToken => {
// 	return axios.get(`${consts.API_BASE}${consts.API.ASSETS}`, {cancelToken});
// };

export const getBep8Assets = cancelToken => {
	return axios.get(`${consts.API_BASE}${consts.API.ASSETS_BEP8}`, {cancelToken});
};

export const getAssetPrices = cancelToken => {
	return axios.get(`${consts.API_BASE}${consts.API.ASSET_PRICES}`, {cancelToken});
};

export const getStatus = cancelToken => {
	return axios.get(`${consts.API_BASE}${consts.API.STATUS}`, {cancelToken});
};

export const getBasicData = cancelToken => {
	return axios.get(`${consts.API_RATES_INFO}/market-info`, {cancelToken});
};

export const getMarketChartPriceAndVolume = cancelToken => {
	return axios.get(`${consts.API_RATES_INFO}/market-volume-and-price-stats`, {cancelToken});
};

export const getFees = cancelToken => {
	return axios.get(`${consts.API_BASE}${consts.API.FEE}`, {cancelToken});
};

export const getValidators = cancelToken => {
	return axios.get(`${consts.API_BASE}${consts.API.VALIDATORS}`, {cancelToken});
};

const pingServer = (api, cancelToken) => {
	return axios.get(`${api}/ping`, {cancelToken});
};

export const getFastestNode = (apiArr = []) => {
	const promiseArr = _.map(
		apiArr,
		api =>
			new Promise((resolve, reject) =>
				pingServer(api)
					.then(res => resolve(api))
					.catch(ex => console.warn(`${api} is unavailable`))
			)
	);
	return Promise.race(promiseArr);
};

//  original api using coingecko
// export const getGeckoMarketChartRange = (id = "binancecoin", currency = "USD", from, to, cancelToken) => {
// 	return axios.get(`${consts.API_COINGECKO.BASE}${consts.API_COINGECKO.GET_MARKET_CHART_RANGE(id, from, to)}`, {cancelToken});
// };
