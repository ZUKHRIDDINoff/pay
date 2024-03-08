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
    
}, { timestamps: false });

// AdvertisementModel.getActiveList = function() {
//     return this.findAll({ 
//         where: {
//             [Op.or]: [
//                 { status: 10, startDT: { [Sequelize.Op.lte]: new Date() } },
//                 { isDefault: 1 },
//             ],
//         },
//         raw: true,
//     });
// };

PaymentTransactions.getTokens = async function() {
    return this.findAll();
}

export default PaymentTransactions;