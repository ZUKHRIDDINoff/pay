import Sequelize from 'sequelize'

import sequelize from "./db.js"

const UserPaymentWallet = sequelize.define("user_payment_wallet", {
    id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: Sequelize.BIGINT(10),
        allowNull: false
    },
    currency_id: {
        type: Sequelize.INTEGER(11)
    },
    wallet_id: {
        type: Sequelize.STRING(100)
    },
    payment_url: {
        type: Sequelize.STRING(50)
    },
    wallet_optional_id: {
        type: Sequelize.STRING(50)
    },
    wallet_address: {
        type: Sequelize.STRING(50)
    },
    qr_code: {
        type: Sequelize.STRING(10000)
    },
    create_dt: {
        type: Sequelize.DATE,
    },
    update_dt: {
        type:  Sequelize.DATE,
    }
}, { timestamps: false, freezeTableName: true });

UserPaymentWallet.updateProperties = async function(properties = {}) {
    return await this.update(properties);
};

UserPaymentWallet.getUserWallets = async function(userId) {
    return this.findAll({ where: { user_id: userId } })
}


UserPaymentWallet.getAllWallets = async function() {
    return this.findAll();
}

UserPaymentWallet.findWalletById = async function(walletId) {
    return this.findOne({ where: {
        wallet_id: walletId
    } })
};

UserPaymentWallet.findWalletByProperties = async function(properties = {}) {
    return this.findOne({ where: properties })
};

UserPaymentWallet.createWallet = async function(wallet) {
    return this.create(wallet);
}

export default UserPaymentWallet;