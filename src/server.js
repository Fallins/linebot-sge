const app = require('express')()
const linebot = require('linebot')

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
// bot.on('join', event => {
//   replyText(event, ['你好，我是幹圖王', `目前狀態: 功能開啟`, INTRO])
// })

// bot.on('leave', event => {
//   const sourceID = getSourceID(event.source)
//   setSilenceByID(sourceID, null)

//   console.log(`全能幹圖王 離開 ${sourceID} 了...`)
// })

// Bot所監聽的webhook路徑與port
app.listen(process.env.PORT || 80, async function() {
  await api.loadTokens()
  await updateImages()
  console.log('[BOT已準備就緒]')
})
