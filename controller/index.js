import start from "./start-command.js";
import * as topUp from "./topup-command.js";
import wallet from "./wallet-command.js";
import errorServiceNotFound from "./error-command.js";

const Controller = {
    start,
    topUp,
    wallet,
    errorServiceNotFound,
}

export default Controller;