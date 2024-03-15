import PaymentCurrenciesModel from "./payment-currencies.js";
import UserPaymentWallet from "./user-payment-wallet.js";
import PaymentTransactions from "./payment-transactions.js"; 
import UserModel from "./user-model.js";

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