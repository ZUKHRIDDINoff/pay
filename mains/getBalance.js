import crypto from 'crypto';
import axios from 'axios';
import constants from '../config/default.js';

async function getUserBalance(){
    const data = {}

    const sign = crypto
        .createHash("md5")
        .update(Buffer.from(JSON.stringify(data)).toString('base64') + constants.cryptomus.payment_api_key).digest('hex');

    const response = await axios.post('https://api.cryptomus.com/v1/balance',
    data,
    {
        headers: {
            merchant: constants.cryptomus.merchant_id,
            sign
        }
    }
    
    ).catch(err => console.log(err.response.data))
};
// getUserBalance()

export default getUserBalance;