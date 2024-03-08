import PaymentCurrenciesModel from "./payment-currencies.js";
import UserPaymentWallets from "./user-payment-wallet.js";
import UserModel from "./user-model.js";
import PaymentTransactions from "./payment-transactions.js"; 

UserPaymentWallets.belongsTo(PaymentCurrenciesModel, {
    foreignKey: "id",
    targetKey: "id"
});

export {
    PaymentCurrenciesModel,
    UserPaymentWallets,
    UserModel,
    PaymentTransactions
}