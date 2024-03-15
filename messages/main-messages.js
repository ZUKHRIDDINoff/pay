import * as markdown from "./markdown.js"

async function start(ctx) {
    const message = `Добро пожаловать, {username}\nFovPay — это бот-кошелёк для получения, отправки, покупки и хранения криптовалюты в Telegram.`
    const parsedMessage = markdown.includeUsername(ctx, message);

    const buttons = {
        inline_keyboard: [
            [
                {
                    text: "💵 Мой кошелек", callback_data: "wallet"
                }
            ]   
        ]
    }

    const extra = {
        reply_markup: buttons,
        parse_mode: "Markdown"
    }
    return { message: parsedMessage, extra };
}


export {
    start
};