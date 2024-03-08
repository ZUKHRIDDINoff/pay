import { PaymentCurrenciesModel } from "../models/index.js";
async function topUp(ctx) {
    const coinList = []
    const listCoins = await PaymentCurrenciesModel.findAll();
    listCoins.map(el => {
        if(!coinList.includes(el.dataValues.name)) {
            coinList.push(el.dataValues.slug);
        } else {

        }
    });

    let num = 0;
    let array1 = [];
    let array2 = [];
    // console.log(listCoins);
    coinList.reverse().map(async(el, index) => {
        if(num < 3){
            array1.push({
                text: `${el}`,
                callback_data: `top_up&&choose_network:${el}`
            })

            num += 1;
        }
        if(num == 3 || index == coinList.length-1) {
            array2.push(array1);
            num = 0;
            array1 = [];
        } 
    });

    array2.push([{ text: "‹ Назад", callback_data: "my_wallet" }])

    ctx.reply('Выберите криптовалюту для пополнения баланса!', {
        reply_markup: {
            inline_keyboard: array2
        }
    })
    ctx.deleteMessage();
}

async function chooseNetwork(ctx, coinName) {
    const listNetwroks = await PaymentCurrenciesModel.findAll({ where: { slug: coinName } });
    const filteredNet = [];
    listNetwroks.map(el => {
        const netName = el.dataValues.network
        filteredNet.push([{
            text: netName, 
            callback_data: `top_up&&genAdrs:${el.dataValues.id}`
        }])
    });

    filteredNet.push([{ text: "‹ Назад", callback_data: "top_up&&choose_crypto" }])
    return ctx.editMessageText('Выберите сеть для пополнения баланса!', {
        reply_markup: {
            inline_keyboard: filteredNet
        }
    })
}


export { 
    topUp,
    chooseNetwork
 };