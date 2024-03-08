import crypto from 'crypto';
import axios from 'axios';
import 'dotenv/config';

async function getUserBalance(){
    const data = {}

    const sign = crypto
        .createHash("md5")
        .update(Buffer.from(JSON.stringify(data)).toString('base64') + process.env.API_KEY).digest('hex');

    const response = await axios.post('https://api.cryptomus.com/v1/balance',
    data,
    {
        headers: {
            merchant: process.env.MERCHANT_ID,
            sign
        }
    }
    
    ).catch(err => console.log(err.response.data))
};
// getUserBalance()

export default getUserBalance;