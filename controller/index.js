import start from "./start-command.js";
import {topUp, chooseNetwork} from "./top_up-command.js";
import wallet from "./wallet.js";
import errorServiceNotFound from "./errors.js";

const Controller = {
    start,
    topUp,
    wallet,
    chooseNetwork,
    errorServiceNotFound,
}

export default Controller;