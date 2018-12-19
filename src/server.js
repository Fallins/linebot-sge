const app = require('express')()
const linebot = require('linebot')
const { analyzedIncomingMsg, replyText } = require('./utils')

// 用於辨識Line Channel的資訊
const bot = linebot({
  channelId: process.env.channelId,
  channelSecret: process.env.channelSecret,
  channelAccessToken: process.env.channelAccessToken
})

// parser incoming request
const linebotParser = bot.parser()

// routes
app.post('/linewebhook', linebotParser)

// 當有人傳送訊息給Bot時
bot.on('message', event => analyzedIncomingMsg(event))

// Greeting
bot.on('join', event => {
  replyText(
    event,
    '你好，我是禮物機器人\n請輸入 "禮物機器人" 或是 "幫助" 取得更多資訊'
  )
})

bot.on('leave', event => {
  // console.log(`禮物機器人 離開了...`)
})

// Bot所監聽的webhook路徑與port
app.listen(process.env.PORT || 8088, function() {
  console.log('[BOT已準備就緒]')
})
