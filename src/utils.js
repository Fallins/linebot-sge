const groupObj = {}

const analyzedIncomingMsg = event => {
  console.log(`================ EVENT OBJECT ================`)
  console.log(JSON.stringify(event))
  console.log({ event })
  console.log(`============== EVENT OBJECT END ==============`)
  const {
    source: { type }
  } = event

  // Only accept group to use
  if (type !== 'group') {
    if (groupObj[groupId]) {
      // add info into groupObj
      getProfile(event).then(profile => {
        groupObj[groupId].push(profile)
        console.log(groupObj)
      })
    } else {
      // initailized group info
      groupObj[groupId] = []

      replyText(event, '可以抽獎了，請要參加的人回應任意文字')
    }
  }

  replyText(event, 'This bot is only accept group to play')
  replyText(event, 'test22222')
}

const replyText = (event, text) => {
  event.reply(text).catch(e => {
    // 當訊息回傳失敗後的處理
    console.log('Send text message failed')
    console.log(e)
  })
}

const getProfile = event => {
  return event.source.profile().then(profile => {
    console.log(profile)
    return profile
  })
}

const getMembersId = event => {
  return event.source.member().then(member => {
    console.log(member)
    console.log(member.memberIds)
  })
}

module.exports = {
  analyzedIncomingMsg,
  replyText
}
