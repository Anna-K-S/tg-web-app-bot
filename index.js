const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');


const token = '6299020451:AAE-bxiICI7dw19ic1fZqQQH4DBOp4Xu4Xc';
const webAppUrl = 'https://incredible-crepe-fc2ba8.netlify.app';


const bot = new TelegramBot(token, {polling: true});
const app = express();


app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;


  

    if(text === '/start') {
        await bot.sendMessage(chatId, 'Ниже появится кнопка для заполнения формы', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму', web_app:{url: webAppUrl + '/form'}}]
                ]
            }
        })
      }
        await bot.sendMessage(chatId, 'Добро пожаловать в магазин', {
          reply_markup: {
              inline_keyboard: [
                  [{text: 'Сделать заказ', web_app:{url: webAppUrl}}]
              ]
          }
          
      })
  
   if(msg?.web_app_data?.data){

    try {
      const data = JSON.parse(msg?.web_app_data?.data)

      await bot.sendMessage(chatId,`Ваша страна: ${data?.country}`);
      await bot.sendMessage(chatId, `Ваша улица: ${data?.street}`);
      await bot.sendMessage(chatId,'Спасибо за обратную связь!');

      setTimeout(async() => {
        await bot.sendMessage(chatId,'Вся информация в чате ниже')}, 3000)

    } catch (e) {
      console.log(e);
    }
      

   }   
});

app.post('/web-data',async (req, res) => {
const{queryId, products, totalPrice} = req.body;
try {
  await bot.answerWebAppQuery(queryId, {
    type: 'article',
    id: queryId,
    title: 'Успешная покупка',
    input_message_content: {message_text:'Товар на сумму' + totalPrice}
  });
   return res.status(200).json({});
} catch (e) {
  await bot.answerWebAppQuery(queryId, {
    type: 'article',
    id: queryId,
    title: 'Не удалось совершить покупку',
    input_message_content: {message_text:'Не удалось совершить покупку'}
  });
 return res.status(500).json({});
 }
})

const PORT = 3000;

app.listen(PORT, () => {
  console.log('server started on PORT' + PORT)
});