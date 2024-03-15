import dotenv from 'dotenv' 
dotenv.config();

// необходимые переменные окружения
const REQUIRED_VARIABLES = [
    "MERCHANT_ID",
    "PAYMENT_API_KEY",
    "VALID_STATUSES",
    "CRYPTOMUS_IP_ADDRESS",
    
    "BOT_TOKEN",
    "BOT_USERNAME",
    "BOT_ID",
    "PORT",
    
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD",

    "WEBHOOK_URL",
    "UPDATE_TOKENS_SECRET_WORD"

];

REQUIRED_VARIABLES.forEach((name) => {
    if (!process.env[name]) {
        throw new Error(`Environment variable ${name} is missing`);
    }
});

const CRYPTOMUS_SERVICES = "https://api.cryptomus.com/v1/payment/services";
const CRYPTOMUS_WALLET = "https://api.cryptomus.com/v1/wallet";
const CRYPTOMUS_QR_CODE = "https://api.cryptomus.com/v1/wallet/qr"

// шарим конфиг
const constants = {
    cryptomus: {
        merchant_id: process.env.MERCHANT_ID,
        payment_api_key: process.env.PAYMENT_API_KEY,
        valid_statuses: process.env.VALID_STATUSES,
        ip_address: process.env.CRYPTOMUS_IP_ADDRESS,
        services: CRYPTOMUS_SERVICES,
        wallet: CRYPTOMUS_WALLET,
        qr: CRYPTOMUS_QR_CODE,
    },
    bot: {
        username: process.env.BOT_USERNAME,
        token: process.env.BOT_TOKEN,
    },
    server: {
        port: Number(process.env.PORT),
        ip: process.env.IP || null,
        webhook: process.env.WEBHOOK_URL || "localhost",
        updateTokensSecret: process.env.UPDATE_TOKENS_SECRET_WORD,
    },
    database: {
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST || "localhost",
    },
};

export default constants;