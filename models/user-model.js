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
}, { timestamps: false, freezeTableName: true });

UserModel.updateProperties = async function(properties = {}) {
    return await this.update(properties);
};

UserModel.findUser = async function(userId) {
    return this.findOne({ where: {
        user_id: userId
    } })
};

UserModel.findOrCreateUser = async function(user) {
    const { id: userId, first_name: firstName, last_name: lastName = null, username: userName = null} = user;

    return this.findOrCreate({
        where: {
            user_id: userId
        },
        defaults: {
            first_name: firstName,
            last_name: lastName,
            username: userName,
            create_dt: Date.now()
        }
        
    })
}

UserModel.addUSDToWallet = async function(userId, paymentAmountUSD) {
    const sqlQuery = `
    UPDATE user_model 
    SET balance_usd = balance_usd + ${paymentAmountUSD}
    WHERE user_id = ${userId};`
    const a = await sequelize.query(sqlQuery, { type: sequelize.QueryTypes.UPDATE });
    console.log(a);
}

export default UserModel;