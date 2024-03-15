import * as Messages from "../messages/index.js";
import { UserModel } from "../models/index.js";
import { sendMessage } from "../helper/telegram-api.js"

async function start(ctx) {
    const { id: userId } = ctx.message.from;
    await UserModel.findOrCreateUser(ctx.message.from);

    const { message, extra } = await Messages.main.start(ctx)

    return sendMessage(userId, message, extra)
}

export default start;