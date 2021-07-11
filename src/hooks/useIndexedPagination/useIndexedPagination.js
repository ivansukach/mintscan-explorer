/*
 * WARNING
 * the code here deliberately contains missing dependencies in hooks(for my sanity's sake)
 * A LOT of refactoring will probably be needed if attempted to fix.
 * You have been warned
 */
import {useCallback, useEffect, useMemo, useReducer} from "react";
//  hooks
// TODO
//  refactor this to use SWR instead maybe
//  or just remove it completely and use useFetch
//  (honestly personally customized custom hooks seem much easier to use)
import {useGet} from "restful-react";
import {useHistory} from "src/hooks";

import {empty} from "src/lib/scripts";
// import reducer, {
//     EXTRA_LOAD,
//     EXTRA_LOAD_FAIL,
//     EXTRA_LOAD_INIT,
//     INITIAL_LOAD,
//     INITIAL_LOAD_QUERY,
//     initialState,
//     RECENT_DATA_LOAD,
//     RESET,
//     UPDATE_ISFRONT,
// } from "src/hooks/useIndexedPagination/reducer";
import reducer, {CHANGE_PAGE, EXTRA_LOAD, INITIAL_LOAD, initialState} from "src/hooks/useIndexedPagination/reducer";

export const SPARE_PAGE_CNT = 2; //  how many pages left before a refetch is triggered

//  customized auto fetch + autofetch + pagination.
export default function({path, pageSize = 20, pagingProperty = "height", limit = 20, resolve = undefined, updateQuery = ""}) {
	const history = useHistory();
	const [state, dispatch] = useReducer(reducer, initialState, () => initialState);
	// const refinedQuery = useMemo(() => {
	//     if (updateQuery === "") return;
	//     return setRefinedQuery(history, updateQuery);
	// }, [updateQuery, history]);
	// const [realTime, setRealTime] = useState(refinedQuery === 1);
	//let beforeElement = 0
	//let index = [undefined, undefined]
	const {data, loading, error, refetch} = useGet({
		path: state.initialLoad === true ? `${path}?limit=${limit}` : `${path}?limit=${limit}&before=${state.index[1] + 1}`,
		resolve: resolve,
	});

	// //  Only use refetch when retrieving cutting-edge data
	// const [recentData, , setUrl] = useFetch("", "get");
	//
	// const [watch, setWatch] = useTimer(realTime, consts.NUM.REAL_TIME_DELAY_MS);
	//
	// //  for real time data
	// useEffect(() => {
	// 	// console.log(recentData, realTime);
	// 	// TODO - bugfix
	// 	//  if watch is switched quickly
	// 	//  the same url is queried and as a result useFetch does not function
	// 	if (error || empty(state.allData) || realTime === false) return;
	// 	if (recentData.loading === false && recentData.error === false) {
	// 		if (loading) return;
	// 		setUrl(`${consts.API_BASE}${path}` + getQueryParams(state.allData, true, pagingProperty, "", limit));
	// 	}
	// 	// eslint-disable-next-line
	// }, [watch]);
	//
	// //  possible temporary fix by using setTimeout
	// useEffect(() => {
	// 	let timeout;
	// 	if (error) return clearTimeout(timeout);
	// 	timeout = setTimeout(() => {
	// 		console.log("setting setWatch", realTime);
	// 		setWatch(realTime);
	// 	}, 1000);
	// 	return clearTimeout(timeout);
	// 	// console.log("setting setWatch", realTime);
	// 	// eslint-disable-next-line
	// }, [realTime]);
	//
	// //  new data from recentData
	// useEffect(() => {
	// 	if (_.isNil(recentData.data?.data) || !realTime) return;
	//
	// 	if (recentData.data.data) {
	// 		// console.log("getRecentData", recentData.data);
	// 		dispatch({
	// 			type: RECENT_DATA_LOAD,
	// 			payload: {data: recentData.data.data, maxIndex: Number(recentData.data.paging.total)},
	// 		});
	// 		if (recentData.data.data.length > limit) {
	// 			console.warn(`getRecentData overflowed (${recentData.data.data.length}>${limit}[limit])`);
	// 			// TODO
	// 			//  exception handling when recentData query is insufficient
	// 		}
	// 	}
	// 	// eslint-disable-next-line
	// }, [recentData.data]);
	//
	// //  appending new data
	// useEffect(() => {
	// 	if (_.isNil(data?.data) && state.isFront === false && realTime && _.isBoolean(state.params.after)) {
	// 		dispatch({type: UPDATE_ISFRONT});
	// 	}
	// 	if (!_.isNil(error) || (_.isNil(data?.data) && !_.isBoolean(state.params.after))) return;
	// 	if (state.reset !== 0) {
	// 		//  real reset data
	// 		// console.log("resetAfter>>>>", _.cloneDeep(state), data);
	// 		if (data?.paging?.total && data?.paging?.total === data?.data?.[0]?.[pagingProperty]) {
	// 			if (state.reset === 1) {
	// 				setRefinedQuery(history, updateQuery, 0);
	// 				if (!realTime) setRealTime(true);
	// 				return dispatch({
	// 					type: INITIAL_LOAD,
	// 					payload: {data: data.data, pageSize, index: [0, pageSize - 1], maxIndex: Number(data.paging.total)},
	// 				});
	// 			}
	// 			return;
	// 		} else if (data?.paging?.total && data?.data?.[0]?.[pagingProperty] <= 3) {
	// 			if (state.reset === 2) {
	// 				setRefinedQuery(history, updateQuery, 10000003);
	// 				if (realTime) setRealTime(false);
	// 				getInitialLoadQuery(refinedQuery, {
	// 					data: _.reverse(data.data),
	// 					maxIndex: Number(data.paging.total),
	// 					pageSize,
	// 					index: [0, pageSize - 1],
	// 				});
	// 				dispatch({type: EXTRA_LOAD_INIT, payload: {after: true}}); //  query for the ones before as well
	// 			} else {
	// 				throw new Error(`state.reset is not 1 or 2 - ${state.reset}`);
	// 			}
	// 		}
	// 		return;
	// 	}
	//  initial load
	useEffect(() => {
		if (empty(state.index)) {
			if (data !== undefined && data?.data !== undefined) {
				return dispatch({
					type: INITIAL_LOAD,
					payload: {
						data: data.data,
						pageSize,
						index: [Number(data.paging.total) - pageSize + 1, Number(data.paging.total)],
						maxIndex: Number(data.paging.total),
					},
				});
			}
		} else {
			if (data?.data !== undefined) {
				alert("NEW DATA ARRIVED");
				return dispatch({
					type: EXTRA_LOAD,
					payload: {data: data.data, maxIndex: Number(data.paging.total)},
				});
			}
		}
	}, [data]);
	//else {
	// 	alert("SECOND INITIAL LOAD");
	// 	getInitialLoadQuery(refinedQuery, {
	// 		data: data.data,
	// 		maxIndex: Number(data.paging.total),
	// 		pageSize,
	// 		index: [0, pageSize - 1],
	// 	});
	// 	dispatch({type: EXTRA_LOAD_INIT, payload: {after: true}}); //  query for the ones before as well
	// }
	// }
	// 	//  when new data arrives, append to allData
	// 	else if (!empty(state.allData) && _.isBoolean(state.params.after)) {
	// 		//  is data new?
	// 		if (!_.isNil(data?.data)) {
	// 			if (
	// 				(state.params.after === true && data.data[0]?.[pagingProperty] > state.allData?.[0]?.[pagingProperty]) ||
	// 				(state.params.after === false && data.data[0]?.[pagingProperty] < state.allData?.[state.allData.length - 1]?.[pagingProperty])
	// 			) {
	// 				dispatch({
	// 					type: EXTRA_LOAD,
	// 					payload: {data: data.data, after: state.params.after, loading, maxIndex: Number(data.paging.total)},
	// 				});
	// 			}
	// 		} else {
	// 			if ((state.index[0] === 0 && state.params.after === false) || (state.index[1] === state.allData.length - 1 && state.params.after === true))
	// 				dispatch({type: EXTRA_LOAD_FAIL});
	// 		}
	// 	}
	// eslint-disable-next-line
	// }, [data, state.index]);
	//
	// async function getInitialLoadQuery(refinedQuery, payload) {
	// 	return dispatch({type: INITIAL_LOAD_QUERY, payload: {...payload}});
	// }

	// useEffect(() => {
	//     // refetch().then(()=>{
	//     //     alert("REFETCH")
	//     //     return dispatch({
	//     //         type: EXTRA_LOAD,
	//     //         payload: {data: data.data, maxIndex: Number(data.paging.total)},
	//     //     });
	//     // })
	//     alert("NEW DATA ARRIVED")
	// 	// eslint-disable-next-line
	// }, [data]);
	//
	// //  check param change and if refetch is needed, do it! Else don't.
	// useEffect(() => {
	// 	if (!_.isBoolean(state.params.after)) return;
	// 	//  change page if necessary
	// 	if (!(state.isFront !== true && state.params.after !== false && state.index[0] === 0)) {
	// 		dispatch({type: PAGE_CHANGE, payload: {after: state.params.after}});
	// 	}
	// 	if (state.params.after === false && !state.isNoMore) {
	// 		//  case, not enough left (pageSize*SPARE_PAGE_CNT) => trigger refetch
	// 		// console.log("compare", state.index[1] + pageSize, "??", state.allData.length - 1 - pageSize * SPARE_PAGE_CNT);
	// 		if (state.index[1] + pageSize > state.allData.length - 1 - pageSize * SPARE_PAGE_CNT && !state.isNoMore) {
	// 			// alert("REFETCH 1")
	// 			refetch({
	// 				path: getQueryParams(state.allData, state.params.after, pagingProperty, path, limit),
	// 			});
	// 		}
	// 	} else {
	// 		if (state.isFront === true) throw new Error("Exception - Attempt to trigger more recent data at front");
	// 		if (state.index[0] < SPARE_PAGE_CNT * (pageSize - 1))
	// 			// alert("REFETCH 2")
	// 			refetch({
	// 				path: getQueryParams(state.allData, state.params.after, pagingProperty, path, limit),
	// 			});
	// 	}
	// 	// eslint-disable-next-line
	// }, [state.params]);
	//
	// //  initialize for data fetching and/or page change
	// const updateCurrentPage = useCallback(
	// 	after => {
	// 		if (state.isFront && after === true) return;
	// 		dispatch({type: EXTRA_LOAD_INIT, payload: {after}});
	// 	},
	// 	[state.isFront]
	// );
	//
	// //  initialize for data fetching on page change to front or last
	// const jumpToEnd = useCallback(
	// 	bool => {
	// 		// console.log("jumped", bool, state);
	// 		if (!!bool && state.isNoMore) return;
	// 		// already end
	// 		else if (!bool && !!state.isFront) return; // already front
	// 		if (bool) {
	// 			dispatch({type: RESET, payload: {reset: 2}});
	// 		} else {
	// 			dispatch({type: RESET, payload: {reset: 1}});
	// 		}
	// 	},
	// 	[state.isFront, state.isNoMore]
	// );
	const jumpToEnd = () => {
		dispatch({type: CHANGE_PAGE, payload: {index: [0, state.pageSize - 1]}});
		// dispatch({type: CHANGE_PAGE, payload: {index: [state.maxIndex+1-state.pageSize, state.maxIndex]}});
		// refetch({
		//     path: `${path}?limit=${limit}&before=${state.pageSize}`
		// }).then(() => {
		//     alert("END")
		//     return dispatch({
		//         type: EXTRA_LOAD,
		//         payload: {data: data.data, index: [0, state.pageSize - 1], maxIndex: Number(data.paging.total)},
		//     });
		// })
	};
	const jumpToStart = () => {
		dispatch({type: CHANGE_PAGE, payload: {index: [state.maxIndex + 1 - state.pageSize, state.maxIndex]}});
		// refetch({
		//     path: `${path}?limit=${limit}`
		// }).then((d) => {
		//     alert("START")
		//     return dispatch({
		//         type: EXTRA_LOAD,
		//         payload: {data: data.data, index: [state.maxIndex + 1 - state.pageSize, state.maxIndex], maxIndex: Number(data.paging.total)},
		//     });
		// })
	};
	const nextPage = () => {
		alert("NEXT");
		dispatch({
			type: CHANGE_PAGE,
			payload: {index: [state.index[0] - state.pageSize, state.index[1] - state.pageSize]},
		});
		// alert("NEXT PAGE")
		// if (after && state.isFront) return;
		// if (realTime && !after) {
		// 	// console.log("setRealTimeFalse");
		// 	setRealTime(false);
		// }
		// if (!after && state.index[1] + state.pageSize > state.maxIndex) return;
		// alert("UPDATE PAGE");
		// updateCurrentPage(after);
		// console.log("clicked next");
	};
	const previousPage = () => {
		alert("PREVIOUS");
		dispatch({
			type: CHANGE_PAGE,
			payload: {index: [state.index[0] + state.pageSize, state.index[1] + state.pageSize]},
		});
	};

	// //  data refining process
	// const getPageData = useCallback(() => {
	//     alert("GET PAGE DATA")
	//     let pageData = []
	//     if (state.allData !== undefined) {
	//         for (let idx of state.allData.keys()) {
	//             if (idx >= state.index[0] && idx <= state.index[1]) {
	//                 pageData.push(state.allData.get(idx))
	//             }
	//         }
	//     }
	//     return pageData;
	// }, [state.allData, state.index]);
	// const pageData = useMemo(() => getPageData(), [getPageData]);
	const pageData = useMemo(() => {
		alert("GET PAGE DATA");
		let pageData = [];
		if (state.allData !== undefined) {
			for (let idx = state.index[1]; idx >= state.index[0]; idx--) {
				if (state.allData.get(idx) !== undefined) {
					pageData.push(state.allData.get(idx));
				}
			}
		}
		return pageData;
	}, [state.allData.size, state.index]);
	// //  update query if changed
	// useEffect(() => {
	// 	// console.log("pageChangeCheck>>>>>>", {
	// 	// 	..._.omit(state, ["allData"]),
	// 	// 	allDataSize: state.allData.length,
	// 	// 	realTime,
	// 	// });
	// 	if (error || empty(pageData)) return;
	// 	// console.log("refinedQuery", refinedQuery);
	// 	if (realTime) {
	// 		setRefinedQuery(history, updateQuery, 0);
	// 		return;
	// 	}
	//
	// 	if (refinedQuery === pageData[0][pagingProperty] + 1) return;
	// 	setRefinedQuery(history, updateQuery, pageData[0][pagingProperty]);
	// 	// eslint-disable-next-line
	// }, [pageData, state.isFront, realTime, error, history, pagingProperty]);
	//
	// const forceLoadAfter = after => dispatch({type: EXTRA_LOAD_INIT, payload: {after: after}}); //  query for the ones before as well
	return [
		// loading,
		// error,
		{
			...state,
			pageData,
			allData: undefined,
		},
		// updateCurrentPage,
		jumpToEnd,
		jumpToStart,
		nextPage,
		previousPage,
		// [realTime, setRealTime],
		// forceLoadAfter,
	];
}

// //  get query params to query from server
// const getQueryParams = (arr, after, pagingProperty, path, limit) => {
// 	const baseIndex = after ? arr[0]?.[pagingProperty] : arr[arr.length - 1]?.[pagingProperty];
// 	if (_.isNil(baseIndex)) return throw new Error("First or last element in array does not have baseProperty set");
// 	return `${path}?limit=${limit}&${after ? "after" : "before"}=${baseIndex}`;
// };
//
// //  set query to 0 if not set, sets to value if value is set, returns query+1 for realistic before server query
// const setRefinedQuery = (history, queryValue, value) => {
//     const parsed = queryString.parse(history.location.search, {parseNumbers: true});
//     const parsedKeys = _.keys(parsed);
//     if (!_.isNil(value)) {
//         if (parsed[queryValue] === value) return;
//         parsed[queryValue] = value;
//         history.replace(`${window.location.pathname}?${queryString.stringify(parsed)}`, {shallow: true});
//     } else if (!(_.includes(parsedKeys, queryValue) && !empty(parsed[queryValue]) && _.isSafeInteger(parsed[queryValue]) && parsed[queryValue] >= 0)) {
//         parsed[queryValue] = 0;
//         history.replace(`${window.location.pathname}?${queryString.stringify(parsed)}`, {shallow: true});
//     }
//     //  +1 because we need the heights including the value(before returns descending)
//     return parsed[queryValue] + 1;
// };

//  allData -> blocks where heights are in descending order

//  query params loadMore
//  after: true -> get heights higher than said height(in ascending order)
//  after: false -> get heights lower than said height(in descending order)
/*
{
	height: int,
	after: boolean
}
 */
//  indexState
/*
[
	firstIndex(starting at 1)
	lastIndex
]
 */
