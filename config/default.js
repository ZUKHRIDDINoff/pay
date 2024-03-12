// загружаем переменные окружения
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

];
REQUIRED_VARIABLES.forEach((name) => {
    if (!process.env[name]) {
        throw new Error(`Environment variable ${name} is missing`);
    }
});

import actions from "./actions.js";

// шарим конфиг
const constants = {
    actions,
    cryptomus: {
        merchant_id: process.env.MERCHANT_ID,
        payment_api_key: process.env.PAYMENT_API_KEY,
        valid_statuses: process.env.VALID_STATUSES,
        ip_address: process.env.CRYPTOMUS_IP_ADDRESS
    },
    bot: {
        username: process.env.BOT_USERNAME,
        token: process.env.BOT_TOKEN,
    },
    server: {
        port: Number(process.env.PORT),
        ip: process.env.IP,
        webhook: process.env.WEBHOOK_URL || "localhost",
    },
    database: {
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST || "localhost",
    },
};

export default constants;