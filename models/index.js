import PaymentCurrenciesModel from "./payment-currencies.js";
import UserPaymentWallet from "./user-payment-wallet.js";
import UserModel from "./user-model.js";
import PaymentTransactions from "./payment-transactions.js"; 

UserPaymentWallet.belongsTo(PaymentCurrenciesModel, {
    foreignKey: "id",
    targetKey: "id"
});

export {
    PaymentCurrenciesModel,
    UserPaymentWallet,
    UserModel,
    PaymentTransactions
}