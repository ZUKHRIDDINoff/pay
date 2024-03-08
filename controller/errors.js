async function errorServiceNotFound(ctx, networkName) {
    ctx.deleteMessage()
    const keyboard = [{ text: "‹ Назад", callback_data: "top_up&&choose_crypto" }]
    return ctx.reply(`⚠️ Операции в сети ${networkName} временно приостановлены. Пожалуйста, выберите другую сеть или криптовалюту!`, { reply_markup: { inline_keyboard: [keyboard] } });
}

export default errorServiceNotFound;