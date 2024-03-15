function wallet(user) {
    let message = `💵 Ваш баланс:\n\n▫️${user.balance_usd} USD`;

    const buttons = [
        [{
            text: "📥 Пополнить", callback_data: "top_up&&choose_crypto"
        }]
    ]

    const extra = {
        reply_markup: {
            inline_keyboard: buttons
        }
    }

    return { message, extra };
}

function topUp(ctx, buttons) {
    const message = "Выберите криптовалюту для пополнения баланса!";
    const extra = {
        reply_markup: { inline_keyboard: buttons }
    };

    return { message, extra };
};

function chooseNetwork(networkList) {
    const message = "Выберите сеть для пополнения баланса!";

    const buttons = []

    networkList.map(el => {
        buttons.push([{
            text: el.network, 
            callback_data: `top_up&&genAdrs:${el.id}`
        }])
    })

    buttons.push([{ text: "‹ Назад", callback_data: "top_up&&choose_crypto" }]);

    const extra = {
        reply_markup: {
            inline_keyboard: buttons
        }
    };

    return { message, extra };
};

function generateAddress(cryptoToken, cryptoNetwork, userWallet) {
    const message = `Используйте адрес ниже или QR-код для пополнения баланса.\n
Монета: ${cryptoToken.name} 
Сеть: ${cryptoNetwork} ‼️

<code><i>${userWallet.wallet_address}</i></code>

${userWallet.payment_url}

Мин. сумма пополнения: ${JSON.parse(cryptoToken.limit).min_amount} ${cryptoToken.slug}

⚠️ Отправляйте только ${cryptoToken.name} через сеть ${cryptoNetwork}, иначе монеты будут утеряны. Вы должны отправить не менее ${JSON.parse(cryptoToken.limit).min_amount} ${cryptoToken.slug} или больше для внесения депозита.`

    const buttons = [{ text: "‹ Назад", callback_data: `top_up&&choose_crypto` }];

    const extra = {
        reply_markup: { 
            inline_keyboard: [ buttons ]
        },
        caption: message,
        parse_mode: 'HTML'
    };

    return extra;
};

export {
    wallet,
    topUp,
    chooseNetwork,
    generateAddress,
};