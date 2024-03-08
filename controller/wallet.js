import { PaymentCurrenciesModel, UserPaymentWallets, UserModel } from "../models/index.js";

async function wallet(ctx) {
    const { from: { id: userId } } = ctx.update.callback_query;
    const user = await UserModel.findOne({ where: { user_id: userId }}).catch(err => console.log(err));
    let message = `💵 Ваш баланс:\n\n▫️${user.balance_usd} USD`
    const keyboard = [
        [{
            text: "📥 Пополнить", callback_data: "top_up&&choose_crypto"
        }]
    ]
    ctx.editMessageText(message, { reply_markup: { inline_keyboard: keyboard } }); 

}



export default wallet;