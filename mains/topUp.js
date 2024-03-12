import crypto from "crypto";
import axios from 'axios';
import Controller from "../controller/index.js";
import constants from "../config/default.js";

async function generateAdress(ctx, token, orderId){
    const data = {
        currency: token.slug,
        network: token.network,
        order_id: orderId,
        url_callback: `${constants.server.webhook}/payment_callback`
    }



    const sign = crypto
        .createHash("md5")
        .update(Buffer.from(JSON.stringify(data)).toString('base64') + constants.cryptomus.payment_api_key)
        .digest('hex');

    console.log("top_up sign: " + sign);
    
    const response = await axios.post('https://api.cryptomus.com/v1/wallet',
    data,
    {
        headers: {
            merchant: constants.cryptomus.merchant_id,
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
        .update(Buffer.from(JSON.stringify(data)).toString('base64') + constants.cryptomus.payment_api_key)
        .digest('hex');

    const response = await axios.post('https://api.cryptomus.com/v1/wallet/qr',
    data,
    {
        headers: {
            merchant: constants.cryptomus.merchant_id,
            sign
        }
    }
    
    ).catch(err => console.log(err.response.data))
    return response
};

export { generateAdress,
         generateQrCode 
        };