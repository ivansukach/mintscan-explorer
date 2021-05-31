import dashboard from "src/assets/header/dashboard_ic_none.svg";
import dashboardOn from "src/assets/header/dashboard_ic.svg";
import blocks from "src/assets/header/blocks_ic_none.svg";
import blocksOn from "src/assets/header/blocks_ic.svg";
import txs from "src/assets/header/transations_ic_none.svg";
import txsOn from "src/assets/header/transations_ic.svg";
import octa from "src/assets/header/octa_ic_none.svg";
import octaOn from "src/assets/header/octa-ic.svg";

export default {
	on: [dashboardOn, blocksOn, txsOn, octaOn],
	off: [dashboard, blocks, txs, octa],
};
