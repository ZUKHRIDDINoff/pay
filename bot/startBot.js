import crypto from 'crypto'
import { Telegraf } from "telegraf";

import { generateAdress, generateQrCode } from "../mains/index.js";
import Contoller from "../controller/index.js";
import { PaymentCurrenciesModel, UserPaymentWallets } from "../models/index.js";

const bot = new Telegraf('6469165118:AAG1qTb8KcQIPdzk3xvFJPuDAcmC9jBcIGI');

bot.start(ctx => Contoller.start(ctx)); 


bot.on("callback_query", async ctx => {
    const { data } = ctx.update.callback_query;
    const func = data.split(":");

    if(data == "top_up&&choose_crypto") {
        return Contoller.topUp(ctx);
    } else if(data == "wallet") {
        return Contoller.start(ctx);
    }

    if(func[0] == "top_up&&choose_network") {
        const res = await Contoller.chooseNetwork(ctx, func[1]).catch(err => console.log(err));
    }else if(func[0] == "my_wallet") {
        return Contoller.wallet(ctx);
    } else if( func[0] == "top_up&&genAdrs" ) {
        const cryptoToken = await PaymentCurrenciesModel.findOne({ where: { id: func[1] } })
        const cryptoNetwork = cryptoToken.dataValues.network;
        
        let userWallet = await UserPaymentWallets.findOne({ where: { 
            user_id: ctx.update.callback_query.from.id,
            currency_id: cryptoToken.dataValues.id,
         } }).catch(err => console.log(err))
        
        if(!userWallet) {
            const orderId = crypto.randomBytes(12).toString('hex')
            const newWalletAddress = await generateAdress(ctx, cryptoToken.dataValues, orderId);
            if(!newWalletAddress || !newWalletAddress.data) return
            const qrImage = await generateQrCode(newWalletAddress.data.result.uuid);
            userWallet = await UserPaymentWallets.create({
                user_id: ctx.update.callback_query.from.id,
                wallet_address: newWalletAddress.data.result.address,
                qr_code: qrImage.data.result.image,
                currency_id: cryptoToken.dataValues.id,
                wallet_id: orderId,
                payment_url: newWalletAddress.data.result.url,
                wallet_optional_id: newWalletAddress.data.result.wallet_uuid,
                create_dt: Date.now(),
                update_dt: Date.now()
            }).catch(err => console.log(err))
        }
    `newWalletAddress.data.result.wallet_uuid`
        const base64Image = userWallet.dataValues.qr_code.split(",")[1]; // Replace with your actual base64 image
        
        // Convert base64 image to buffer
        const imageBuffer = Buffer.from(base64Image, 'base64');
        
        const message = `Используйте адрес ниже или QR-код для пополнения баланса.

Монета: ${cryptoToken.dataValues.name} 
Сеть: ${cryptoNetwork} ‼️

<code><i>${userWallet.wallet_address}</i></code>

${userWallet.payment_url}
    
Мин. сумма пополнения: ${JSON.parse(cryptoToken.dataValues.limit).min_amount} ${cryptoToken.dataValues.slug}

⚠️ Отправляйте только ${cryptoToken.dataValues.name} через сеть ${cryptoNetwork}, иначе монеты будут утеряны. Вы должны отправить не менее ${JSON.parse(cryptoToken.dataValues.limit).min_amount} ${cryptoToken.dataValues.slug} или больше для внесения депозита.`
    // Send the image
    await ctx.replyWithPhoto({ source: imageBuffer }, { caption: message, parse_mode: 'HTML', reply_markup: { 
        inline_keyboard: [
            [
                {
                    text: "‹ Назад", callback_data: `top_up&&choose_crypto`
                }
            ]
        ]
     } });
    ctx.deleteMessage();

    }
    else {
        console.log("Nothing");
    }
})
bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))