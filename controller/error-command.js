import { sendMessage } from "../helper/telegram-api.js";
import * as Messages from "../messages/index.js";

async function errorServiceNotFound(ctx, networkName) {
    await ctx.deleteMessage()
    const { id: userId } = ctx.update.callback_query.from;
    const { message, extra } = await Messages.errors.errorServiceNotFound(networkName);
    
    return sendMessage(userId, message, extra);
};

export default errorServiceNotFound;