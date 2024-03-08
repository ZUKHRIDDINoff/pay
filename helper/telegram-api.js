exports.sendMessage = (chatId, message, extra = {}) => {
    const queryProps = createQueryProperties(chatId, extra, { text: message });
    const url = createBaseURL(token, "sendMessage");
    return apiRequestPOST(url, queryProps);
};

exports.sendPhoto = (token, chatId, fileId, extra = {}) => {
    const queryProps = createQueryProperties(chatId, extra, { photo: fileId });
    const url = createBaseURL(token, "sendPhoto");
    return apiRequestPOST(url, queryProps);
};

exports.sendVideo = (token, chatId, fileId, extra = {}) => {
    const queryProps = createQueryProperties(chatId, extra, { video: fileId });
    const url = createBaseURL(token, "sendVideo");
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

async function apiBaseRequestPOST(url, data) {
    const response = await axios.post(url, data);

    return response.data;
}