import Sequelize from 'sequelize'

import sequelize from "./db.js"

const PaymentTransactions = sequelize.define("payment_transactions", {
    id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: Sequelize.BIGINT(15),
        allowNull: false
    },
    wallet_id: {
        type: Sequelize.STRING(100),
        primaryKey: true,
    },
    wallet_external_id: {
        type: Sequelize.STRING(100),
        primaryKey: true,
    },
    transaction_external_id: {
        type: Sequelize.STRING(100),
        primaryKey: true
    },
    txid: {
        type: Sequelize.STRING(200),
        allowNull: true
    },
    currency_id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true
    },
    payment_amount: {
        type: Sequelize.STRING(30)
    },
    payment_amount_usd: {
        type: Sequelize.STRING(30)
    },
    merchant_amount: {
        type: Sequelize.STRING(30)
    },
    amount: {
        type: Sequelize.STRING(30)
    },
    currency: {
        type: Sequelize.STRING(30)
    },
    network: {
        type: Sequelize.STRING(30)
    },
    create_dt: {
        type: Sequelize.DATE,
    },
    update_dt: {
        type:  Sequelize.DATE,
    },
    
}, { timestamps: false, freezeTableName: true });

PaymentTransactions.getTokens = async function() {
    return this.findAll();
}

PaymentTransactions.createTransaction = async function(userId, currencyId, data) {
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

export default PaymentTransactions;