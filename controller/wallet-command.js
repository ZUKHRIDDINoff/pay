import { UserModel } from "../models/index.js";
import * as Messages from "../messages/index.js";

async function wallet(ctx) {
    const { from: { id: userId } } = ctx.update.callback_query;
    const user = await UserModel.findOne({ where: { user_id: userId }});

    const { message, extra } = Messages.wallet.wallet(user);
    
    ctx.editMessageText(message, extra);
}



export default wallet;