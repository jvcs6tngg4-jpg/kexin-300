/* ============================================================
   网站配置 —— 所有内容都在这，改这里即可
   ============================================================ */
const SITE = {
  her: {
    name: "芯",
    nickname: "芯",
    alias: "芯",
    birthday: { year: 2008, month: 2, day: 25 }   // 她的生日
  },
  him: {
    name: "煊",
    alias: "煊",
    gameName: "鬼火上的黄毛"
  },
  startDate: "2025-10-05",       // 在一起的日子（天数自动计算）

  /* ---------- 选歌（在开场白二选一） ----------
     两位歌手的歌，选谁播谁 */
  songs: {
    xue: { file: "xuezhiqian.m4a", title: "薛之谦 · 苏黎世的从前", img: "singer_xue.jpg" },
    fang: { file: "fangdatong.m4a", title: "方大同 · 好不容易",     img: "singer_fang.jpg" }
  },
  /* 兜底音乐（未选歌时的环境音开关，一般用不到） */
  bgm: { file: "", title: "" },

  /* ---------- 照片 / 视频 ----------
     文件放 assets/photos/ 或 assets/videos/，留空 = 占位框 */
  media: {
    /* 壹 · 初遇 */
    meet:     "g_duel.jpg",
    dali1:    "t_dali1.jpg",
    dali2:    "t_dali2.jpg",
    oct1a:    "t_1001a.jpg",
    together: "together_chat.jpg",    // ★ 2025.10.05 在一起那晚的聊天记录
    oct5a:    "t_1005_night.jpg",
    oct5b:    "t_1005_day.jpg",
    q21:      "g_21q.jpg",
    album1:   "c_album1.jpg",
    album2:   "c_album2.jpg",
    meet_day: "m_0613_1.jpg",

    /* 贰 · 一千公里的月光 */
    miss: "c_miss.jpg",
    five: "c_5yuan.jpg",
    call: "c_call.jpg",
    hug:  "c_hug.jpg",

    /* 叁 · 漂洋过海来见你 */
    board1: "m_board1.jpg",
    board2: "m_board2.jpg",
    km:     "m_km.jpg",
    music1: "m_music.jpg",
    m1:  "m_0613_1.jpg",  m2:  "m_0613_2.jpg",  m3:  "m_0613_3.jpg",
    m4:  "m_0613_4.jpg",  m5:  "m_0613_5.jpg",  m6:  "m_0613_6.jpg",
    m7:  "m_0613_7.jpg",  m8:  "m_0613_8.jpg",  m9:  "m_0613_9.jpg",
    m10: "m_0613_10.jpg", m11: "m_0613_11.jpg", m12: "m_0613_12.jpg",
    m13: "m_0613_13.jpg", m14: "m_0613_14.jpg", m15: "m_0613_15.jpg",

    /* 肆 · 我们的峡谷 */
    gname: "g_name.jpg",
    gwin:  "g_win.jpg",
    gmvp:  "g_mvp.jpg",
    gduel: "g_duel.jpg",
    glv7:  "g_lv7.jpg", glv9:  "g_lv9.jpg", glv12: "g_lv12.jpg",
    glv13: "g_lv13.jpg", glv17: "g_lv17.jpg", glv19: "g_lv19.jpg",

    /* 陆 · 关于你 */
    zhuzhu: "v_zhuzhu1.mp4",

    /* 柒 · 好好吃饭 */
    food1: "food_1.jpg", food2: "food_2.jpg", food3: "food_3.jpg",
    food4: "food_4.jpg", food5: "food_5.jpg", food6: "food_6.jpg",

    /* 终章 */
    finale_video: "",
  },

  /* ---------- 第八章 · 流动影片的放映单 ----------
     顺序即播放顺序。type: video 播放视频 / photo 播放照片（Ken Burns 运镜）
     cap 是每帧浮现的字幕 */
  cinema: [
    { type: "video", src: "cin_0125.mp4", cap: "你出现在画面里的时候，我心里的灯就亮了" },
    { type: "photo", src: "cin_0307.jpg",  cap: "随手一拍的你，也是我的女主角" },
    { type: "photo", src: "cin_0321.jpg",  cap: "这大概是我最舍不得快进的画面" },
    { type: "video", src: "cin_0605.mp4",  cap: "你把普通的一天，变成了值得纪念的一天" },
    { type: "photo", src: "cin_0629.jpg",  cap: "看到你，就忍不住想夸：怎么这么好看" },
    { type: "photo", src: "cin_0712_1.jpg", cap: "我的女主角，连发呆都好看" },
    { type: "photo", src: "cin_0712_2.jpg", cap: "这世界吵吵闹闹，可你是安安静静的好看" },
    { type: "photo", src: "cin_0712_3.jpg", cap: "翻到这一帧，还是会心跳" },
    { type: "photo", src: "cin_0712_4.jpg", cap: "你一定是偷偷把星星装进了眼睛里" },
    { type: "photo", src: "cin_0712_5.jpg", cap: "生活很忙，但看你的时候，时间会慢下来" },
    { type: "photo", src: "cin_0712_6.jpg", cap: "随手一拍，都是我心动的证据" },
    { type: "photo", src: "cin_0712_7.jpg", cap: "你是所有美好里，我最喜欢的那一个" },
    { type: "video", src: "cin_0717.mp4",  cap: "深夜翻到这一段，又想你了" },
    { type: "video", src: "cin_0729.mp4",  cap: "看完这些，更确定了一件事：我真的很喜欢你" }
  ]};
