import express from "express";
import crypto from "crypto"
import "./models/db.js"
const app = express();
const port = 8080;
import  "dotenv/config";
import "./bot/startBot.js"
import { createTransaction } from "./mains/index.js";
import { UserPaymentWallets, UserModel } from "./models/index.js";
import { Telegraf } from "telegraf";
const bot = new Telegraf('6469165118:AAG1qTb8KcQIPdzk3xvFJPuDAcmC9jBcIGI')
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
  const { body: { sign }, headers: { "x-forwarded-for": cryptomusIpAdress }} = req;


  if(!process.env.VALID_STATUSES.split(',').includes(req.body.status)) {
    return res.status(400).send("Invalid payment status")
  }

  if(!sign) {
    console.log('here 1');
    return res.status(400).send("Invalid payload")
  };

  // const data = JSON.parse(req.rawBody);
  const data = JSON.parse(req.rawBody);
  delete data.sign;
  console.log(22, data);
  // req.rawBody = "";

  const hash = await crypto
        .createHash("md5")
        .update(Buffer.from(JSON.stringify(data)).toString('base64') +'8EXwDozMnmb1bmxug8u5IyFucYPgrZgE54g8zY5u1Fy5tpOdlhqRJS2Iku3dWdJ6b7a35JxX3mEqhtG1Aan9O2xsIC7D8EHoFVTe2PGDX4WhvqQxjaT0rfBtn8LLVgq7')
        .digest('hex');

  
  console.log(2, hash);
  if(hash !== sign) {
    console.log('here 3');
    return res.status(400).send("Invalid sign");
  }

  if(cryptomusIpAdress != process.env.cryptomusIpAdress) {
    console.log('here 2');
    return res.status(400).send("Invalild ip address")
  };



  const userPayWallet = await UserPaymentWallets.findOne({ 
    where: {
      wallet_id: req.body.order_id
    }
  }).catch(err => console.log("error 1: ",err))
  
  await createTransaction(userPayWallet.dataValues.user_id, userPayWallet.dataValues.wallet_id, req.body).catch(err => console.log('transStatusERor: ' + err))

  const user = await UserModel.findOne({ where: { user_id: userPayWallet.dataValues.user_id } }).catch(err => console.log("findOne error: "));
  user.balance_usd += parseFloat(req.body.payment_amount_usd);
  user.save();
  console.log(3,user);

  if(req.body.status == "paid") {
    bot.telegram.sendMessage(userPayWallet.dataValues.user_id, `💵 Вы внесли на счёт ${req.body.payment_amount_usd} USD`)
  }
  console.log(4,req.body);
  res.sendStatus(200);
})

app.get('/updateTokens', async(req, res) => {
    res.send('xaxa');
})
// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port https://localhost:${port}`);
});


