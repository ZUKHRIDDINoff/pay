import { Telegraf } from "telegraf";
import express from "express";
import crypto from "crypto";

import { UserPaymentWallet, UserModel, PaymentTransactions } from "../models/index.js";
import constants from "../config/default.js";

import  "dotenv/config";
import "../bot.js";
import "../models/db.js";

const bot = new Telegraf(constants.bot.token);
const port = constants.server.port || 8080;

const app = express();

// Enable body parser middleware
app.use(express.json({
    verify: (req, res, buf) => {
    req.rawBody = buf.toString()
    }
}));

app.get('/health', async(req, res) => {
    return res.sendStatus(200);
})

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
    console.log(11, paymentStatus);
    console.log(5, req.body);
    console.log(6, req.rawBody);
    // Проверим ip адрес криптомуса
    if(cryptomusIpAdress != constants.cryptomus.ip_address) {
        return res.status(400).send("Invalild ip address")
    };

    // Проверим есть ли sign
    if(!sign) {
        return res.status(400).send("Invalid payload")
    };

    // Проверим статусы
    if(!constants.cryptomus.valid_statuses.split(',').includes(paymentStatus)) {
        return res.status(400).send("Invalid payment status")
    };

    const data = JSON.parse(req.rawBody);
    console.log(9,data);

    delete data.sign;
    const jsonData = JSON.stringify(data).replace(/\//mg, "\\/");
    console.log(1212, jsonData);
    const hash = crypto
            .createHash("md5")
            .update(Buffer.from(jsonData).toString('base64') + constants.cryptomus.payment_api_key)
            .digest('hex');

    // Проверим sign
    if(hash !== sign) {
        console.log('here 3');
        return res.status(400).send("Invalid sign");
    }

    // Ищем пользователя и добавим новую транзакцию
    const userPayWallet = await UserPaymentWallet.findWallet(orderId);
    if(!userPayWallet) return;

    const { 
        user_id: userId,
        wallet_id: walletId,
    } = userPayWallet;

    const newTrans = await PaymentTransactions.createTransaction(userId, walletId, req.body);

    // Ищем пользователя в базе данных и увеличиваем баланс пользователя
    const user = await UserModel.findUser(userId);
    user.balance_usd += parseFloat(paymentAmountUSD);
    user.save();

    if(paymentStatus == "paid") {
        bot.telegram.sendMessage(userId, `💵 Вы внесли на счёт ${paymentAmountUSD} USD`)
    }

    res.sendStatus(200);
})

app.get('/', async(req, res) => {
    res.send('xaxa');
})

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${constants.server.webhook} PORT:${port}`);
});