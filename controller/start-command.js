import { UserModel } from "../models/index.js";


async function start(ctx) {
    const { id: userId, first_name: firstName, last_name: lastName = null, username: userName = null} = ctx.message.from;
    const newUser = await UserModel.findOrCreate({
        where: {
            user_id: userId
        },
        defaults: {
            first_name: firstName,
            last_name: lastName,
            username: userName,
            create_dt: Date.now()
        }
        
    }).catch(err => console.log(err))

    const message = `Добро пожаловать, {username}\nFovPay — это бот-кошелёк для получения, отправки, покупки и хранения криптовалюты в Telegram.`
    const parsedMessage = includeUsername(ctx, message);

    const keyboard = {
        inline_keyboard: [
            [
                {
                    text: "💵 Мой кошелек", callback_data: "my_wallet"
                }
            ]
            
        ]
    }

    const { message_id } = await ctx.replyWithMarkdown(parsedMessage, { reply_markup: keyboard })
    await UserModel.update({last_message: message_id},{ where: { user_id: userId }});
}

function parse(text) {
    const textSymbols = {
        "-"    : "\\-",  "[!]"  : "\\!",  "[*]"  : "\\*",  "[[]"  : "\\[",
        "[\\]]": "\\]",  "[(]"  : "\\(",  "[)]"  : "\\)",  "[_]"  : "\\_",
        "[+]"  : "\\+",  "[|]"  : "\\|",  "[=]"  : "\\=",  "[`]"  : "\\`",
        "[>]"  : "\\>",  "[.]"  : "\\.",  "[#]"  : "\\#",  "[~]"  : "\\~",
        "[{]"  : "\\{", "[}]"  : "\\}",
    };

    for (const symbol of Object.keys(textSymbols)) {
        text = text.replace(new RegExp(symbol, 'g'), textSymbols[symbol]);
    };

    const parsedText = escapeLinks(
        escapeUsernames(
            escapeHashTags(
                parseLinks(text)
            )
        )
    );

    return parsedText;
}

function includeUsername(ctx, text) {
    const { id: userId } = ctx.from;
    const userFullName = getFullName(ctx);

    const userMention = `[${userFullName}](tg://user?id=${userId})`;
    return String(text).replace(/{username}/g, userMention).replace(/\\{username\\}/g, userMention);
}
function getFullName(ctx) {
    const { first_name: firstName, last_name: lastName = "" } = ctx.from;

    let userFullName = firstName + (lastName ? " " + lastName : "");
    userFullName = userFullName.replace(/\[/g, '');
    userFullName = userFullName.replace(/\]/g, '');

    return userFullName.trim();
}

export default start;