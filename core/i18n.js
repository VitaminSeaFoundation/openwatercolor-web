/*
 * UI strings for every platform. Exposes window.UnderwaterI18n in a browser, module.exports in CommonJS.
 *
 * To add a language: add an entry to LANGUAGES and a table to MESSAGES with the same keys.
 * Missing keys fall back to FALLBACK, so a partial table still works.
 * "{name}" in a string is filled from the params passed to t().
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.UnderwaterI18n = api;
}(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var FALLBACK = "zh-CN";
  var LANGUAGES = [
    { code: "zh-CN", label: "简体中文", short: "简" },
    { code: "zh-TW", label: "繁體中文", short: "繁" },
    { code: "en", label: "English", short: "EN" },
    { code: "ja", label: "日本語", short: "日" },
    { code: "ko", label: "한국어", short: "한" },
    { code: "es", label: "Español", short: "ES" },
    { code: "fr", label: "Français", short: "FR" }
  ];

  var MESSAGES = {
    "zh-CN": {
      appName: "饼妹水下照片小助手",
      toolName: "「饼妹水下照片小助手」",
      localBadge: "本机处理",
      switchLanguage: "切换语言",
      eyebrow: "UNDERWATER COLOR RESTORE",
      heroLine1: "让每一次下潜，",
      heroLine2: "都留下真实的蓝",
      heroCopy: "褪去照片里的蓝绿色偏色，让珊瑚、鱼群和阳光重新鲜活。",
      previewLabel: "水下照片还原前后对比",
      captionSample: "示例照片",
      captionUser: "你的照片",
      hintDrag: "拖动分界线，查看色彩变化",
      hintWorking: "正在还原色彩…",
      canvasLabel: "水下照片还原前后对比画面",
      before: "还原前",
      after: "还原后",
      dividerLabel: "拖动分界线对比还原前后",
      strength: "色彩还原",
      warmth: "暖度",
      warmthHint: "冷 — 暖",
      water: "水色",
      waterHint: "自然 — 深蓝",
      clarity: "通透",
      clarityHint: "柔和 — 通透",
      actionsLabel: "照片操作",
      importIdle: "开始AI水下色彩还原",
      busy: "正在还原色彩…",
      save: "保存到相册",
      saving: "正在保存…",
      saved: "已保存到相册",
      savingStatus: "正在保存到相册…",
      savedStatus: "已保存到相册。",
      saveFailed: "保存失败，请检查相册权限后重试。",
      saveFailedDetail: "保存失败：{detail}",
      share: "分享",
      shareFailed: "分享失败，请稍后重试。",
      shareFailedDetail: "分享失败：{detail}",
      another: "再还原一张",
      preparing: "正在准备…",
      privacyStart: "照片只在本机处理，不会上传。选择一张水下照片开始。",
      privacy: "照片只在本机处理，不会上传。",
      pickerLabel: "选择水下照片",
      credit: "Developed by",
      creditName: "海洋维他命 Vitamin Sea",
      tagline: "让每一次潜入，都留下真实的蓝",
      savedAsk: "要不要分享给大家看看？",
      savedDismiss: "先不分享",
      savedDone: "完成",
      close: "关闭",
      noCast: "这张照片没有明显的水下偏色，已保持原样。",
      processFailed: "照片处理失败，请换一张图片再试。",
      unreadable: "无法读取这张照片。",
      openFailed: "无法打开这张照片，请选择 JPG、PNG 或 WebP 图片。",
      notImage: "不支持视频，请选择一张 JPG、PNG 或 WebP 照片。",
      tooLarge: "这张照片超过 25 MB，请先选择较小的图片。",
      sampleFailed: "示例照片加载失败。你仍可选择自己的照片开始。",

      xhsShare: "分享到小红书",
      xhsComment: "发到评论区",
      xhsSaveUnavailable: "相册保存功能请在小红书小工具容器中使用。",
      xhsShareUnavailable: "分享功能请在小红书小工具容器中使用。",
      xhsSharePreparing: "正在准备还原前后的照片…",
      xhsShareOpened: "已打开发布页，对比图和还原前后两张照片都已带上。",
      xhsShareDone: "已提交发布。",
      xhsCommentUnavailable: "发到评论区请在小红书小工具容器中使用，并升级到最新版小红书。",
      xhsCommentPreparing: "正在准备还原前后对比图…",
      xhsCommentTooOld: "发到评论区需要小红书 9.49 或更高版本，请升级后再试。",
      xhsCommentOpening: "正在打开评论区…",
      xhsCommentNotRouted: "没能打开评论区，请稍后重试。",
      xhsCommentFailed: "发到评论区失败，请稍后重试。",
      xhsCommentFailedDetail: "发到评论区失败：{detail}",
      xhsCommentText: "水下照片色彩还原前后对比，你更喜欢哪一边？",
      // title 最长 20 字，正文拼好后最长 1000 字（postNote 限制）
      xhsNotes: [
        {
          title: "潜水废片别删！蓝绿色一键变回来",
          opening: "潜水照片又蓝又绿，先别急着删！😭\n用小工具{tool}处理了一下，蓝绿色褪掉之后，沙子、珊瑚和鱼群都鲜活多了✨",
          question: "你更喜欢还原前还是还原后？评论区告诉我👇"
        },
        {
          title: "救命！我的潜水照片颜色回来了",
          opening: "一直以为这张只能是一片蓝绿色了😭\n用小工具{tool}试了一下，选张照片就自动处理，效果直接看第 1 张✨",
          question: "你手机里有没有这样的蓝绿色潜水照？评论区聊聊👇"
        },
        {
          title: "同一张潜水照，还原前后差这么多",
          opening: "同一张照片，还原前和还原后放在一起看，差别真的很明显👀\n用的是小工具{tool}，几乎不用自己调🌊",
          question: "猜猜这张是在哪里拍的？评论区说说👇"
        },
        {
          title: "潜水党必存｜水下照片去蓝绿一键搞定",
          opening: "潜水回来修图太费时间的，可以先存一下📌\n小工具{tool}，选张照片就能褪掉水下的蓝绿偏色，不用会调色🌊",
          question: "你平时怎么修水下照片？评论区交流一下👇"
        }
      ],
      xhsNoteDetails: "📸 第 1 张是前后对比，第 2、3 张是还原前和还原后\n🎚️ 还原强度可以自己调\n🔒 照片只在手机上处理，不会上传",
      xhsNoteCredit: "工具开发 by @饼妹水下日记📸",
      xhsNoteTags: "",

      webSave: "保存图片",
      webSaved: "图片已保存",
      webSavingStatus: "正在导出图片…",
      webSavedStatus: "图片已保存。",
      webFileName: "水下色彩还原",

      wxShareTitle: "水下照片一键还原色彩",
      wxShareImage: "分享对比图",
      wxSaveDenied: "需要相册权限才能保存，请在设置中允许“添加到相册”。",
      wxOpenSetting: "去设置",
      wxCancel: "取消"
    },

    en: {
      appName: "Vitamin Sea Underwater Color Recover",
      toolName: "“Vitamin Sea Underwater Color Recover”",
      localBadge: "On-device",
      switchLanguage: "Change language",
      eyebrow: "UNDERWATER COLOR RESTORE",
      heroLine1: "Every dive deserves ",
      heroLine2: "its true blue",
      heroCopy: "Lift the blue-green cast so coral, fish and sunlight come alive again.",
      previewLabel: "Underwater photo, before and after",
      captionSample: "Sample photo",
      captionUser: "Your photo",
      hintDrag: "Drag the divider to compare",
      hintWorking: "Restoring colours…",
      canvasLabel: "Before-and-after view of the underwater photo",
      before: "Before",
      after: "After",
      dividerLabel: "Drag to compare before and after",
      strength: "Restore",
      warmth: "Warmth",
      warmthHint: "Cool — Warm",
      water: "Water",
      waterHint: "Natural — Deep blue",
      clarity: "Clarity",
      clarityHint: "Soft — Crisp",
      actionsLabel: "Photo actions",
      importIdle: "Start AI colour restore",
      busy: "Restoring colours…",
      save: "Save to Photos",
      saving: "Saving…",
      saved: "Saved to Photos",
      savingStatus: "Saving to Photos…",
      savedStatus: "Saved to Photos.",
      saveFailed: "Couldn't save. Check photo access and try again.",
      saveFailedDetail: "Couldn't save: {detail}",
      share: "Share",
      shareFailed: "Couldn't share. Please try again later.",
      shareFailedDetail: "Couldn't share: {detail}",
      another: "Restore another",
      preparing: "Preparing…",
      privacyStart: "Photos are processed on this device and never uploaded. Pick an underwater photo to begin.",
      privacy: "Photos are processed on this device and never uploaded.",
      pickerLabel: "Choose an underwater photo",
      credit: "Developed by",
      creditName: "Vitamin Sea",
      tagline: "Every dive, its true blue",
      savedAsk: "Want to share it?",
      savedDismiss: "Not now",
      savedDone: "Done",
      close: "Close",
      noCast: "This photo has no clear underwater cast, so it was left as it is.",
      processFailed: "Couldn't process this photo. Please try another one.",
      unreadable: "Couldn't read this photo.",
      openFailed: "Couldn't open this photo. Please choose a JPG, PNG or WebP image.",
      notImage: "Videos aren't supported. Please choose a JPG, PNG or WebP photo.",
      tooLarge: "This photo is over 25 MB. Please choose a smaller one.",
      sampleFailed: "The sample photo didn't load. You can still choose your own photo.",

      xhsShare: "Share to Xiaohongshu",
      xhsComment: "Post as comment",
      xhsSaveUnavailable: "Saving to Photos only works inside the Xiaohongshu mini tool.",
      xhsShareUnavailable: "Sharing only works inside the Xiaohongshu mini tool.",
      xhsSharePreparing: "Preparing the before and after photos…",
      xhsShareOpened: "The post editor is open with the comparison and both photos attached.",
      xhsShareDone: "Post submitted.",
      xhsCommentUnavailable: "Posting a comment only works inside the latest Xiaohongshu mini tool.",
      xhsCommentPreparing: "Preparing the comparison image…",
      xhsCommentTooOld: "Posting a comment needs Xiaohongshu 9.49 or later. Please update and try again.",
      xhsCommentOpening: "Opening comments…",
      xhsCommentNotRouted: "Couldn't open comments. Please try again later.",
      xhsCommentFailed: "Couldn't post the comment. Please try again later.",
      xhsCommentFailedDetail: "Couldn't post the comment: {detail}",
      xhsCommentText: "Underwater photo, before and after colour restore. Which side do you like?",
      xhsNotes: [
        {
          title: "Don't delete blue dive shots!",
          opening: "Blue-green dive photos? Don't delete them yet! 😭\nI ran this one through {tool} and the sand, coral and fish came back to life ✨",
          question: "Before or after, which do you prefer? Tell me in the comments 👇"
        },
        {
          title: "My dive photo got its colour back",
          opening: "I thought this one would stay blue-green forever 😭\nTried {tool}: pick a photo and it does the rest. See photo 1 ✨",
          question: "Got dive photos like this on your phone? Let's chat 👇"
        }
      ],
      xhsNoteDetails: "📸 Photo 1 is the comparison, 2 and 3 are before and after\n🎚️ You can adjust the strength yourself\n🔒 Photos are processed on the phone, never uploaded",
      xhsNoteCredit: "Tool by @饼妹水下日记📸",
      xhsNoteTags: "",

      webSave: "Save image",
      webSaved: "Image saved",
      webSavingStatus: "Exporting the image…",
      webSavedStatus: "Image saved.",
      webFileName: "underwater-restored",

      wxShareTitle: "Restore underwater photo colours in one tap",
      wxShareImage: "Share comparison",
      wxSaveDenied: "Saving needs access to Photos. Please allow “Add to Photos” in Settings.",
      wxOpenSetting: "Open Settings",
      wxCancel: "Cancel"
    },

    "zh-TW": {
      appName: "餅妹水下照片小助手",
      toolName: "「餅妹水下照片小助手」",
      localBadge: "本機處理",
      switchLanguage: "切換語言",
      eyebrow: "UNDERWATER COLOR RESTORE",
      heroLine1: "讓每一次下潛，",
      heroLine2: "都留下真實的藍",
      heroCopy: "褪去照片裡的藍綠色偏色，讓珊瑚、魚群和陽光重新鮮活。",
      previewLabel: "水下照片還原前後對比",
      captionSample: "範例照片",
      captionUser: "你的照片",
      hintDrag: "拖曳分界線，查看色彩變化",
      hintWorking: "正在還原色彩…",
      canvasLabel: "水下照片還原前後對比畫面",
      before: "還原前",
      after: "還原後",
      dividerLabel: "拖曳分界線對比還原前後",
      strength: "色彩還原",
      warmth: "暖度",
      warmthHint: "冷 — 暖",
      water: "水色",
      waterHint: "自然 — 深藍",
      clarity: "通透",
      clarityHint: "柔和 — 通透",
      actionsLabel: "照片操作",
      importIdle: "開始AI水下色彩還原",
      busy: "正在還原色彩…",
      save: "儲存到相簿",
      saving: "正在儲存…",
      saved: "已儲存到相簿",
      savingStatus: "正在儲存到相簿…",
      savedStatus: "已儲存到相簿。",
      saveFailed: "儲存失敗，請檢查相簿權限後再試一次。",
      saveFailedDetail: "儲存失敗：{detail}",
      share: "分享",
      shareFailed: "分享失敗，請稍後再試。",
      shareFailedDetail: "分享失敗：{detail}",
      another: "再還原一張",
      preparing: "正在準備…",
      privacyStart: "照片只在本機處理，不會上傳。選擇一張水下照片開始。",
      privacy: "照片只在本機處理，不會上傳。",
      pickerLabel: "選擇水下照片",
      credit: "Developed by",
      creditName: "海洋維他命 Vitamin Sea",
      tagline: "讓每一次潛入，都留下真實的藍",
      savedAsk: "要不要分享給大家看看？",
      savedDismiss: "先不分享",
      savedDone: "完成",
      close: "關閉",
      noCast: "這張照片沒有明顯的水下偏色，已保持原樣。",
      processFailed: "照片處理失敗，請換一張圖片再試。",
      unreadable: "無法讀取這張照片。",
      openFailed: "無法開啟這張照片，請選擇 JPG、PNG 或 WebP 圖片。",
      notImage: "不支援影片，請選擇一張 JPG、PNG 或 WebP 照片。",
      tooLarge: "這張照片超過 25 MB，請先選擇較小的圖片。",
      sampleFailed: "範例照片載入失敗。你仍可選擇自己的照片開始。",

      xhsShare: "分享到小紅書",
      xhsComment: "發到留言區",
      xhsSaveUnavailable: "相簿儲存功能請在小紅書小工具中使用。",
      xhsShareUnavailable: "分享功能請在小紅書小工具中使用。",
      xhsSharePreparing: "正在準備還原前後的照片…",
      xhsShareOpened: "已開啟發布頁，對比圖和還原前後兩張照片都已附上。",
      xhsShareDone: "已送出發布。",
      xhsCommentUnavailable: "發到留言區請在小紅書小工具中使用，並更新到最新版小紅書。",
      xhsCommentPreparing: "正在準備還原前後對比圖…",
      xhsCommentTooOld: "發到留言區需要小紅書 9.49 或更新版本，請更新後再試。",
      xhsCommentOpening: "正在開啟留言區…",
      xhsCommentNotRouted: "沒能開啟留言區，請稍後再試。",
      xhsCommentFailed: "發到留言區失敗，請稍後再試。",
      xhsCommentFailedDetail: "發到留言區失敗：{detail}",
      xhsCommentText: "水下照片色彩還原前後對比，你比較喜歡哪一邊？",
      xhsNotes: [
        {
          title: "潛水廢片別刪！藍綠色一鍵變回來",
          opening: "潛水照片又藍又綠，先別急著刪！😭\n用小工具{tool}處理了一下，藍綠色褪掉之後，沙子、珊瑚和魚群都鮮活多了✨",
          question: "你比較喜歡還原前還是還原後？留言告訴我👇"
        },
        {
          title: "同一張潛水照，還原前後差這麼多",
          opening: "同一張照片，還原前和還原後放在一起看，差別真的很明顯👀\n用的是小工具{tool}，幾乎不用自己調🌊",
          question: "猜猜這張是在哪裡拍的？留言說說👇"
        }
      ],
      xhsNoteDetails: "📸 第 1 張是前後對比，第 2、3 張是還原前和還原後\n🎚️ 還原強度可以自己調\n🔒 照片只在手機上處理，不會上傳",
      xhsNoteCredit: "工具開發 by @饼妹水下日记📸",
      xhsNoteTags: "",

      webSave: "儲存圖片",
      webSaved: "圖片已儲存",
      webSavingStatus: "正在匯出圖片…",
      webSavedStatus: "圖片已儲存。",
      webFileName: "水下色彩還原",

      wxShareTitle: "水下照片一鍵還原色彩",
      wxShareImage: "分享對比圖",
      wxSaveDenied: "需要相簿權限才能儲存，請在設定中允許「加入相簿」。",
      wxOpenSetting: "前往設定",
      wxCancel: "取消"
    },

    ja: {
      appName: "Vitamin Sea 水中カラー復元",
      toolName: "「Vitamin Sea 水中カラー復元」",
      localBadge: "端末内で処理",
      switchLanguage: "言語を切り替え",
      eyebrow: "UNDERWATER COLOR RESTORE",
      heroLine1: "潜るたびに、",
      heroLine2: "ほんとうの青を",
      heroCopy: "写真の青緑かぶりを取り除いて、サンゴや魚の群れ、差し込む光をもう一度鮮やかに。",
      previewLabel: "水中写真の補正前と補正後",
      captionSample: "サンプル写真",
      captionUser: "あなたの写真",
      hintDrag: "境界線をドラッグして色の変化を比べる",
      hintWorking: "色を補正しています…",
      canvasLabel: "水中写真の補正前後の比較",
      before: "補正前",
      after: "補正後",
      dividerLabel: "ドラッグして補正前後を比べる",
      strength: "色補正",
      warmth: "暖かさ",
      warmthHint: "寒色 — 暖色",
      water: "水の色",
      waterHint: "自然 — 深い青",
      clarity: "透明感",
      clarityHint: "やわらか — くっきり",
      actionsLabel: "写真の操作",
      importIdle: "AIで水中の色を補正する",
      busy: "色を補正しています…",
      save: "写真に保存",
      saving: "保存しています…",
      saved: "写真に保存しました",
      savingStatus: "写真に保存しています…",
      savedStatus: "写真に保存しました。",
      saveFailed: "保存できませんでした。写真へのアクセスを確認して、もう一度お試しください。",
      saveFailedDetail: "保存できませんでした：{detail}",
      share: "共有",
      shareFailed: "共有できませんでした。しばらくしてからもう一度お試しください。",
      shareFailedDetail: "共有できませんでした：{detail}",
      another: "別の写真を補正",
      preparing: "準備しています…",
      privacyStart: "写真はこの端末内で処理され、アップロードされません。水中写真を選んで始めましょう。",
      privacy: "写真はこの端末内で処理され、アップロードされません。",
      pickerLabel: "水中写真を選ぶ",
      credit: "Developed by",
      creditName: "Vitamin Sea",
      tagline: "潜るたびに、ほんとうの青を",
      savedAsk: "みんなにシェアしてみませんか？",
      savedDismiss: "今はしない",
      savedDone: "完了",
      close: "閉じる",
      noCast: "この写真には目立つ水中の色かぶりがないため、そのままにしました。",
      processFailed: "写真を処理できませんでした。別の写真でお試しください。",
      unreadable: "この写真を読み込めませんでした。",
      openFailed: "この写真を開けませんでした。JPG、PNG、WebP の画像を選んでください。",
      notImage: "動画には対応していません。JPG、PNG、WebP の写真を選んでください。",
      tooLarge: "この写真は 25 MB を超えています。もっと小さい写真を選んでください。",
      sampleFailed: "サンプル写真を読み込めませんでした。ご自身の写真を選んで始めることはできます。",

      xhsShare: "小紅書でシェア",
      xhsComment: "コメントに投稿",
      xhsSaveUnavailable: "写真への保存は小紅書のミニツール内でのみ使えます。",
      xhsShareUnavailable: "シェアは小紅書のミニツール内でのみ使えます。",
      xhsSharePreparing: "補正前後の写真を準備しています…",
      xhsShareOpened: "投稿画面を開きました。比較画像と補正前後の写真 2 枚を添付済みです。",
      xhsShareDone: "投稿しました。",
      xhsCommentUnavailable: "コメントへの投稿は、最新版の小紅書のミニツール内でのみ使えます。",
      xhsCommentPreparing: "比較画像を準備しています…",
      xhsCommentTooOld: "コメントへの投稿には小紅書 9.49 以降が必要です。アップデートしてからお試しください。",
      xhsCommentOpening: "コメント欄を開いています…",
      xhsCommentNotRouted: "コメント欄を開けませんでした。しばらくしてからお試しください。",
      xhsCommentFailed: "コメントに投稿できませんでした。しばらくしてからお試しください。",
      xhsCommentFailedDetail: "コメントに投稿できませんでした：{detail}",
      xhsCommentText: "水中写真の色補正、補正前と補正後。どっちが好き？",
      xhsNotes: [
        {
          title: "青緑の水中写真、消さないで！",
          opening: "青くて緑っぽい水中写真、まだ消さないで！😭\n{tool}で補正したら、砂もサンゴも魚もいきいきしてきた✨",
          question: "補正前と補正後、どっちが好き？コメントで教えてね👇"
        },
        {
          title: "ダイビング写真の色が戻った",
          opening: "この写真はずっと青緑のままだと思ってた😭\n{tool}を試してみたら、写真を選ぶだけで自動で補正。1 枚目を見てね✨",
          question: "スマホにこんな青緑の水中写真、ありませんか？コメントでどうぞ👇"
        }
      ],
      xhsNoteDetails: "📸 1 枚目は比較、2・3 枚目は補正前と補正後\n🎚️ 補正の強さは自分で調整できます\n🔒 写真はスマホ内で処理され、アップロードされません",
      xhsNoteCredit: "ツール開発 by @饼妹水下日记📸",
      xhsNoteTags: "",

      webSave: "画像を保存",
      webSaved: "画像を保存しました",
      webSavingStatus: "画像を書き出しています…",
      webSavedStatus: "画像を保存しました。",
      webFileName: "水中写真-補正",

      wxShareTitle: "水中写真の色をワンタップで補正",
      wxShareImage: "比較画像をシェア",
      wxSaveDenied: "保存するには写真へのアクセスが必要です。設定で「写真に追加」を許可してください。",
      wxOpenSetting: "設定を開く",
      wxCancel: "キャンセル"
    },

    ko: {
      appName: "Vitamin Sea 수중 색 복원",
      toolName: "‘Vitamin Sea 수중 색 복원’",
      localBadge: "기기에서 처리",
      switchLanguage: "언어 변경",
      eyebrow: "UNDERWATER COLOR RESTORE",
      heroLine1: "다이빙할 때마다,",
      heroLine2: "진짜 바다의 파랑을",
      heroCopy: "사진 속 청록빛을 걷어내고 산호와 물고기 떼, 햇살을 다시 생생하게.",
      previewLabel: "수중 사진 복원 전후 비교",
      captionSample: "예시 사진",
      captionUser: "내 사진",
      hintDrag: "경계선을 끌어서 색 변화를 확인하세요",
      hintWorking: "색을 복원하는 중…",
      canvasLabel: "수중 사진 복원 전후 비교 화면",
      before: "복원 전",
      after: "복원 후",
      dividerLabel: "끌어서 복원 전후 비교",
      strength: "색 복원",
      warmth: "따뜻함",
      warmthHint: "차갑게 — 따뜻하게",
      water: "물빛",
      waterHint: "자연스럽게 — 짙은 파랑",
      clarity: "선명도",
      clarityHint: "부드럽게 — 선명하게",
      actionsLabel: "사진 작업",
      importIdle: "AI 수중 색 복원 시작",
      busy: "색을 복원하는 중…",
      save: "사진에 저장",
      saving: "저장하는 중…",
      saved: "사진에 저장됨",
      savingStatus: "사진에 저장하는 중…",
      savedStatus: "사진에 저장했습니다.",
      saveFailed: "저장하지 못했습니다. 사진 접근 권한을 확인한 뒤 다시 시도하세요.",
      saveFailedDetail: "저장하지 못했습니다: {detail}",
      share: "공유",
      shareFailed: "공유하지 못했습니다. 잠시 후 다시 시도하세요.",
      shareFailedDetail: "공유하지 못했습니다: {detail}",
      another: "다른 사진 복원",
      preparing: "준비하는 중…",
      privacyStart: "사진은 이 기기에서만 처리되며 업로드되지 않습니다. 수중 사진을 골라 시작하세요.",
      privacy: "사진은 이 기기에서만 처리되며 업로드되지 않습니다.",
      pickerLabel: "수중 사진 선택",
      credit: "Developed by",
      creditName: "Vitamin Sea",
      tagline: "다이빙할 때마다, 진짜 바다의 파랑을",
      savedAsk: "다른 사람들에게도 보여 줄까요?",
      savedDismiss: "나중에",
      savedDone: "완료",
      close: "닫기",
      noCast: "이 사진에는 뚜렷한 수중 색 번짐이 없어 그대로 두었습니다.",
      processFailed: "사진을 처리하지 못했습니다. 다른 사진으로 시도하세요.",
      unreadable: "이 사진을 읽을 수 없습니다.",
      openFailed: "이 사진을 열 수 없습니다. JPG, PNG 또는 WebP 이미지를 선택하세요.",
      notImage: "동영상은 지원하지 않습니다. JPG, PNG 또는 WebP 사진을 선택하세요.",
      tooLarge: "이 사진은 25MB를 넘습니다. 더 작은 사진을 선택하세요.",
      sampleFailed: "예시 사진을 불러오지 못했습니다. 내 사진을 골라 시작할 수 있습니다.",

      xhsShare: "샤오훙수에 공유",
      xhsComment: "댓글로 올리기",
      xhsSaveUnavailable: "사진 저장은 샤오훙수 미니 도구 안에서만 사용할 수 있습니다.",
      xhsShareUnavailable: "공유는 샤오훙수 미니 도구 안에서만 사용할 수 있습니다.",
      xhsSharePreparing: "복원 전후 사진을 준비하는 중…",
      xhsShareOpened: "게시 화면을 열었습니다. 비교 이미지와 복원 전후 사진 두 장이 첨부되어 있습니다.",
      xhsShareDone: "게시했습니다.",
      xhsCommentUnavailable: "댓글로 올리기는 최신 샤오훙수 미니 도구 안에서만 사용할 수 있습니다.",
      xhsCommentPreparing: "비교 이미지를 준비하는 중…",
      xhsCommentTooOld: "댓글로 올리려면 샤오훙수 9.49 이상이 필요합니다. 업데이트한 뒤 다시 시도하세요.",
      xhsCommentOpening: "댓글을 여는 중…",
      xhsCommentNotRouted: "댓글을 열지 못했습니다. 잠시 후 다시 시도하세요.",
      xhsCommentFailed: "댓글을 올리지 못했습니다. 잠시 후 다시 시도하세요.",
      xhsCommentFailedDetail: "댓글을 올리지 못했습니다: {detail}",
      xhsCommentText: "수중 사진 색 복원 전후 비교, 어느 쪽이 더 좋아요?",
      xhsNotes: [
        {
          title: "청록빛 다이빙 사진, 지우지 마세요!",
          opening: "파랗고 초록빛 도는 다이빙 사진, 아직 지우지 마세요! 😭\n{tool}로 처리했더니 모래, 산호, 물고기가 다 살아났어요 ✨",
          question: "복원 전과 후, 어느 쪽이 더 좋아요? 댓글로 알려 주세요 👇"
        },
        {
          title: "다이빙 사진 색이 돌아왔어요",
          opening: "이 사진은 계속 청록색일 줄 알았는데 😭\n{tool}를 써 보니 사진만 고르면 알아서 처리돼요. 첫 번째 사진을 보세요 ✨",
          question: "휴대폰에 이런 청록빛 다이빙 사진 있나요? 댓글로 얘기해요 👇"
        }
      ],
      xhsNoteDetails: "📸 1번은 전후 비교, 2·3번은 복원 전과 복원 후\n🎚️ 복원 강도는 직접 조절할 수 있어요\n🔒 사진은 휴대폰에서만 처리되고 업로드되지 않아요",
      xhsNoteCredit: "도구 개발 by @饼妹水下日记📸",
      xhsNoteTags: "",

      webSave: "이미지 저장",
      webSaved: "이미지 저장됨",
      webSavingStatus: "이미지를 내보내는 중…",
      webSavedStatus: "이미지를 저장했습니다.",
      webFileName: "수중-색-복원",

      wxShareTitle: "수중 사진 색을 한 번에 복원",
      wxShareImage: "비교 이미지 공유",
      wxSaveDenied: "저장하려면 사진 접근 권한이 필요합니다. 설정에서 ‘사진에 추가’를 허용하세요.",
      wxOpenSetting: "설정 열기",
      wxCancel: "취소"
    },

    es: {
      appName: "Vitamin Sea Recuperación de color submarino",
      toolName: "«Vitamin Sea Recuperación de color submarino»",
      localBadge: "En local",
      switchLanguage: "Cambiar idioma",
      eyebrow: "UNDERWATER COLOR RESTORE",
      heroLine1: "Cada inmersión merece ",
      heroLine2: "su verdadero azul",
      heroCopy: "Quita el tono azul verdoso para que el coral, los peces y la luz del sol vuelvan a la vida.",
      previewLabel: "Foto submarina, antes y después",
      captionSample: "Foto de ejemplo",
      captionUser: "Tu foto",
      hintDrag: "Arrastra el divisor para comparar",
      hintWorking: "Restaurando los colores…",
      canvasLabel: "Vista de antes y después de la foto submarina",
      before: "Antes",
      after: "Después",
      dividerLabel: "Arrastra para comparar antes y después",
      strength: "Restaurar",
      warmth: "Calidez",
      warmthHint: "Frío — Cálido",
      water: "Agua",
      waterHint: "Natural — Azul intenso",
      clarity: "Claridad",
      clarityHint: "Suave — Nítido",
      actionsLabel: "Acciones de la foto",
      importIdle: "Restaurar colores con IA",
      busy: "Restaurando los colores…",
      save: "Guardar en Fotos",
      saving: "Guardando…",
      saved: "Guardada en Fotos",
      savingStatus: "Guardando en Fotos…",
      savedStatus: "Guardada en Fotos.",
      saveFailed: "No se pudo guardar. Revisa el acceso a Fotos y vuelve a intentarlo.",
      saveFailedDetail: "No se pudo guardar: {detail}",
      share: "Compartir",
      shareFailed: "No se pudo compartir. Inténtalo de nuevo más tarde.",
      shareFailedDetail: "No se pudo compartir: {detail}",
      another: "Restaurar otra",
      preparing: "Preparando…",
      privacyStart: "Las fotos se procesan en este dispositivo y nunca se suben. Elige una foto submarina para empezar.",
      privacy: "Las fotos se procesan en este dispositivo y nunca se suben.",
      pickerLabel: "Elige una foto submarina",
      credit: "Developed by",
      creditName: "Vitamin Sea",
      tagline: "Cada inmersión, su verdadero azul",
      savedAsk: "¿Quieres compartirla?",
      savedDismiss: "Ahora no",
      savedDone: "Listo",
      close: "Cerrar",
      noCast: "Esta foto no tiene un tono submarino claro, así que se ha dejado como estaba.",
      processFailed: "No se pudo procesar esta foto. Prueba con otra.",
      unreadable: "No se pudo leer esta foto.",
      openFailed: "No se pudo abrir esta foto. Elige una imagen JPG, PNG o WebP.",
      notImage: "No se admiten vídeos. Elige una foto JPG, PNG o WebP.",
      tooLarge: "Esta foto pesa más de 25 MB. Elige una más pequeña.",
      sampleFailed: "No se pudo cargar la foto de ejemplo. Aun así, puedes elegir tu propia foto.",

      xhsShare: "Compartir en Xiaohongshu",
      xhsComment: "Publicar como comentario",
      xhsSaveUnavailable: "Guardar en Fotos solo funciona dentro de la miniherramienta de Xiaohongshu.",
      xhsShareUnavailable: "Compartir solo funciona dentro de la miniherramienta de Xiaohongshu.",
      xhsSharePreparing: "Preparando las fotos de antes y después…",
      xhsShareOpened: "Se ha abierto el editor con la comparación y las dos fotos adjuntas.",
      xhsShareDone: "Publicación enviada.",
      xhsCommentUnavailable: "Publicar un comentario solo funciona en la última versión de la miniherramienta de Xiaohongshu.",
      xhsCommentPreparing: "Preparando la imagen comparativa…",
      xhsCommentTooOld: "Para publicar un comentario necesitas Xiaohongshu 9.49 o posterior. Actualiza e inténtalo de nuevo.",
      xhsCommentOpening: "Abriendo los comentarios…",
      xhsCommentNotRouted: "No se pudieron abrir los comentarios. Inténtalo de nuevo más tarde.",
      xhsCommentFailed: "No se pudo publicar el comentario. Inténtalo de nuevo más tarde.",
      xhsCommentFailedDetail: "No se pudo publicar el comentario: {detail}",
      xhsCommentText: "Foto submarina antes y después de restaurar el color. ¿Con cuál te quedas?",
      xhsNotes: [
        {
          title: "¡No borres tus fotos azules!",
          opening: "¿Fotos de buceo azul verdosas? ¡No las borres todavía! 😭\nPasé esta por {tool} y la arena, el coral y los peces volvieron a la vida ✨",
          question: "¿Antes o después? Cuéntamelo en los comentarios 👇"
        },
        {
          title: "Mi foto de buceo recuperó el color",
          opening: "Pensaba que esta se quedaría azul verdosa para siempre 😭\nProbé {tool}: eliges una foto y hace el resto. Mira la foto 1 ✨",
          question: "¿Tienes fotos de buceo así en el móvil? Hablemos 👇"
        }
      ],
      xhsNoteDetails: "📸 La foto 1 es la comparación; la 2 y la 3, el antes y el después\n🎚️ Puedes ajustar la intensidad tú mismo\n🔒 Las fotos se procesan en el móvil y nunca se suben",
      xhsNoteCredit: "Herramienta de @饼妹水下日记📸",
      xhsNoteTags: "",

      webSave: "Guardar imagen",
      webSaved: "Imagen guardada",
      webSavingStatus: "Exportando la imagen…",
      webSavedStatus: "Imagen guardada.",
      webFileName: "submarina-restaurada",

      wxShareTitle: "Restaura los colores de tus fotos submarinas con un toque",
      wxShareImage: "Compartir comparación",
      wxSaveDenied: "Para guardar se necesita acceso a Fotos. Permite «Añadir a Fotos» en Ajustes.",
      wxOpenSetting: "Abrir Ajustes",
      wxCancel: "Cancelar"
    },

    fr: {
      appName: "Vitamin Sea Récupération des couleurs sous-marines",
      toolName: "« Vitamin Sea Récupération des couleurs sous-marines »",
      localBadge: "Sur l'appareil",
      switchLanguage: "Changer de langue",
      eyebrow: "UNDERWATER COLOR RESTORE",
      heroLine1: "Chaque plongée mérite ",
      heroLine2: "son vrai bleu",
      heroCopy: "Effacez la dominante bleu-vert pour redonner vie au corail, aux poissons et à la lumière du soleil.",
      previewLabel: "Photo sous-marine, avant et après",
      captionSample: "Photo d'exemple",
      captionUser: "Votre photo",
      hintDrag: "Faites glisser le séparateur pour comparer",
      hintWorking: "Restauration des couleurs…",
      canvasLabel: "Vue avant-après de la photo sous-marine",
      before: "Avant",
      after: "Après",
      dividerLabel: "Faites glisser pour comparer avant et après",
      strength: "Restauration",
      warmth: "Chaleur",
      warmthHint: "Froid — Chaud",
      water: "Eau",
      waterHint: "Naturel — Bleu profond",
      clarity: "Clarté",
      clarityHint: "Doux — Net",
      actionsLabel: "Actions sur la photo",
      importIdle: "Restaurer les couleurs par IA",
      busy: "Restauration des couleurs…",
      save: "Enregistrer dans Photos",
      saving: "Enregistrement…",
      saved: "Enregistrée dans Photos",
      savingStatus: "Enregistrement dans Photos…",
      savedStatus: "Enregistrée dans Photos.",
      saveFailed: "Impossible d'enregistrer. Vérifiez l'accès à Photos et réessayez.",
      saveFailedDetail: "Impossible d'enregistrer : {detail}",
      share: "Partager",
      shareFailed: "Impossible de partager. Réessayez plus tard.",
      shareFailedDetail: "Impossible de partager : {detail}",
      another: "Restaurer une autre photo",
      preparing: "Préparation…",
      privacyStart: "Les photos sont traitées sur cet appareil et ne sont jamais envoyées. Choisissez une photo sous-marine pour commencer.",
      privacy: "Les photos sont traitées sur cet appareil et ne sont jamais envoyées.",
      pickerLabel: "Choisir une photo sous-marine",
      credit: "Developed by",
      creditName: "Vitamin Sea",
      tagline: "Chaque plongée, son vrai bleu",
      savedAsk: "Envie de la partager ?",
      savedDismiss: "Pas maintenant",
      savedDone: "Terminé",
      close: "Fermer",
      noCast: "Cette photo n'a pas de dominante sous-marine nette : elle a été laissée telle quelle.",
      processFailed: "Impossible de traiter cette photo. Essayez-en une autre.",
      unreadable: "Impossible de lire cette photo.",
      openFailed: "Impossible d'ouvrir cette photo. Choisissez une image JPG, PNG ou WebP.",
      notImage: "Les vidéos ne sont pas prises en charge. Choisissez une photo JPG, PNG ou WebP.",
      tooLarge: "Cette photo dépasse 25 Mo. Choisissez-en une plus petite.",
      sampleFailed: "La photo d'exemple n'a pas pu être chargée. Vous pouvez quand même choisir votre propre photo.",

      xhsShare: "Partager sur Xiaohongshu",
      xhsComment: "Publier en commentaire",
      xhsSaveUnavailable: "L'enregistrement dans Photos ne fonctionne que dans le mini-outil Xiaohongshu.",
      xhsShareUnavailable: "Le partage ne fonctionne que dans le mini-outil Xiaohongshu.",
      xhsSharePreparing: "Préparation des photos avant et après…",
      xhsShareOpened: "L'éditeur de publication est ouvert, avec la comparaison et les deux photos jointes.",
      xhsShareDone: "Publication envoyée.",
      xhsCommentUnavailable: "La publication en commentaire ne fonctionne que dans la dernière version du mini-outil Xiaohongshu.",
      xhsCommentPreparing: "Préparation de l'image comparative…",
      xhsCommentTooOld: "Publier en commentaire nécessite Xiaohongshu 9.49 ou ultérieur. Mettez à jour puis réessayez.",
      xhsCommentOpening: "Ouverture des commentaires…",
      xhsCommentNotRouted: "Impossible d'ouvrir les commentaires. Réessayez plus tard.",
      xhsCommentFailed: "Impossible de publier le commentaire. Réessayez plus tard.",
      xhsCommentFailedDetail: "Impossible de publier le commentaire : {detail}",
      xhsCommentText: "Photo sous-marine avant et après restauration des couleurs. Vous préférez quel côté ?",
      xhsNotes: [
        {
          title: "Ne supprimez pas vos photos bleues !",
          opening: "Des photos de plongée toutes bleu-vert ? Ne les supprimez pas tout de suite ! 😭\nJ'ai passé celle-ci dans {tool} : le sable, le corail et les poissons ont repris vie ✨",
          question: "Avant ou après, vous préférez lequel ? Dites-le en commentaire 👇"
        },
        {
          title: "Ma photo de plongée a retrouvé ses couleurs",
          opening: "Je pensais que celle-ci resterait bleu-vert pour toujours 😭\nJ'ai essayé {tool} : on choisit une photo, il fait le reste. Voir la photo 1 ✨",
          question: "Vous avez des photos de plongée comme ça sur votre téléphone ? Parlons-en 👇"
        }
      ],
      xhsNoteDetails: "📸 La photo 1 est la comparaison, les photos 2 et 3 l'avant et l'après\n🎚️ Vous pouvez régler l'intensité vous-même\n🔒 Les photos sont traitées sur le téléphone, jamais envoyées",
      xhsNoteCredit: "Outil par @饼妹水下日记📸",
      xhsNoteTags: "",

      webSave: "Enregistrer l'image",
      webSaved: "Image enregistrée",
      webSavingStatus: "Exportation de l'image…",
      webSavedStatus: "Image enregistrée.",
      webFileName: "sous-marine-restauree",

      wxShareTitle: "Restaurez les couleurs de vos photos sous-marines en un geste",
      wxShareImage: "Partager la comparaison",
      wxSaveDenied: "L'enregistrement nécessite l'accès à Photos. Autorisez « Ajouter à Photos » dans les Réglages.",
      wxOpenSetting: "Ouvrir les Réglages",
      wxCancel: "Annuler"
    }
  };

  /* "zh", "zh-Hans-CN", "zh_CN" -> "zh-CN"; "zh-Hant", "zh-HK", "zh-MO" -> "zh-TW"; "en-GB" -> "en"; unknown -> null. */
  function normalize(tag) {
    if (!tag || typeof tag !== "string") return null;
    var lower = tag.replace(/_/g, "-").toLowerCase();
    var index;
    for (index = 0; index < LANGUAGES.length; index += 1) {
      if (LANGUAGES[index].code.toLowerCase() === lower) return LANGUAGES[index].code;
    }
    var base = lower.split("-")[0];
    if (base === "zh") {
      var subtags = lower.split("-").slice(1);
      if (subtags.indexOf("hans") !== -1) return "zh-CN";
      if (subtags.indexOf("hant") !== -1 || /^(tw|hk|mo)$/.test(subtags[subtags.length - 1] || "")) return "zh-TW";
      return "zh-CN";
    }
    for (index = 0; index < LANGUAGES.length; index += 1) {
      if (LANGUAGES[index].code.toLowerCase().split("-")[0] === base) return LANGUAGES[index].code;
    }
    return null;
  }

  /* First supported language among the candidates, in order of preference. */
  function resolve(candidates) {
    var index;
    for (index = 0; index < (candidates || []).length; index += 1) {
      var code = normalize(candidates[index]);
      if (code) return code;
    }
    return FALLBACK;
  }

  function format(text, params) {
    if (!params || typeof text !== "string") return text;
    return text.replace(/\{(\w+)\}/g, function (match, name) {
      return Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match;
    });
  }

  function create(language) {
    var code = normalize(language) || FALLBACK;
    var table = MESSAGES[code];
    function t(key, params) {
      var text = Object.prototype.hasOwnProperty.call(table, key) ? table[key] : MESSAGES[FALLBACK][key];
      return text === undefined ? key : format(text, params);
    }
    return { language: code, t: t, format: format };
  }

  /* The language after this one, for a single toggle button. */
  function next(language) {
    var index;
    for (index = 0; index < LANGUAGES.length; index += 1) {
      if (LANGUAGES[index].code === language) return LANGUAGES[(index + 1) % LANGUAGES.length];
    }
    return LANGUAGES[0];
  }

  return {
    FALLBACK: FALLBACK,
    LANGUAGES: LANGUAGES,
    MESSAGES: MESSAGES,
    normalize: normalize,
    resolve: resolve,
    create: create,
    next: next
  };
}));
