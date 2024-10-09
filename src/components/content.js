// src/components/content.js

// 這個文件包含了活動的所有內容數據，可以在此處更新和管理

const content = {
  eventName: "Counterspell Taiwan",
  eventDescription: "全台第一場由青少年舉辦給青少年的黑客松",
  eventDetails: {
    date: "2024/11/30 - 2024/12/01",
    location: "台北市 (具體位置待訂)",
    organizer: "HackIt",
    coOrganizer: "Hack Club",
    sponsors: "待確認",
  },
  aboutUs:
    "Counterspell Taiwan 是由 HackIt 主辦，Hack Club 協辦的一場專為全國各級高中（職）學生及專科學生設計的遊戲主題黑客松。活動旨在凝聚熱愛科技的青少年，共同推動台灣遊戲產業的發展。",
  goals: [
    {
      title: "促進創新",
      description:
        "鼓勵參賽者利用現代化工具和生成式AI，創造出獨具一格的遊戲原型。",
    },
    {
      title: "增進合作",
      description: "通過跨校、跨領域的組隊方式，促進多元交流與合作。",
    },
    {
      title: "技能提升",
      description: "提供入門工作坊與專業導師協助，確保每位參賽者都能有所收穫。",
    },
  ],
  participantInfo: {
    eligible: [
      "全國各級高中（職）學生",
      "專科一年級至三年級學生",
      "非學校型態實驗教育學生",
    ],
    requiredItems: [
      "筆記型電腦",
      "充電器",
      "個人衛生用品",
      "個人身分證明",
      "其他個人需求物品",
    ],
    registrationProcess:
      "請前往我們的官方網站點擊「開啟報名表單」並填寫相關資訊，即可完成報名。名額有限，請盡早報名！",
  },
  awards: {
    regional: {
      gold: 1,
      silver: 2,
      bronze: 3,
      genAI: 3,
      honorableMentions: 6,
    },
    global: {
      // 未來公布全球獎項資訊
    },
  },
  workshopDetails: {
    title: "遊戲開發入門工作坊",
    description:
      "活動正式開始前的線上工作坊，提供遊戲開發的基礎入門指導，教導如何利用現代化工具快速創建遊戲原型，並結合生成式AI進行創意發想。",
    location: "待確認",
    time: "待確認",
    instructors: "待確認",
    fee: "全額免費",
    registration: "報名 Counterspell Taiwan 即可免費參加",
    requiredItems: "待確認",
  },
  schedule: [
    {
      date: "2024/11/29",
      event: "工作坊",
      description: "遊戲開發入門工作坊，線上進行。",
    },
    {
      date: "2024/11/30 - 2024/12/01",
      event: "黑客松",
      description: "兩天一夜的遊戲開發黑客松，激發創意與技術。",
    },
    {
      date: "2024/12/01",
      event: "公布地區獎項",
      description: "在活動結束當天公布地區獎項名單。",
    },
    {
      date: "2024/12/02 - 2025/01/31",
      event: "全球獎項公布",
      description: "活動結束一個月內，由 HackIt 公布全球獎項。",
    },
  ],
  qa: [
    {
      question: "報名資格是什麼？",
      answer:
        "全國各級高中（職）學生、專科一年級至三年級學生，以及非學校型態實驗教育學生均可參加。",
    },
    {
      question: "活動是否免費？",
      answer: "是的，參加活動完全免費，並提供豐富的獎品。",
    },
    {
      question: "需攜帶哪些物品？",
      answer:
        "參賽者需攜帶筆記型電腦、充電器、個人衛生用品及其他個人需求物品。具體列表將在活動前公布。",
    },
    {
      question: "如何組隊？",
      answer: "每隊2-6人，參賽者可自行組隊報名，並鼓勵跨校、跨領域組隊。",
    },
  ],
  contactInfo: {
    email: "counterspell@hackit.tw",
    instagram: "hackit.tw",
  },
  registrationPath: "http://counterspell.hackit.tw/signup", // 假設報名表單在主頁的報名區塊
};

export default content;
