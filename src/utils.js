const groupObj = {}
const switchOrder = {}
const intro =
  `嗨，我是交換禮物機器人\n\n` +
  `開始之前，請先進行前置準備，將所有禮物從 1 開始隨機標上編號\n\n` +
  `完成後，輸入 "交換禮物" => 可以開始交換禮物的程序，也可以用來重置整個過程。\n\n` +
  `交換禮物活動開始後，群組內要參加的人選請分別回覆 "+"、"++"、"+1" 供機器人進行隨機交換\n\n` +
  `確認所有人都參加以後，請由一位代表回覆 "準備完成" ，準備進行交換\n\n` +
  `最後依照機器人提供的順序回覆 "抽"、"換" 進行禮物的交換\n\n`

const analyzedIncomingMsg = event => {
  console.log(`================ EVENT OBJECT ================`)
  console.log(JSON.stringify(event))
  console.log({ event })
  console.log(`============== EVENT OBJECT END ==============`)
  const {
    source: { type, groupId, userId },
    message: { text }
  } = event

  console.log({ type, groupId })

  const initailized = () => {
    groupObj[groupId] = []
    switchOrder[groupId] = []
    console.log({ groupObj, switchOrder })
  }

  const isStart = groupObj[groupId] !== undefined

  // Only accept group to use
  if (type === 'group') {
    switch (text) {
      case '禮物機器人':
      case '幫助':
        return replyText(event, intro)
      case '交換禮物':
        // initailized group info
        initailized()
        return replyText(event, '請參加活動的人回覆: "+"、"++"、"+1" ')
      case '+':
      case '++':
      case '+1':
        if (!isStart)
          return replyText(event, '請先輸入 "交換禮物" 後才能加入活動哦')

        // add info into groupObj
        return getProfile(event).then(profile => {
          if (
            groupObj[groupId].find(player => player.userId === profile.userId)
          )
            return replyText(event, '操你媽的不能重複參加')

          groupObj[groupId].push(profile)
          console.log({ groupObj: JSON.stringify(groupObj), switchOrder })
          replyText(event, profile.displayName + ' 參加成功')
        })
      case '準備完成':
        if (!isStart)
          return replyText(event, '請先輸入 "交換禮物" 後才能開始活動哦')
        if (switchOrder[groupId].length < 1)
          return replyText(event, '至少要有一位玩家，才能進入抽獎程序哦')

        let arr = Array.from(
          { length: groupObj[groupId].length },
          (_, idx) => idx + 1
        )
        switchOrder[groupId] = randomArr(arr)

        return replyText(
          event,
          `目前參加的人數有 ${groupObj[groupId].length} 人\n` +
            `請依照下列順序回覆 "抽"、"換" 開始交換禮物\n` +
            `${randomArr(groupObj[groupId])
              .map((player, idx) => `${idx + 1}. ${player.displayName}\n`)
              .join('')}\n\n` +
            `${groupObj[groupId][0].displayName} 請準備`
        )
      case '抽':
      case '換':
        if (!isStart)
          return replyText(event, '請先輸入 "交換禮物" 後才能開始活動哦')
        if (switchOrder[groupId].length < 1)
          return replyText(event, '請輸入 準備完成 後，才能進入抽獎程序')

        const giftIndex = groupObj[groupId].findIndex(
          player => player.userId == userId
        )
        const playerName = groupObj[groupId][giftIndex].displayName
        const nextPlayerName = groupObj[groupId][giftIndex + 1]
          ? groupObj[groupId][giftIndex + 1].displayName
          : null
        const giftNumber = switchOrder[groupId][giftIndex]

        replyText(
          event,
          `恭喜 ${playerName} 交換到第 ${giftNumber} 號禮物\n` +
            `${
              nextPlayerName
                ? `下一位 ${nextPlayerName} 請準備`
                : `結束啦！！！`
            }`
        )

        if (!nextPlayerName) {
          delete groupObj[groupId]
          delete switchOrder[groupId]
        }
        return
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
