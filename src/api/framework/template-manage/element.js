import request from '@/api/request'


// 获取月份
export function cMonthGet(params) {
  return new Promise((resolve, reject) => {
    try {
      const data = [
        { label: '1', value: '01' },
        { label: '2', value: '02' },
        { label: '3', value: '03' },
        { label: '4', value: '04' },
        { label: '5', value: '05' },
        { label: '6', value: '06' },
        { label: '7', value: '07' },
        { label: '8', value: '08' },
        { label: '9', value: '09' },
        { label: '10', value: '10' },
        { label: '11', value: '11' },
        { label: '12', value: '12' },
      ]
      resolve({ code: 200, data: data, msg: '请求成功！' })
    } catch {
      reject({ code: 500, data: [], msg: '请求失败！' })
    }
  })
}

// 获取人员
export const cPersonGet = (params) => {
  return request({
    url: '/mock/cPersonGet',
    method: 'get',
    params,
    headers: { base: 'mock', }
  })
  // return new Promise((resolve, reject) => {
  //   try {
  //     const data = [
  //       { id: 1, personName: '工藤新一', personId: 1, gender: 'male', age: 17, role: '侦探', popularity: 950000, progress: 95, status: '待提交', introduction: '工藤新一是一名天才高中侦探，凭借其出色的推理能力，成功解决了大量案件。在一次案件调查过程中，他被使用了毒药“APTX 4869”，身体缩小成小孩，化名为柯南，继续以小学生身份解决犯罪案件，寻找恢复原状的方法。' },
  //       { id: 2, personName: '毛利兰', personId: 2, gender: 'female', age: 17, role: '高中生', popularity: 850000, progress: 85, status: '待提交', introduction: '毛利兰是工藤新一的青梅竹马，武术高手。她是新一的亲密伙伴，常常帮助柯南解决案件。尽管她不知道新一的真正身份，但她深信新一依然活着，并时刻为他着急。' },
  //       { id: 3, personName: '怪盗基德', personId: 3, gender: 'male', age: 17, role: '怪盗', popularity: 880000, progress: 90, status: '待审核', introduction: '怪盗基德是传说中的怪盗，他的目标是盗取世界上最珍贵的宝物。他巧妙的计划和高超的技艺使得他几乎不被抓住，然而，他与侦探工藤新一之间形成了奇妙的对手关系，两人一直在博弈。' },
  //       { id: 4, personName: '中森青子', personId: 4, gender: 'female', age: 17, role: '高中生', popularity: 500000, progress: 70, status: '待审核', introduction: '中森青子是一个独立的高中生，同时也是警察局局长的女儿。她对柯南有着好感，并且在柯南解决案件时提供了很多帮助。青子的人物性格坚强果敢，她多次协助警方破解案件。' },
  //       { id: 5, personName: '服部平次', personId: 5, gender: 'male', age: 17, role: '侦探', popularity: 780000, progress: 92, status: '审核已通过', introduction: '服部平次是大阪的高中生侦探，与工藤新一的推理能力不相上下。两人因共同的侦探技能而建立了深厚的友谊，经常一起合作解决复杂案件。他拥有极强的观察力和推理能力，是新一的重要伙伴之一。' },
  //       { id: 6, personName: '远山和叶', personId: 6, gender: 'female', age: 17, role: '高中生', popularity: 460000, progress: 75, status: '审核已通过', introduction: '远山和叶是服部平次的青梅竹马，她聪明、机智，并且在推理上有很高的天赋。她多次帮助平次解决案件，并且一直关注着柯南的成长。和叶拥有不容小觑的直觉，并常常提出关键线索。' },
  //       { id: 7, personName: '京极真', personId: 7, gender: 'male', age: 18, role: '打手', popularity: 420000, progress: 68, status: '审核未通过', introduction: '京极真是一个非常强壮的青年，因其高超的格斗技巧而著名。他通常充当着组织的打手，在一些复杂的案件中担任重要的角色。尽管他看起来粗鲁，但他拥有自己的底线，时常帮助需要帮助的人。' },
  //       { id: 8, personName: '铃木园子', personId: 8, gender: 'female', age: 17, role: '高中生', popularity: 540000, progress: 80, status: '审核未通过', introduction: '铃木园子是毛利兰的好友，出生在富裕家庭，她性格开朗，直率。她在许多案件中帮助柯南和兰，提供有用的情报。园子对于柯南的感情十分深厚，虽然她没有意识到柯南的真正身份，但她一直将他视为好朋友。' },
  //       { id: 9, personName: '工藤优作', personId: 9, gender: 'male', age: 40, role: '小说家', popularity: 400000, progress: 65, status: '待提交', introduction: '工藤优作是工藤新一的父亲，著名的推理小说家。他以独特的写作风格和复杂的故事情节而闻名，同时，他的推理能力也相当出色。优作对于新一的侦探事业非常支持，是新一坚定的后盾。' },
  //       { id: 10, personName: '工藤有希子', personId: 10, gender: 'female', age: 40, role: '演员', popularity: 380000, progress: 60, status: '待提交', introduction: '工藤有希子是工藤新一的母亲，曾是一位知名的电影女演员。她风华绝代，才艺出众。她与丈夫工藤优作共同为新一提供了充足的精神支持，并时常为他带来不为人知的幕后资源。' },
  //       { id: 11, personName: '毛利小五郎', personId: 11, gender: 'male', age: 40, role: '侦探', popularity: 700000, progress: 85, status: '待提交', introduction: '毛利小五郎是著名的侦探，以推理精确闻名。然而，在酒精的影响下，他常常无法清晰地思考，而是依靠柯南的帮助解决案件。尽管如此，小五郎依然是一位非常杰出的侦探，常常能够在关键时刻做出正确判断。' },
  //       { id: 12, personName: '妃英理', personId: 12, gender: 'female', age: 40, role: '律师', popularity: 500000, progress: 78, status: '待提交', introduction: '妃英理是一名顶尖的律师，擅长刑事辩护。她与毛利小五郎曾是夫妻，两人虽已离婚，但依然保持良好的关系。英理在处理案件时非常理智，能够从多个角度分析案情，并为自己的客户争取到最大利益。' },
  //       { id: 13, personName: '黑羽盗一', personId: 13, gender: 'male', age: 35, role: '魔术师', popularity: 480000, progress: 72, status: '待审核', introduction: '黑羽盗一是一位闻名世界的魔术师，兼具巧妙的舞台表现和绝高的偷盗技巧。他通常不参与暴力行为，更多的是以巧妙的手法偷取他人财物。尽管外界认为他是个神秘人物，但他与怪盗基德有着紧密的联系。' },
  //       { id: 14, personName: '黑羽千影', personId: 14, gender: 'female', age: 20, role: '怪盗', popularity: 450000, progress: 70, status: '待审核', introduction: '黑羽千影是怪盗基德的盟友，也是他的合作伙伴之一。她以美丽与智慧著称，并与基德共同进行盗窃活动。她的盗窃技巧堪比基德，常常以令人意想不到的方式盗取目标物品，成为神秘世界的一部分。' },
  //       { id: 15, personName: '阿笠博士', personId: 15, gender: 'male', age: 60, role: '科学家', popularity: 600000, progress: 88, status: '审核已通过', introduction: '阿笠博士是柯南的好朋友和科学顾问，他发明了许多高科技的设备，帮助柯南解决各种案件。博士不仅是柯南的朋友，也是他在变小后的“庇护所”，为他提供各种支持。阿笠博士的智慧为侦探工作提供了坚实的基础。' },
  //       { id: 16, personName: '宫野明美', personId: 16, gender: 'female', age: 28, role: '怪盗', popularity: 470000, progress: 68, status: '待提交', introduction: '宫野明美是一个具有复杂背景的怪盗，她与组织有着紧密的联系。她精通多种技艺，常常以假面身份出现，并且善于隐藏自己的真实意图。她的出现总是让案件变得扑朔迷离。' },
  //       { id: 17, personName: '宫野志保', personId: 17, gender: 'female', age: 17, role: '高中生', popularity: 750000, progress: 90, status: '待提交', introduction: '宫野志保是一个聪明的高中生，曾是一名黑衣组织成员。她后来叛变，成为了帮助柯南的关键人物之一。志保不仅拥有超强的推理能力，她也在暗中协助柯南破解与黑衣组织有关的案件。' },
  //       { id: 18, personName: '圆谷光彦', personId: 18, gender: 'male', age: 10, role: '小学生', popularity: 400000, progress: 80, status: '审核已通过', introduction: '圆谷光彦是柯南的同班同学，他是一个正直、善良的小学生。光彦的观察力敏锐，在多个案件中都起到了至关重要的作用，尤其是在处理与柯南的合作时，他展现了过人的推理能力。' },
  //       { id: 19, personName: '小岛元太', personId: 19, gender: 'male', age: 10, role: '小学生', popularity: 420000, progress: 78, status: '审核已通过', introduction: '小岛元太是柯南的小伙伴，性格非常直率且有些鲁莽，但心地善良。他与光彦和步美一起组成了名侦探团，虽然年纪小，但他勇敢且充满正义感，常常为真相而努力。' },
  //       { id: 20, personName: '吉泽步美', personId: 20, gender: 'female', age: 10, role: '小学生', popularity: 430000, progress: 82, status: '审核已通过', introduction: '吉泽步美是柯南的小伙伴之一，外表可爱，性格活泼。她在与光彦和元太一起的冒险中，虽然年纪小，但有着非常聪明的头脑，并且总是能在关键时刻帮助侦探们解开谜团。' },
  //       { id: 21, personName: '赤井秀一', personId: 21, gender: 'male', age: 35, role: 'FBI', popularity: 880000, progress: 93, status: '待提交', introduction: '赤井秀一是FBI的特工，因其超凡的推理能力和高度的隐秘行动而闻名。他长期调查黑衣组织，是柯南的亲密盟友之一。秀一是一个冷静、机智且非常有责任感的人。' },
  //       { id: 22, personName: '朱蒂斯泰琳', personId: 22, gender: 'female', age: 30, role: 'FBI', popularity: 500000, progress: 76, status: '待审核', introduction: '朱蒂斯泰琳是FBI的一名杰出特工，擅长情报收集与案件分析。她与赤井秀一一起共同调查黑衣组织，具有丰富的国际犯罪侦查经验。她的冷静和果断让她在危急时刻总能作出最正确的判断。' },
  //       { id: 23, personName: '安德雷卡迈尔', personId: 23, gender: 'male', age: 40, role: 'FBI', popularity: 460000, progress: 70, status: '待审核', introduction: '安德雷卡迈尔是FBI的资深特工，他以高效的工作和强大的情报收集能力而著称。卡迈尔的调查方法严谨，执行力强，并且总是能够以最快的速度解决案件，是一个非常可靠的同事。' },
  //       { id: 24, personName: '詹姆斯布莱克', personId: 24, gender: 'male', age: 45, role: 'FBI', popularity: 440000, progress: 68, status: '待审核', introduction: '詹姆斯布莱克是FBI的资深探员，负责调查黑衣组织的相关案件。他以高超的办案技巧和丰富的经验，协助柯南和其他伙伴们完成了多个难度极高的任务。' },
  //       { id: 25, personName: '安室透', personId: 25, gender: 'male', age: 33, role: '公安', popularity: 870000, progress: 91, status: '待审核', introduction: '安室透是公安的成员，隐藏自己的真实身份，深藏不露。他曾为黑衣组织工作过，并且长期潜伏在公安中进行情报收集。他的任务十分隐秘且危险，但他一直在努力揭开组织背后的真相。' },
  //       { id: 26, personName: '水无怜奈', personId: 26, gender: 'female', age: 28, role: 'CIA', popularity: 480000, progress: 75, status: '审核未通过', introduction: '水无怜奈是CIA的特工，擅长伪装和间谍工作。她的任务是秘密调查黑衣组织，并且与柯南建立了良好的合作关系。她非常机智并且十分勇敢，在调查中总是能够保持冷静，做出最正确的决定。' },
  //       { id: 27, personName: '贝尔摩德', personId: 27, gender: 'female', age: 35, role: '黑衣组织', popularity: 800000, progress: 89, status: '审核未通过', introduction: '贝尔摩德是黑衣组织的成员之一，因其美丽而具有极高的魅力，同时也十分危险。她通常以一个无害的身份出现，但背后隐藏着复杂的计划。贝尔摩德的阴谋往往扑朔迷离，很难猜测她的真正目的。' },
  //       { id: 28, personName: '琴酒', personId: 28, gender: 'male', age: 45, role: '黑衣组织', popularity: 790000, progress: 87, status: '审核未通过', introduction: '琴酒是黑衣组织的高级成员，外表冷酷无情，且具有强大的执行力。他在组织中担任着重要职务，经常参与策划和执行组织的重大任务。琴酒的果断与冷血让他在黑衣组织中非常受信任。' },
  //       { id: 29, personName: '伏特加', personId: 29, gender: 'male', age: 40, role: '黑衣组织', popularity: 650000, progress: 80, status: '审核未通过', introduction: '伏特加是黑衣组织的核心成员之一，以其机智和出色的战斗力而著名。他是琴酒的得力助手，参与过许多关键任务，常常与其他成员一起执行隐秘且危险的任务。' },
  //       { id: 30, personName: '朗姆', personId: 30, gender: 'male', age: 40, role: '黑衣组织', popularity: 820000, progress: 92, status: '审核未通过', introduction: '朗姆是黑衣组织的高级成员之一，背后隐藏着巨大的秘密。他在组织内有着极高的权力，个性冷酷且极其聪明。朗姆的真正身份至今是谜，令所有人都感到不安。' }
  //     ]


  //     // 计算当前页的起始和结束位置
  //     const { currentPageNum, currentPageSize } = params
  //     const start = (currentPageNum - 1) * currentPageSize
  //     const end = start + currentPageSize
  //     // 截取分页数据
  //     const resData = data.slice(start, end)
  //     resolve({ code: 200, data: { list: resData, total: data.length, }, msg: '请求成功！' })
  //   } catch {
  //     reject({ code: 500, data: { list: [], total: 0 }, msg: '请求失败！' })
  //   }
  // })
}

// 下载文件
export function cFileDownload(params) {
  return request({
    url: '/node/cFileDownload',
    method: 'get',
    params,
    responseType: 'blob',
    headers: { base: 'node', }
  })
}
