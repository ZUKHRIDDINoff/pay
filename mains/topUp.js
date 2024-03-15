import crypto from "crypto";
import axios from 'axios';
import Controller from "../controller/index.js";
import constants from "../config/default.js";

async function generateAdress(ctx, cryptoToken, orderId){
    const data = {
        currency: cryptoToken.slug,
        network: cryptoToken.network,
        order_id: orderId,
        url_callback: `${constants.server.webhook}/payment_callback`
    }

    const sign = crypto
        .createHash("md5")
        .update(Buffer.from(JSON.stringify(data)).toString('base64') + constants.cryptomus.payment_api_key)
        .digest('hex');
    
    const response = await axios.post(constants.cryptomus.wallet,
    data,
    {
        headers: {
            merchant: constants.cryptomus.merchant_id,
            sign
        }
    }
    
    ).catch(() => {
        return Controller.errorServiceNotFound(ctx, cryptoToken.network);
    })
    return response
};



async function generateQrCode(uuid){
    try {
        const data = {
            wallet_address_uuid: uuid
        }
    
        const sign = crypto
            .createHash("md5")
            .update(Buffer.from(JSON.stringify(data)).toString('base64') + constants.cryptomus.payment_api_key)
            .digest('hex');
    
        const response = await axios.post(constants.cryptomus.qr,
        data,
        {
            headers: {
                merchant: constants.cryptomus.merchant_id,
                sign
            }
        }
        
        )
        return response
    } catch (error) {
        console.log(error);
    }
};

export { 
    generateAdress,
    generateQrCode 
};