import Sequelize from 'sequelize'

import sequelize from "./db.js"

const UserPaymentWallets = sequelize.define("user_payment_wallet", {
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
        type: Sequelize.STRING(2000)
    },
    create_dt: {
        type: Sequelize.DATE,
    },
    update_dt: {
        type:  Sequelize.DATE,
    }
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
UserPaymentWallets.updateProperties = async function(properties = {}) {
    return await this.update(properties);
};

UserPaymentWallets.getUserWallets = async function(userId) {
    return this.findAll({ where: { user_id: userId } })
}


UserPaymentWallets.getAllWallets = async function() {
    return this.findAll();
}

export default UserPaymentWallets;