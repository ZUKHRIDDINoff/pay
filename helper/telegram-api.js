import constants from "../config/default.js";
import axios from "axios"

function sendMessage(chatId, message, extra = {}) {
    const queryProps = createQueryProperties(chatId, extra, { text: message });
    const url = createBaseURL(constants.bot.token, "sendMessage");
    return apiRequestPOST(url, queryProps);
};

function sendPhoto(chatId, fileId, extra = {}) {
    const queryProps = createQueryProperties(chatId, extra, { photo: fileId });
    const url = createBaseURL(constants.bot.token, "sendPhoto");
    return apiRequestPOST(url, queryProps);
};

// ====================================================
// Base Metohds For Telegram API
// ====================================================

function createBaseURL(token, methodName) {
    return `https://api.telegram.org/bot${token}/${methodName}`;
}

function createQueryProperties(chatId, extra, properties = {}) {
    return Object.assign({}, extra, properties, { chat_id: chatId });
}

async function apiRequestPOST(url, data) {
    try {
        const response = await axios.post(url, data);

        const responseData = response.data;

        return (responseData && responseData.result) || responseData;
    } catch (err) {
        return { message_id: 0, error: err };
    }
}

export {
    sendMessage,
    sendPhoto
}