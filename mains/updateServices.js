import crypto from 'crypto';
import axios from 'axios';
import constants from '../config/default.js';

import { PaymentCurrenciesModel } from '../models/index.js';

async function getListServices(){
    const data = {}

    const sign = crypto
        .createHash("md5")
        .update(Buffer.from(JSON.stringify(data)).toString('base64') + constants.cryptomus.payment_api_key).digest('hex');

    const response = await axios.post('https://api.cryptomus.com/v1/payment/services',
    data,
    {
        headers: {
            merchant: constants.cryptomus.merchant_id,
            sign
        }
    }
    
    ).catch(err => console.log(err.response.data))
    return response.data;
};


async function updateServices() {
    const servicesList = await getListServices();
    // console.log(servicesList);
    // console.log(122, servicesList.result);
    servicesList.result.map(async el => {
        const token = await PaymentCurrenciesModel.findOne({ where: { name: el.currency }});

        if(!token) {
            const newService = await PaymentCurrenciesModel.create({
                name: el.currency.toUpperCase(),
                slug: el.currency,
                order: null,
                create_dt: Date.now(),
                update_dt: Date.now(),
                network: el.network,
                limit: JSON.stringify(el.limit),
                comission: JSON.stringify(el.commission)
            
            }).catch(err => console.log(err))
            await newService.save()
        }
    
        return

    })
}

// updateServices()

export default updateServices;
