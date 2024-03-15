import { Telegraf } from "telegraf";
import express from "express";
import crypto from "crypto";

import { UserPaymentWallet, UserModel, PaymentTransactions } from "../models/index.js";
import { updateServices } from "../mains/index.js";
import constants from "../config/default.js";

import "../bot.js";
import "../models/db.js";

const bot = new Telegraf(constants.bot.token);
const port = constants.server.port || 8080;

const app = express();

app.use(express.json({
    verify: (req, res, buf) => {
    req.rawBody = buf.toString()
    }
}));

//Проверим, работает ли сервер
app.get('/health', async(req, res) => {
    return res.sendStatus(200);
})

// Проверим наполнение счета
app.post('/payment_callback', async(req, res) => {
    const { 
        body: { 
            sign, 
            status: paymentStatus, 
            order_id: orderId,
            payment_amount_usd: paymentAmountUSD
        },
        headers: { 
            "x-forwarded-for": cryptomusIpAdress
        }
    } = req;

    // Проверим ip адрес криптомуса
    if(cryptomusIpAdress != constants.cryptomus.ip_address) {
        return res.status(400).send("Invalild ip address")
    };

    // Проверим есть ли sign
    if(!sign) {
        console.log(1);
        return res.status(400).send("Invalid payload")
    };

    // Проверим статусы
    if(!constants.cryptomus.valid_statuses.split(',').includes(paymentStatus)) {
        console.log(2);
        return res.status(400).send("Invalid payment status")
    };

    const data = JSON.parse(req.rawBody);
    delete data.sign;

    const jsonData = JSON.stringify(data).replace(/\//mg, "\\/");
    const hash = crypto
            .createHash("md5")
            .update(Buffer.from(jsonData).toString('base64') + constants.cryptomus.payment_api_key)
            .digest('hex');

    // Проверим sign
    if(hash !== sign) {
        console.log(3);
        return res.status(400).send("Invalid sign");
    }

    // Ищем пользователя и добавим новую транзакцию
    const userPayWallet = await UserPaymentWallet.findWalletById(orderId);
    if(!userPayWallet) return;

    const { 
        user_id: userId,
        wallet_id: walletId,
    } = userPayWallet;

    const newTrans = await PaymentTransactions.createTransaction(userId, walletId, req.body);

    // Ищем пользователя в базе данных и увеличиваем баланс пользователя
    await UserModel.addUSDToWallet(userId,paymentAmountUSD).catch(err => console.log(err))
    
    if(paymentStatus == "paid") {
        bot.telegram.sendMessage(userId, `💵 Вы внесли на счёт ${paymentAmountUSD} USD`)
    }

    res.sendStatus(200);
})

// Обновить токены с сервера
app.post('/updateToken', async(req, res) => {
    const { secret } = req.body;
    const sercretWord = constants.server.updateTokensSecret;

    // Проверим правильность входящего секретного слова
    if(secret !== sercretWord) return;

    // Обновим crypto services в базе данных
    await updateServices();

    return res.sendStatus(200)
})

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${constants.server.webhook} PORT:${port}`);
});