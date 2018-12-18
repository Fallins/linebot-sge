const groupObj = {}

const analyzedIncomingMsg = event => {
  console.log(`================ EVENT OBJECT ================`)
  console.log(JSON.stringify(event))
  console.log({ event })
  console.log(`============== EVENT OBJECT END ==============`)
  const {
    source: { type, groupId }
  } = event

  console.log({ type, groupId })
  // Only accept group to use
  if (type !== 'group') {
    if (groupObj[groupId]) {
      // add info into groupObj
      return getProfile(event).then(profile => {
        groupObj[groupId].push(profile)
        console.log({ groupObj })
        replyText(event, profile.displayName + ' is in.')
      })
    } else {
      // initailized group info
      groupObj[groupId] = []
      console.log({ groupObj })
      return replyText(event, '可以抽獎了，請要參加的人回應任意文字')
    }
  }

  console.log({ groupObj })
  return replyText(event, 'This bot is only accept group to play')
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
