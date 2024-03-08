import { PaymentTransactions } from "../models/index.js";


export default async (userId, currencyId, data) => {
    return PaymentTransactions.create({
        user_id: userId,
        wallet_id: data.order_id,
        wallet_external_id: data.wallet_address_uuid,
        transaction_external_id: data.uuid,
        txid: data.txid,
        currency_id: currencyId,
        payment_amount: data.payment_amount,
        payment_amount_usd: data.payment_amount_usd,
        merchant_amount: data.merchant_amount,
        network: data.network,
        currency: data.currency,
        create_dt: Date.now(),
        update_dt: Date.now()
    }).catch(err => console.log(err))
}
