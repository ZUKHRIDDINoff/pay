import crypto from "crypto";
import * as Mains from "../mains/index.js";
import * as Messages from "../messages/index.js";
import InlineButtonSorter from "../helper/inlinebutton_sorter.js"
import { sendMessage } from "../helper/telegram-api.js";
import { PaymentCurrenciesModel, UserPaymentWallet } from "../models/index.js";

async function chooseToken(ctx) {
    const { id: userId } = ctx.update.callback_query.from;

    const coinList = await PaymentCurrenciesModel.getTokens();

    const buttons = await InlineButtonSorter(coinList);
    buttons.push([{ text: "‹ Назад", callback_data: "wallet" }])

    const { message, extra } = Messages.wallet.topUp(ctx, buttons)

    await sendMessage(userId, message, extra);
    ctx.deleteMessage();
}

async function chooseNetwork(ctx, coinName) {
    const networkList = await PaymentCurrenciesModel.getAllNetworks(coinName);
    const { message, extra } = await Messages.wallet.chooseNetwork(networkList);

    return ctx.editMessageText(message, extra);
};

async function generateAdress(ctx, id) {
    const cryptoToken = await PaymentCurrenciesModel.findTokenById(id);
    const cryptoNetwork = cryptoToken.network;

    let userWallet = await UserPaymentWallet.findWalletByProperties({
        user_id: ctx.update.callback_query.from.id,
        currency_id: cryptoToken.dataValues.id
    })

    if(!userWallet) {
        const orderId = crypto.randomBytes(12).toString('hex')
        const newWalletAddress = await Mains.generateAdress(ctx, cryptoToken, orderId);

        if(!newWalletAddress || !newWalletAddress.data) return;

        const { uuid: walletUUID } = newWalletAddress.data.result;

        const qrImage = await Mains.generateQrCode(walletUUID);

        const wallet = {
            user_id: ctx.update.callback_query.from.id,
            wallet_address: newWalletAddress.data.result.address,
            qr_code: qrImage.data.result.image,
            currency_id: cryptoToken.id,
            wallet_id: orderId,
            payment_url: newWalletAddress.data.result.url,
            wallet_optional_id: newWalletAddress.data.result.wallet_uuid,
            create_dt: Date.now(),
            update_dt: Date.now()
        };

        userWallet = await UserPaymentWallet.createWallet(wallet);
    }
    const base64Image = userWallet.qr_code.split(",")[1];
    
    // Convert base64 image to buffer
    const imageBuffer = Buffer.from(base64Image, 'base64');
    
    const extra = await Messages.wallet.generateAddress(cryptoToken, cryptoNetwork, userWallet);
    
    // Send the image
    await ctx.replyWithPhoto({ source: imageBuffer }, extra);
    ctx.deleteMessage();
};


export { 
    chooseToken,
    chooseNetwork,
    generateAdress
 };