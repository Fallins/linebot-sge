const groupObj = {}

const analyzedIncomingMsg = event => {
  console.log(`================ EVENT OBJECT ================`)
  console.log(JSON.stringify(event))
  console.log({ event })
  console.log(`============== EVENT OBJECT END ==============`)
  const {
    source: { type, groupId },
    message: { text }
  } = event

  console.log({ type, groupId })
  // Only accept group to use
  if (type === 'group') {
    switch (text) {
      case '開始抽獎':
        // initailized group info
        groupObj[groupId] = []
        console.log({ groupObj })
        return replyText(event, '可以抽獎了，請要參加的人回覆 "+"、"++"、"+1" ')
      case '+':
      case '++':
      case '+1':
        // add info into groupObj
        return getProfile(event).then(profile => {
          groupObj[groupId].push(profile)
          console.log({ groupObj: JSON.stringify(groupObj) })
          replyText(event, profile.displayName + ' 參加成功')
        })
      case '準備完成':
        return replyText(
          event,
          `目前參加的人數有 ${groupObj[groupId].length} 人\n
           請依照下列順序回覆 "抽" 開始交換禮物
           ${randomArr(groupObj[groupId]).map(
             (player, idx) => `${idx + 1}. ${player.displayName}\n`
           )} 
          `
        )
      default:
        return replyText(event, '指令錯誤')
    }
  }

  console.log({ groupObj })
  return replyText(
    event,
    '只能在群組中使用哦！\n趕快邀請朋友一起來交換禮物吧！！！'
  )
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

const randomArr = arr => {
  //用Math.random()函式生成0~1之間的隨機數與0.5比較，返回-1或1
  const randomSort = () => (Math.random() > 0.5 ? -1 : 1)

  arr.sort(randomSort)
  return arr
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
