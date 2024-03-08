import crypto from "crypto"
import axios from 'axios'
import  "dotenv/config";
import Controller from "../controller/index.js";
console.log(3,process.env.API_KEY);
async function generateAdress(ctx, token, orderId){
    const data = {
        currency: token.slug,
        network: token.network,
        order_id: orderId,
        url_callback: `${process.env.WEBHOOK_URL}/payment_callback`
    }



    const sign = crypto
        .createHash("md5")
        .update(Buffer.from(JSON.stringify(data)).toString('base64') + process.env.API_KEY)
        .digest('hex');

    console.log("top_up sign: " + sign);
    
    const response = await axios.post('https://api.cryptomus.com/v1/wallet',
    data,
    {
        headers: {
            merchant: process.env.MERCHANT_ID,
            sign
        }
    }
    
    ).catch(err => {
        console.log(err);
        return Controller.errorServiceNotFound(ctx, token.network);
    })
    return response
};



async function generateQrCode(uuid){
    const data = {
        wallet_address_uuid: uuid
    }

    

    const sign = crypto
        .createHash("md5")
        .update(Buffer.from(JSON.stringify(data)).toString('base64') + process.env.API_KEY)
        .digest('hex');

    const response = await axios.post('https://api.cryptomus.com/v1/wallet/qr',
    data,
    {
        headers: {
            merchant: process.env.MERCHANT_ID,
            sign
        }
    }
    
    ).catch(err => console.log(err.response.data))
    return response
};

export { generateAdress,
         generateQrCode 
        };