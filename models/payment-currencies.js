import Sequelize from 'sequelize'

import sequelize from "./db.js"

const PaymentCurrenciesModel = sequelize.define("payment_currencies", {
    id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING(10),
        allowNull: false,
    },
    slug: {
        type: Sequelize.STRING(10),
        allowNull: false
    },
    orderM: {
        type: Sequelize.INTEGER(10)
    },
    create_dt: {
        type: Sequelize.DATE,
    },
    update_dt: {
        type:  Sequelize.DATE,
    },
    network: {
        type: Sequelize.STRING(10),
    },
    limit: {
        type: Sequelize.JSON
    },
    comission: {
        type: Sequelize.JSON
    }
}, { timestamps: false, freezeTableName: true });

PaymentCurrenciesModel.updateProperties = async function(properties = {}) {
    return this.update(properties);
};

PaymentCurrenciesModel.getTokens = async function() {
    return this.findAll({
        attributes: ['slug'],
        group: ['slug'],
    }).then(tokens => tokens.map(token => token.slug));
}

PaymentCurrenciesModel.getAllNetworks = function(tokenName) {
    return this.findAll({
        where: {
            slug: tokenName
        }
    })
}

PaymentCurrenciesModel.findTokenById = function(id) {
    return this.findOne({
        where: {
            id
        }
    })
}

export default PaymentCurrenciesModel;