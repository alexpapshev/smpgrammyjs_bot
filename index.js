require('dotenv').config();
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard} = require('grammy');

const bot = new Bot(process.env.BOT_API_KEY);

bot.api.setMyCommands([
    {
        command: '/start', 
        description: 'Start bot'
    },
    {
        command: '/mood',
        description: 'Value your mood'
    },
    {
        command: '/share',
        description: 'Share your dates'
    },
    {
        command: 'inline',
        description: 'Welcome for you.'
    },
]);

bot.use(async (ctx, next) => {
    console.log(ctx.from);
    await next();
});

bot.command('share', async (ctx) => {
    const shareKeyboard = new Keyboard().requestLocation('Geolocation').requestContact('Contact').
    requestPoll('Poll').oneTime().resized();

    await ctx.reply('What do you want to share?', {
        reply_markup: shareKeyboard});
});

bot.command('inline', async (ctx) => {
    const inlineKeyboard = new InlineKeyboard().text('Hello', 'hello world-1').row().
    text('World', 'hello world-2').row().text('Hi', 'hello world-3').row();
    
    await ctx.reply('Inline keyboard', {
        reply_markup: inlineKeyboard
    });
});

bot.callbackQuery(/hello world-[1-3]/, async (ctx) => {
    await ctx.answerCallbackQuery('Hello, ' + 
        ctx.from.first_name + ' ' + 
        ctx.from.last_name + ' ' + 
        ctx.from.id + ' ' + ctx.from.username);
    await ctx.reply(`Your choise:  ${ctx.callbackQuery.data}`);
});

// bot.on('callback_query:data', async (ctx) => {
//     await ctx.answerCallbackQuery();
//     await ctx.reply(`Your choise is:  ${ctx.callbackQuery.data}`);
// });

bot.on(':contact', async (ctx) => {
    await ctx.reply('I get location');
});

bot.on(':voice', async (ctx) => {
    await ctx.reply('Hello, ' + ctx.from.first_name + ' ' + ctx.from.last_name + '\n I get voice message');
});

bot.hears('🙂', async (ctx) => {
    await ctx.reply('I feel 🙂', {reply_markup:{remove_keyboard: true}});
});

bot.on('message', async (ctx) => {
    await ctx.react('👍');
    const moodKeyboard = new Keyboard().text('🙂').row().text('🙁').oneTime().resized();
    await ctx.reply('Hello, ' + ctx.from.first_name, {
        reply_markup: moodKeyboard
    },
)
});

bot.catch((err) => {
    console.log(err);
});

//bot.startPolling();
bot.start();