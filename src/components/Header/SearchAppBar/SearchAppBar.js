import React, {useCallback, useMemo, useState} from "react";
import cn from "classnames/bind";
import styles from "./SearchAppBar.scss";
import _ from "lodash";
import {NavLink} from "react-router-dom";
import {useHistory} from "src/hooks";
//  components
import SearchArea from "src/components/common/SearchArea";
import {Toolbar} from "@material-ui/core";

import consts from "src/constants/consts";

import dropdownArrow from "src/assets/common/dropdown_arrow.svg";
import binance from "src/assets/header/chain_ic.svg";
import iris from "src/assets/header/iris_token.svg";
import kava from "src/assets/header/kava_token.svg";
import cosmos from "src/assets/header/atom_token.svg";
import logo from "src/components/Footer/images/logo.png";

const cx = cn.bind(styles);

// const avaliableNetworks = ["cosmos", "iris", "kava", "binance"];
// const tokenImg = [cosmos, iris, kava, binance];

export default function(props) {
	const render = (
		<div className={cx("SearchAppBar-root")} id={"Header-fixed-id"}>
			<Toolbar className={cx("toolbar")}>
				<NavLink to='https://octa-coin.com/'>
					<img src={logo} alt={"logo"} />
				</NavLink>
				<div className={cx("select-wrapper")}>
					<SearchArea propCx={cx} dropdownStyle={{position: "fixed", width: "459px"}} />
				</div>
			</Toolbar>
		</div>
	);
	return useMemo(() => render, [render]);
}
