import Sequelize from 'sequelize'

import sequelize from "./db.js"

const UserModel = sequelize.define("user_model", {
    id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: Sequelize.BIGINT(10),
        allowNull: false
    },
    first_name: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    last_name: {
        type: Sequelize.STRING(50),
    },
    username: {
        type: Sequelize.STRING(20), 
    },
    balance_usd: {
        type: Sequelize.FLOAT(10),
        defaultValue: 0
    },
    status: {
        type: Sequelize.STRING(10),
    },
    last_message: {
        type: Sequelize.INTEGER(10)
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
UserModel.updateProperties = async function(properties = {}) {
    return await this.update(properties);
};

export default UserModel;