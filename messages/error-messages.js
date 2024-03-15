function errorServiceNotFound(networkName) {
    const message = `⚠️ Операции в сети <code>${networkName}</code> временно приостановлены. Пожалуйста, выберите другую сеть или криптовалюту!`
    const buttons = [{ text: "‹ Назад", callback_data: "top_up&&choose_crypto" }]
    const extra = {
        reply_markup: {
            inline_keyboard: [ buttons ]
        },
        parse_mode: 'HTML'
    };


    return { message, extra };
}

export {
    errorServiceNotFound,
};