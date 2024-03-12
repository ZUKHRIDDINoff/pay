const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");

module.exports = {
    compileMessage,
    createMessage,
    createKeyboardMessage,
    createExtra,
    createFlug,
    createSwitchButton,
    createSwitchPropertyButton,
    simplePaginator,
};

function compileMessage(msg = "") {
    return msg.split("\n").map((item) => item.trim()).join("\n");
}

function createMessage(messageText, buttons = [], type = "HTML") {
    const message = compileMessage(messageText);
    const keyboard = Markup.inlineKeyboard(buttons);
    const extra = createExtra(keyboard, type);
    return {
        message,
        keyboard,
        extra,
    };
}

function createKeyboardMessage(messageText, keyboard, type = "HTML") {
    const message = compileMessage(messageText);
    const extra = createExtra(keyboard, type);
    return {
        message,
        keyboard,
        extra,
    };
}

function createExtra(keyboard, type = "HTML", webPreview = false) {
    const extra = Extra
        .webPreview(webPreview)
        .markup(keyboard);
    if (type === "HTML")
        extra.HTML();
    else
        extra.markdown();

    return extra;
}

function createFlug(value, activeValue = "ON", unactiveFlug = "⚪", inversion = false) {
    if (inversion) return value != activeValue ? "🔘" : unactiveFlug;
    return value == activeValue ? "🔘" : unactiveFlug;
}

function createButtonName(value, buttonName, buttonNameOFF = null, activeValue = "ON", inversion = false) {
    if (!buttonNameOFF) return buttonName;
    if (inversion) return value != activeValue ? buttonName : buttonNameOFF;
    return value == activeValue ? buttonName : buttonNameOFF;
}

function createSwitchPropertyButton(action, id, data, propertyName, buttonName) {
    const flug = createFlug(data[propertyName]);
    const payload = action.callback(id, propertyName);
    return Markup.callbackButton(`${flug} ${buttonName}`, payload);
}

function createSwitchButton(action, id, data, propertyName, buttonName, {
    activeValue = "ON",
    unactiveFlug = "⚪",
    buttonNameOFF = null,
    inversion = false,
} = {}) {
    const flug = createFlug(data[propertyName], activeValue, unactiveFlug, inversion);
    const name = createButtonName(data[propertyName], buttonName, buttonNameOFF, activeValue, inversion);
    const payload = action.callback(id, propertyName);
    return Markup.callbackButton(`${flug} ${name}`, payload);
}

function simplePaginator(action, { page, pages }, properties = []) {
    // рассчитываем следующую и предыдущую страницу
    let next = page + 1;
    let previous = page - 1;
    if (next > pages) next = 1;
    if (previous <= 0) previous = pages;

    const nextButton = Markup.callbackButton("»", action.callback(next, ...properties));
    const backButton = Markup.callbackButton("«", action.callback(previous, ...properties));
    return {
        buttons: [backButton, nextButton],
        nextButton,
        backButton,
    };
}