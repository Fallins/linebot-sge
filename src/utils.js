const analyzedIncomingMsg = event => {
  console.log(`================ EVENT OBJECT ================`)
  console.log(JSON.stringify(event))
  console.log({ event })
  console.log(`============== EVENT OBJECT END ==============`)

  console.log(getProfile(event))
  console.log(getMember(event))

  replyText(event, "I've received your message")
}

const replyText = (event, text) => {
  event.reply(text).catch(e => {
    // 當訊息回傳失敗後的處理
    console.log('Send text message failed')
    console.log(e)
  })
}

const getProfile = event => {
  return event.source.profile().then(profile => profile)
}

const getMember = event => {
  return event.source.member().then(member => member)
}

module.exports = {
  analyzedIncomingMsg,
  replyText
}
