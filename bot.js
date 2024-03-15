import { Telegraf } from "telegraf";
import Contoller from "./controller/index.js";
import constants from './config/default.js';

const bot = new Telegraf(constants.bot.token);

bot.start(ctx => Contoller.start(ctx)); 

bot.on("callback_query", async ctx => {
    const { data } = ctx.update.callback_query;
    const [ routeCall, id ] = data.split(":");
    
    if(data == "top_up&&choose_crypto") 
        return Contoller.topUp.chooseToken(ctx);

    if(routeCall == "wallet") 
        return Contoller.wallet(ctx);
    else if(routeCall == "top_up&&choose_network") 
        return Contoller.topUp.chooseNetwork(ctx, id);
    else if( routeCall == "top_up&&genAdrs" )
        return Contoller.topUp.generateAdress(ctx, id)
})

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));