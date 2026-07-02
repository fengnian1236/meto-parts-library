<script>
/* ===== CONSTANTS ===== */
const CATEGORY_COLORS = {
  grass: '#ec4899', live: '#f97316', onv1: '#8b5cf6',
  match: '#3b82f6', realshow: '#10b981', story: '#ef4444', native: '#06b6d4'
};

const REGION_COLORS = { '欧美': { bg: '#4f6ef7', label: '欧美' }, '中东南亚': { bg: '#f59e0b', label: '中东南亚' } };

const STORAGE_KEY = 'meto_parts_v103';
const YT_STORAGE_KEY = 'meto_yt_data_v103';
const THEME_KEY = 'meto_theme';
const UNDO_MAX = 5;

/* ===== DEFAULT DATA (7 categories) ===== */
const DEFAULT_DATA = {
  grass: {
    label: '🌸 种草', color: CATEGORY_COLORS.grass,
    desc: '通过美女/达人/生活场景激发用户兴趣，引导下载转化',
    items: [
      { id: 'g-beauty-eu', name: '美女推荐', region: '欧美', tags: ['种草', '美女', '欧美'], pot: '★★★★★',
        stages: { before3s: '真人自拍+引导性文案，吸引眼球', middle: '分享使用体验/展示匹配/聊天录屏', cta: '片尾彩色字幕软引导' } },
      { id: 'g-influencer-eu', name: '达人推荐', region: '欧美', tags: ['种草', '达人', '欧美'], pot: '★★★★★',
        stages: { before3s: '达人出镜推荐', middle: '功能展示+使用体验', cta: 'Try It Now!' } },
      { id: 'g-lifestyle-eu', name: '生活化场景', region: '欧美', tags: ['种草', '生活化', '欧美'], pot: '★★★★',
        stages: { before3s: '居家/户外/擦边等日常场景', middle: '打开APP→浏览→匹配→聊天', cta: '消息弹窗/视频来电UI' } },
      { id: 'g-forum-eu', name: '论坛分享', region: '欧美', tags: ['种草', '论坛', '欧美'], pot: '★★★★',
        stages: { before3s: '评论截图', middle: '真人讲经历→展示APP→浏览主页→Match', cta: 'Try It Now!' } },
      { id: 'g-beauty-sea', name: '美女/达人推荐', region: '中东南亚', tags: ['种草', '美女', '中东南亚'], pot: '★★★★★',
        stages: { before3s: '美女自拍+本土化问候', middle: '展示聊天/匹配/互动录屏', cta: 'Download弹窗' } },
      { id: 'g-lifestyle-sea', name: '生活化场景', region: '中东南亚', tags: ['种草', '生活化', '中东南亚'], pot: '★★★★',
        stages: { before3s: '家庭/聚会等本土生活', middle: '打开APP→浏览主页→匹配', cta: '视频来电UI+消息弹窗' } },
    ]
  },
  live: {
    label: '🔥 直播', color: CATEGORY_COLORS.live,
    desc: '直播互动场景，展示真实直播氛围引导下载',
    items: [
      { id: 'l-live-eu', name: '直播互动', region: '欧美', tags: ['直播', '互动', '欧美'], pot: '★★★★★',
        stages: { before3s: '擦边舞蹈', middle: '直播切片/滑动展示/礼物特效', cta: 'download弹窗' } },
      { id: 'l-beauty-host-sea', name: '美女主播', region: '中东南亚', tags: ['直播', '主播', '中东南亚'], pot: '★★★★★',
        stages: { before3s: '美女主播/舞蹈/礼物特效', middle: '直播PK/多人互动/送礼氛围', cta: '直播间弹窗+礼物特效+PK排行榜' } },
      { id: 'l-voice-sea', name: '语音房', region: '中东南亚', tags: ['直播', '语音房', '中东南亚'], pot: '★★★★',
        stages: { before3s: '语音房场景', middle: '多人连麦/互动展示', cta: 'Join弹窗' } },
    ]
  },
  onv1: {
    label: '📹 1V1', color: CATEGORY_COLORS.onv1,
    desc: '1对1视频/语音/消息聊天场景，展示真人互动',
    items: [
      { id: 'o-video-eu', name: '视频聊天', region: '欧美', tags: ['1V1', '视频', '欧美'], pot: '★★★★★',
        stages: { before3s: '擦边美女', middle: '真人互动/轻松聊天', cta: '电话UI' } },
      { id: 'o-phone-eu', name: '电话接通瞬间', region: '欧美', tags: ['1V1', '电话', '欧美'], pot: '★★★★★',
        stages: { before3s: '电话铃声响起', middle: '真人互动/轻松聊天', cta: '电话UI' } },
      { id: 'o-msg-eu', name: '消息聊天', region: '欧美', tags: ['1V1', '消息', '欧美'], pot: '★★★★',
        stages: { before3s: '聊天界面', middle: '消息回复+真人自拍', cta: '消息UI' } },
      { id: 'o-video-sea', name: '视频聊天', region: '中东南亚', tags: ['1V1', '视频', '中东南亚'], pot: '★★★★★',
        stages: { before3s: '来电弹窗/视频接通', middle: '视频聊天/表情互动', cta: '视频聊天UI+在线状态' } },
    ]
  },
  match: {
    label: '⚡ 匹配', color: CATEGORY_COLORS.match,
    desc: '匹配机制展示，AI推荐和同城功能引导',
    items: [
      { id: 'm-smart-eu', name: '智能匹配', region: '欧美', tags: ['匹配', '智能', '欧美'], pot: '★★★★★',
        stages: { before3s: '左右滑动用户/美女出现', middle: '浏览资料→Match成功→聊天', cta: '模拟左右滑界面/同城定位弹窗' } },
      { id: 'm-ai-eu', name: 'AI推荐', region: '欧美', tags: ['匹配', 'AI', '欧美'], pot: '★★★★★',
        stages: { before3s: 'AI推荐界面/AI Match', middle: 'AI推荐好友→一键聊天→视频通话', cta: '字幕软引导:Meet Your Match' } },
      { id: 'm-ai-sea', name: 'AI推荐', region: '中东南亚', tags: ['匹配', 'AI', '中东南亚'], pot: '★★★★★',
        stages: { before3s: '推荐用户列表', middle: 'AI推荐→匹配成功→聊天', cta: 'Match成功弹窗' } },
      { id: 'm-local-sea', name: '同城匹配', region: '中东南亚', tags: ['匹配', '同城', '中东南亚'], pot: '★★★★',
        stages: { before3s: '地图定位', middle: 'AI推荐→匹配成功→聊天', cta: '左右滑匹配+AI推荐' } },
    ]
  },
  realshow: {
    label: '📸 真实展示', color: CATEGORY_COLORS.realshow,
    desc: '高颜值用户真实展示，建立产品信任感',
    items: [
      { id: 'r-user-eu', name: '用户展示', region: '欧美', tags: ['真实展示', '用户', '欧美'], pot: '★★★★★',
        stages: { before3s: '高颜值用户/舞蹈高光/美女口播', middle: '浏览主页/聊天界面展示', cta: '私信/消息弹窗' } },
      { id: 'r-beauty-sea', name: '美女展示', region: '中东南亚', tags: ['真实展示', '美女', '中东南亚'], pot: '★★★★★',
        stages: { before3s: '高颜值用户/本土穿搭/舞蹈', middle: '浏览主页/真实聊天展示', cta: '消息提醒+在线提示' } },
    ]
  },
  story: {
    label: '🎭 剧情', color: CATEGORY_COLORS.story,
    desc: '情感共鸣剧情，孤独→收到消息→情绪改善',
    items: [
      { id: 's-emotion-eu', name: '情感共鸣', region: '欧美', tags: ['剧情', '情感', '欧美'], pot: '★★★★',
        stages: { before3s: '深夜独处/无聊时刻', middle: '收到消息→开始聊天→情绪改善', cta: '消息UI/Match匹配成功弹窗' } },
      { id: 's-companion-sea', name: '陪伴治愈', region: '中东南亚', tags: ['剧情', '陪伴', '中东南亚'], pot: '★★★★',
        stages: { before3s: '场景导入（孤独时刻）', middle: '剧情反转（收到消息/匹配成功）', cta: '模拟应用商店弹窗' } },
    ]
  },
  native: {
    label: '🎙 原生', color: CATEGORY_COLORS.native,
    desc: '本地达人街访/用户采访，真实UGC内容增强信任',
    items: [
      { id: 'n-interview-sea', name: '用户采访', region: '中东南亚', tags: ['原生', '街访', '中东南亚'], pot: '★★★★★',
        stages: { before3s: '本地达人/街访', middle: '用户分享交友经历+录屏', cta: '强CTA: Chat Now / Meet Girls / Video Call' } },
    ]
  }
};

/* ===== PRESETS (7 combos) ===== */
const PRESETS = [
  {
    name: '🌸 种草 · 欧美美女推荐', note: '最通用公式，欧美市场主力，美女自拍+使用体验+软引导',
    items: [
      { id: 'g-beauty-eu', cat: 'grass', name: '美女推荐(欧美)', color: CATEGORY_COLORS.grass },
      { id: 'm-smart-eu', cat: 'match', name: '智能匹配(欧美)', color: CATEGORY_COLORS.match },
      { id: 'o-video-eu', cat: 'onv1', name: '视频聊天(欧美)', color: CATEGORY_COLORS.onv1 },
    ]
  },
  {
    name: '🔥 直播 · 中东南亚美女主播', note: '东南亚直播带货场景，美女主播+PK+礼物氛围强刺激',
    items: [
      { id: 'l-beauty-host-sea', cat: 'live', name: '美女主播(中东南亚)', color: CATEGORY_COLORS.live },
      { id: 'l-voice-sea', cat: 'live', name: '语音房(中东南亚)', color: CATEGORY_COLORS.live },
      { id: 'r-beauty-sea', cat: 'realshow', name: '美女展示(中东南亚)', color: CATEGORY_COLORS.realshow },
    ]
  },
  {
    name: '📹 1V1 · 欧美视频聊天', note: '1V1视频互动核心公式，电话UI+真人互动+欧美市场',
    items: [
      { id: 'o-phone-eu', cat: 'onv1', name: '电话接通瞬间(欧美)', color: CATEGORY_COLORS.onv1 },
      { id: 'o-video-eu', cat: 'onv1', name: '视频聊天(欧美)', color: CATEGORY_COLORS.onv1 },
      { id: 'r-user-eu', cat: 'realshow', name: '用户展示(欧美)', color: CATEGORY_COLORS.realshow },
    ]
  },
  {
    name: '⚡ 匹配 · AI推荐欧美', note: 'AI推荐+Match成功+视频通话，欧美市场主力公式',
    items: [
      { id: 'm-ai-eu', cat: 'match', name: 'AI推荐(欧美)', color: CATEGORY_COLORS.match },
      { id: 'm-smart-eu', cat: 'match', name: '智能匹配(欧美)', color: CATEGORY_COLORS.match },
      { id: 'o-msg-eu', cat: 'onv1', name: '消息聊天(欧美)', color: CATEGORY_COLORS.onv1 },
    ]
  },
  {
    name: '📸 真实展示 · 中东南亚美女', note: '本土美女展示+真实聊天录屏，东南亚市场高信任公式',
    items: [
      { id: 'r-beauty-sea', cat: 'realshow', name: '美女展示(中东南亚)', color: CATEGORY_COLORS.realshow },
      { id: 'g-beauty-sea', cat: 'grass', name: '美女推荐(中东南亚)', color: CATEGORY_COLORS.grass },
      { id: 'm-ai-sea', cat: 'match', name: 'AI推荐(中东南亚)', color: CATEGORY_COLORS.match },
    ]
  },
  {
    name: '🎭 剧情 · 情感共鸣欧美', note: '情感共鸣剧情，深夜孤独→匹配成功→情绪改善',
    items: [
      { id: 's-emotion-eu', cat: 'story', name: '情感共鸣(欧美)', color: CATEGORY_COLORS.story },
      { id: 'm-smart-eu', cat: 'match', name: '智能匹配(欧美)', color: CATEGORY_COLORS.match },
      { id: 'g-lifestyle-eu', cat: 'grass', name: '生活化场景(欧美)', color: CATEGORY_COLORS.grass },
    ]
  },
  {
    name: '🎙 原生 · 中东南亚用户采访', note: '本地达人街访，UGC真实感+强CTA，东南亚拉新神器',
    items: [
      { id: 'n-interview-sea', cat: 'native', name: '用户采访(中东南亚)', color: CATEGORY_COLORS.native },
      { id: 'g-lifestyle-sea', cat: 'grass', name: '生活化场景(中东南亚)', color: CATEGORY_COLORS.grass },
      { id: 'm-local-sea', cat: 'match', name: '同城匹配(中东南亚)', color: CATEGORY_COLORS.match },
    ]
  },
];

/* ===== HISTORY ===== */
const HISTORY = [
  {
    id: 'HC-01', name: '种草+匹配+视频聊天',
    vol: '★★★★★', note: '欧美主力公式，美女种草→智能匹配→1V1视频，转化链路完整',
    parts: [
      { text: '美女推荐(欧美)', cat: 'grass', color: CATEGORY_COLORS.grass },
      { text: '智能匹配(欧美)', cat: 'match', color: CATEGORY_COLORS.match },
      { text: '视频聊天(欧美)', cat: 'onv1', color: CATEGORY_COLORS.onv1 },
    ],
    preset: 0
  },
  {
    id: 'HC-02', name: '直播美女主播+语音房',
    vol: '★★★★★', note: '东南亚直播公式，美女主播+PK+语音互动，高留存',
    parts: [
      { text: '美女主播(中东南亚)', cat: 'live', color: CATEGORY_COLORS.live },
      { text: '语音房(中东南亚)', cat: 'live', color: CATEGORY_COLORS.live },
      { text: '美女展示(中东南亚)', cat: 'realshow', color: CATEGORY_COLORS.realshow },
    ],
    preset: 1
  },
  {
    id: 'HC-03', name: 'AI推荐+同城匹配',
    vol: '★★★★', note: '东南亚AI推荐公式，智能推荐+同城定位，本土化强',
    parts: [
      { text: 'AI推荐(中东南亚)', cat: 'match', color: CATEGORY_COLORS.match },
      { text: '同城匹配(中东南亚)', cat: 'match', color: CATEGORY_COLORS.match },
      { text: '美女推荐(中东南亚)', cat: 'grass', color: CATEGORY_COLORS.grass },
    ],
    preset: 4
  },
  {
    id: 'HC-04', name: '情感共鸣+生活化场景',
    vol: '★★★★', note: '欧美剧情公式，情感共鸣+生活化，评论率高',
    parts: [
      { text: '情感共鸣(欧美)', cat: 'story', color: CATEGORY_COLORS.story },
      { text: '生活化场景(欧美)', cat: 'grass', color: CATEGORY_COLORS.grass },
      { text: '智能匹配(欧美)', cat: 'match', color: CATEGORY_COLORS.match },
    ],
    preset: 5
  },
  {
    id: 'HC-05', name: '用户采访+生活化场景',
    vol: '★★★★★', note: '东南亚原生公式，街访UGC+生活化，本土信任感最强',
    parts: [
      { text: '用户采访(中东南亚)', cat: 'native', color: CATEGORY_COLORS.native },
      { text: '生活化场景(中东南亚)', cat: 'grass', color: CATEGORY_COLORS.grass },
      { text: '同城匹配(中东南亚)', cat: 'match', color: CATEGORY_COLORS.match },
    ],
    preset: 6
  },
];

/* ===== STATE ===== */
let DATA = loadData();
let YT_DATA = loadYT();
let curCategory = 'grass', curHookId = null, selected = [], presetIdx = 0;
let currentSection = 'creative';
let editMode = false;
let undoStack = [];

/* ===== PERSISTENCE ===== */
function loadData() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
  } catch(e) {}
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}
function saveData() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(DATA)); } catch(e) {}
}
function loadYT() {
  try {
    const s = localStorage.getItem(YT_STORAGE_KEY);
    if (s) { const p = JSON.parse(s); return { ios: p.ios || [], and: p.and || [] }; }
  } catch(e) {}
  return { ios: [], and: [] };
}
function saveYT() {
  try { localStorage.setItem(YT_STORAGE_KEY, JSON.stringify(YT_DATA)); } catch(e) {}
}

/* ===== UNDO ===== */
function pushUndo() {
  undoStack.push(JSON.stringify(DATA));
  if (undoStack.length > UNDO_MAX) undoStack.shift();
  const btn = document.getElementById('undoBtn');
  if (btn) btn.disabled = false;
}
function undoLast() {
  if (!undoStack.length) return;
  DATA = JSON.parse(undoStack.pop());
  saveData();
  renderCenter();
  const btn = document.getElementById('undoBtn');
  if (btn) btn.disabled = undoStack.length === 0;
}

/* ===== THEME ===== */
function setTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  document.querySelectorAll('[data-theme-btn]').forEach(function(b) {
    b.classList.toggle('active', b.getAttribute('data-theme-btn') === theme);
  });
  try { localStorage.setItem(THEME_KEY, theme); } catch(e) {}
}
function initTheme() {
  let t = 'light';
  try { t = localStorage.getItem(THEME_KEY) || 'light'; } catch(e) {}
  setTheme(t);
}

/* ===== EDIT MODE ===== */
function toggleEditMode() {
  editMode = !editMode;
  const layout = document.getElementById('creativeSection');
  if (layout) layout.classList.toggle('edit-on', editMode);
  const btn = document.getElementById('editToggleBtn');
  if (btn) {
    btn.textContent = editMode ? '✓ 完成' : '✏️ 编辑';
    btn.classList.toggle('active', editMode);
  }
  renderCenter();
}

/* ===== EXPORT / IMPORT ===== */
function exportData() {
  const dump = { parts: DATA, yt: YT_DATA, exported: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'meto-data-' + todayStr() + '.json';
  a.click();
}
function importData() {
  document.getElementById('importFile').click();
}
function handleImport(e) {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = function(ev) {
    try {
      const d = JSON.parse(ev.target.result);
      if (d.parts) { DATA = d.parts; saveData(); }
      if (d.yt) { YT_DATA = d.yt; saveYT(); }
      alert('导入成功');
      if (currentSection === 'creative') { renderCenter(); renderRight(); }
      else renderYT();
    } catch(err) { alert('导入失败: ' + err.message); }
  };
  r.readAsText(f);
}

/* ===== SECTION SWITCHING ===== */
function switchSection(s) {
  currentSection = s;
  document.querySelectorAll('.section-tab').forEach(function(t) {
    t.classList.toggle('active', t.getAttribute('data-section') === s);
  });
  const creative = document.getElementById('creativeSection');
  const yt = document.getElementById('ytSection');
  if (s === 'creative') {
    creative.style.display = 'grid';
    yt.style.display = 'none';
    renderCenter(); renderRight();
  } else {
    creative.style.display = 'none';
    yt.style.display = 'block';
    document.getElementById('ytSectionTitle').textContent = (s === 'ios') ? '📺 IOS素材' : '📺 AND素材';
    renderYT();
  }
}

/* ===== PART META HELPERS ===== */
function findHookMeta(cat, id) {
  const catData = DATA[cat]; if (!catData) return null;
  const item = catData.items.find(function(x) { return x.id === id; });
  if (item) return { item: item, category: cat };
  return null;
}

function enrichSelectedItem(s) {
  if (s.item) return { ...s };
  const m = findHookMeta(s.cat, s.id);
  if (!m) return { ...s, cat: s.cat || '' };
  return { ...s, item: m.item };
}

/* ===== RENDER CENTER ===== */
function renderCenter() {
  const center = document.getElementById('center');
  if (!center) return;
  if (curCategory === 'history') { renderHistory(); return; }

  const catData = DATA[curCategory];
  if (!catData) return;

  // Build tabs (each item is a tab)
  const tabsHTML = catData.items.map(function(item) {
    const isActive = item.id === curHookId;
    return '<div class="layer-tab' + (isActive ? ' active' : '') + '" style="--lc:' + catData.color + '" onclick="openHook(\'' + curCategory + '\',\'' + item.id + '\')">' + escHtml(item.name) + ' <span class="region-tag ' + (item.region === '欧美' ? 'eu' : 'sea') + '" style="font-size:8px;padding:1px 4px;">' + escHtml(item.region) + '</span></div>';
  }).join('');

  // Get current hook item
  const hookItem = curHookId ? catData.items.find(function(x) { return x.id === curHookId; }) : catData.items[0];
  if (!hookItem) return;

  const color = catData.color;
  const regionClass = hookItem.region === '欧美' ? 'eu' : 'sea';

  // Stage cards HTML
  const stageCardsHTML = [
    { cls: 'before3s', label: '前3秒', desc: hookItem.stages.before3s },
    { cls: 'middle', label: '中部', desc: hookItem.stages.middle },
    { cls: 'cta', label: 'CTA', desc: hookItem.stages.cta },
  ].map(function(s) {
    return '<div class="stage-card ' + s.cls + '"><div class="stage-label ' + s.cls + '">' + s.label + '</div><div class="stage-desc">' + escHtml(s.desc) + '</div>' +
      '<div class="stage-card-edit"><button onclick="event.stopPropagation();openEditPartModal(\'' + curCategory + '\',\'' + (curHookId||'') + '\',\'' + s.cls + '\')" title="编辑此钩子">✎</button></div>' +
      '</div>';
  }).join('');

  // Tags for current hook
  const tagsHTML = hookItem.tags.map(function(t) { return '<span class="tag">' + escHtml(t) + '</span>'; }).join('');
  const potHTML = '<span class="tag pot">' + escHtml(hookItem.pot) + '</span>';

  // 同类方案：拆成同地区 + 跨地区两个 grid，避免同一零件在两处重复出现
  const hookRegion = hookItem.region || '欧美';
  const relatedItems = catData.items.filter(function(x) { return x.id !== hookItem.id && x.region === hookRegion; });
  const relatedItemsOther = catData.items.filter(function(x) { return x.id !== hookItem.id && x.region !== hookRegion; });

  const esc = function(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };

  let editActions = '';
  if (editMode) {
    editActions = '<div style="display:flex;gap:4px;margin-top:12px;">' +
      '<button class="btn" style="font-size:11px;padding:5px 12px;" onclick="openEditPartModal(\'' + curCategory + '\',\'' + hookItem.id + '\')">✎ 编辑</button>' +
      '<button class="btn" style="font-size:11px;padding:5px 12px;color:#ef4444;border-color:#ef4444;" onclick="delPart(\'' + curCategory + '\',\'' + hookItem.id + '\')">✕ 删除</button>' +
      '</div>';
  }

  // 下方"跨地区其他方案"grid（地区不同的同类零件）— 每个 grid 末尾只有一个 +
  let relatedOtherHTML = '';
  relatedOtherHTML = '<hr class="section-divider"/><div class="related-title">🌏 跨地区同类方案</div><div class="related-grid">' +
    relatedItemsOther.map(function(rel) {
      const relColor = catData.color;
      const relSel = selected.some(function(s) { return s.id === rel.id && s.cat === curCategory; });
      const relRegionClass = rel.region === '欧美' ? 'eu' : 'sea';
      return '<div class="part-card' + (relSel ? ' selected' : '') + '" style="--lc:' + relColor + '" ' +
        'onclick="toggleHookItem(\'' + curCategory + '\',\'' + rel.id + '\', \'' + relColor + '\')">' +
        '<div class="card-check">✓</div>' +
        '<div class="card-id">' + rel.id + '</div>' +
        '<div class="card-name">' + esc(rel.name) + ' <span class="region-tag ' + relRegionClass + '">' + esc(rel.region) + '</span></div>' +
        '<div class="card-desc">' + esc(rel.stages.middle) + '</div>' +
        '<div class="card-tags">' + rel.tags.map(function(t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') + '</div>' +
        (editMode ? '<div class="card-edit-actions"><button onclick="event.stopPropagation();openEditPartModal(\'' + curCategory + '\',\'' + rel.id + '\')">✎</button><button class="del" onclick="event.stopPropagation();delPart(\'' + curCategory + '\',\'' + rel.id + '\')">✕</button></div>' : '') +
        '</div>';
    }).join('') +
    '<div class="part-card-add" onclick="openAddModal(\'' + curCategory + '\', \'' + (relatedItemsOther[0] ? relatedItemsOther[0].region : '中东南亚') + '\')" title="添加新钩子方案">+</div>' +
    '</div>';

  center.innerHTML = '<div style="color:' + color + '" class="section-title">' + catData.label + '</div>' +
    '<div class="section-desc">' + esc(catData.desc) + '</div>' +
    '<div class="layer-tabs">' + tabsHTML + '</div>' +
    '<div class="stage-header">' +
      '<div class="stage-title">' + esc(hookItem.name) + '</div>' +
      '<span class="region-badge ' + regionClass + '">' + esc(hookItem.region) + '</span>' +
      '<span class="tag pot" style="margin-left:4px;">' + esc(hookItem.pot) + '</span>' +
    '</div>' +
    '<div class="stage-cards">' + stageCardsHTML + '</div>' +
    '<div class="card-tags" style="margin-bottom:16px;">' + tagsHTML + potHTML + '</div>' +
    editActions +
    '<hr class="section-divider"/>' +
    '<div class="related-title">🎬 同类可替换中部 / CTA 方案</div>' +
    '<div class="related-grid">' +
      relatedItems.map(function(rel) {
        const relColor = catData.color;
        const relSel = selected.some(function(s) { return s.id === rel.id && s.cat === curCategory; });
        const relRegionClass = rel.region === '欧美' ? 'eu' : 'sea';
        return '<div class="part-card' + (relSel ? ' selected' : '') + '" style="--lc:' + relColor + '" ' +
          'onclick="toggleHookItem(\'' + curCategory + '\',\'' + rel.id + '\', \'' + relColor + '\')">' +
          '<div class="card-check">✓</div>' +
          '<div class="card-id">' + rel.id + '</div>' +
          '<div class="card-name">' + esc(rel.name) + ' <span class="region-tag ' + relRegionClass + '">' + esc(rel.region) + '</span></div>' +
          '<div class="card-desc">' + esc(rel.stages.before3s) + '</div>' +
          '<div class="card-tags">' +
            '<span class="tag" style="color:#3b82f6;border-color:#3b82f6;">前:' + esc(rel.stages.before3s.substring(0,20)) + '…</span>' +
          '</div>' +
          (editMode ? '<div class="card-edit-actions"><button onclick="event.stopPropagation();openEditPartModal(\'' + curCategory + '\',\'' + rel.id + '\')">✎</button><button class="del" onclick="event.stopPropagation();delPart(\'' + curCategory + '\',\'' + rel.id + '\')">✕</button></div>' : '') +
          '</div>';
      }).join('') +
    '<div class="part-card-add" onclick="openAddModal(\'' + curCategory + '\', \'' + hookRegion + '\')" title="添加新钩子方案">+</div>' +
    '</div>' +
    relatedOtherHTML;
}

function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function renderHistory() {
  const center = document.getElementById('center');
  const catColorOf = function(cat) { return CATEGORY_COLORS[cat] || '#4f6ef7'; };
  center.innerHTML = '<div class="section-title">✦ 历史优秀组合</div>' +
    '<div class="section-desc">基于已验证投放数据或竞品参考的有效组合，后续随数据持续更新</div>' +
    '<div class="history-add-btn" onclick="openHistoryModal()">+ 新增组合</div>' +
    '<div class="combo-list">' +
    HISTORY.map(function(h) {
      const parts = h.parts.map(function(p, i) {
        return '<span class="cf-part" style="background:color-mix(in srgb,' + catColorOf(p.cat) + ' 15%,transparent);border:1px solid ' + catColorOf(p.cat) + ';color:' + catColorOf(p.cat) + '">' + escHtml(p.text) + '</span>' +
          (i < h.parts.length - 1 ? '<span class="cf-plus">+</span>' : '');
      }).join('');
      return '<div class="combo-card" id="hcard-' + h.id + '">' +
        '<div class="combo-header"><span class="combo-tag">' + h.id + '</span><span class="combo-name">' + escHtml(h.name) + '</span><span class="combo-vol">' + h.vol + '</span></div>' +
        '<div class="combo-formula">' + parts + '</div>' +
        '<div class="combo-note">' + escHtml(h.note) + '</div>' +
        '<span class="combo-load" onclick="loadPreset(' + h.preset + ')">↗ 载入对应参考组合</span>' +
        '<div class="combo-card-actions"><button class="combo-btn" onclick="openHistoryModal(\'' + h.id + '\')">✎ 编辑</button><button class="combo-btn del" onclick="delHistory(\'' + h.id + '\')">✕ 删除</button></div>' +
        '</div>';
    }).join('') +
    '</div>';
}

/* ===== RENDER RIGHT ===== */
function renderRight() {
  const list = document.getElementById('sel-list');
  const fBox = document.getElementById('formula-box');
  if (!list || !fBox) return;
  document.getElementById('sel-count').textContent = selected.length;

  if (!selected.length) {
    list.innerHTML = '<div class="empty-hint">选层 → 选子类 → 点卡片<br>在这里组装素材公式</div>';
    fBox.style.display = 'none';
  } else {
    list.innerHTML = selected.map(function(s, i) {
      return '<div class="sel-item">' +
        '<div class="sel-num">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<div class="sel-info"><div class="sel-name">' + escHtml(s.name) + '</div><div class="sel-sub">' + (DATA[s.cat] ? DATA[s.cat].label : s.cat) + ' · ' + s.id + '</div></div>' +
        '<div class="sel-rm" onclick="removeItem(\'' + s.id + '\')">✕</div>' +
        '</div>';
    }).join('');
    fBox.style.display = 'block';
    document.getElementById('formula-parts').innerHTML = selected.map(function(s, i) {
      const c = s.color || CATEGORY_COLORS[s.cat] || '#4f6ef7';
      return '<span class="fp" style="background:color-mix(in srgb,' + c + ' 15%,transparent);border:1px solid ' + c + ';color:' + c + '">' + escHtml(s.name) + '</span>' +
        (i < selected.length - 1 ? '<span class="fp-plus">+</span>' : '');
    }).join('');
  }
  renderPreset();
}

function renderPreset() {
  const p = PRESETS[presetIdx];
  const nameEl = document.getElementById('preset-name');
  const noteEl = document.getElementById('preset-note');
  const tagsEl = document.getElementById('preset-tags');
  const dotsEl = document.getElementById('preset-dots');
  if (!nameEl) return;
  nameEl.textContent = p.name;
  noteEl.textContent = p.note;
  tagsEl.innerHTML = p.items.map(function(item) {
    return '<span class="cf-part" style="font-size:10px;padding:3px 8px;border-radius:4px;background:color-mix(in srgb,' + item.color + ' 15%,transparent);border:1px solid ' + item.color + ';color:' + item.color + '">' + escHtml(item.name) + '</span>';
  }).join('');
  dotsEl.innerHTML = PRESETS.map(function(_, i) {
    return '<div class="preset-dot' + (i === presetIdx ? ' active' : '') + '" onclick="gotoPreset(' + i + ')"></div>';
  }).join('');
}

function nextPreset() { presetIdx = (presetIdx + 1) % PRESETS.length; renderPreset(); }
function gotoPreset(i) { presetIdx = i; renderPreset(); }
function loadCurrentPreset() { loadPreset(presetIdx); }
function loadPreset(idx) {
  const p = PRESETS[idx]; if (!p) return;
  selected = p.items.map(function(x) { return { ...x }; });
  presetIdx = idx;
  renderRight(); renderCenter();
}

/* ===== INTERACTION ===== */
function toggleHookItem(cat, id, color) {
  if (editMode) return;
  const catData = DATA[cat];
  if (!catData) return;
  const item = catData.items.find(function(x) { return x.id === id; });
  if (!item) return;
  // 同时用 id+cat 匹配，避免不同大类下相同 id 互相干扰
  const idx = selected.findIndex(function(s) { return s.id === id && s.cat === cat; });
  if (idx >= 0) {
    selected.splice(idx, 1);
  } else {
    selected.push({ id: id, cat: cat, name: item.name, color: color || CATEGORY_COLORS[cat], item: item });
  }
  renderRight(); renderCenter();
}

function toggleItem(item, cat, color) {
  if (editMode) return;
  const idx = selected.findIndex(function(s) { return s.id === item.id && s.cat === cat; });
  if (idx >= 0) selected.splice(idx, 1);
  else selected.push({ id: item.id, cat: cat, name: item.name, color: color || CATEGORY_COLORS[cat], item: item });
  renderRight(); renderCenter();
}

function removeItem(id) { selected = selected.filter(function(s) { return s.id !== id; }); renderRight(); renderCenter(); }
function clearAll() { selected = []; renderRight(); renderCenter(); }


/* ===== EDIT PART MODAL ===== */
let _editPartCtx = { cat: null, id: null };

function openEditPartModal(cat, id) {
  var catData = DATA[cat];
  if (!catData) return;
  var item = catData.items.find(function(x) { return x.id === id; });
  if (!item) return;
  _editPartCtx = { cat: cat, id: id };
  document.getElementById('ep-name').value = item.name || '';
  var rgs = document.getElementsByName('ep-region');
  for (var r = 0; r < rgs.length; r++) { rgs[r].checked = (rgs[r].value === (item.region || '欧美')); }
  document.getElementById('ep-before3s').value = item.stages.before3s || '';
  document.getElementById('ep-middle').value = item.stages.middle || '';
  document.getElementById('ep-cta').value = item.stages.cta || '';
  var pots = document.getElementsByName('ep-pot');
  for (var pr = 0; pr < pots.length; pr++) { pots[pr].checked = (pots[pr].value === (item.pot || '中')); }
  document.getElementById('edit-part-modal').classList.add('show');
  setTimeout(function() { document.getElementById('ep-name').focus(); }, 50);
}

function closeEditPartModal() {
  document.getElementById('edit-part-modal').classList.remove('show');
  _editPartCtx = { cat: null, id: null };
}

function submitEditPart() {
  var ctx = _editPartCtx;
  if (!ctx.cat || !ctx.id) return;
  var catData = DATA[ctx.cat];
  if (!catData) return;
  var item = catData.items.find(function(x) { return x.id === ctx.id; });
  if (!item) return;
  var n = document.getElementById('ep-name').value.trim();
  if (!n) { alert('请输入名称'); return; }
  var rgs = document.getElementsByName('ep-region');
  var rg = '欧美';
  for (var ri = 0; ri < rgs.length; ri++) { if (rgs[ri].checked) { rg = rgs[ri].value; break; } }
  var pots = document.getElementsByName('ep-pot');
  var pot = '中';
  for (var pi = 0; pi < pots.length; pi++) { if (pots[pi].checked) { pot = pots[pi].value; break; } }
  pushUndo();
  item.name = n;
  item.region = rg;
  item.pot = pot;
  item.stages.before3s = (document.getElementById('ep-before3s').value || '').trim();
  item.stages.middle = (document.getElementById('ep-middle').value || '').trim();
  item.stages.cta = (document.getElementById('ep-cta').value || '').trim();
  saveData();
  closeEditPartModal();
  renderCenter();
}

/* ===== EDIT / DELETE PARTS ===== */
function editPart(cat, id) {
  const catData = DATA[cat];
  if (!catData) return;
  const item = catData.items.find(function(x) { return x.id === id; });
  if (!item) return;
  const n = prompt('钩子类型名称:', item.name);
  if (n === null) return;
  pushUndo();
  item.name = n.trim();

  const b3 = prompt('前3秒内容:', item.stages.before3s);
  if (b3 !== null) item.stages.before3s = b3.trim();

  const mid = prompt('中部内容:', item.stages.middle);
  if (mid !== null) item.stages.middle = mid.trim();

  const cta = prompt('CTA内容:', item.stages.cta);
  if (cta !== null) item.stages.cta = cta.trim();

  saveData();
  renderCenter();
}

function delPart(cat, id) {
  if (!confirm('确定删除?')) return;
  pushUndo();
  const catData = DATA[cat];
  if (!catData) return;
  catData.items = catData.items.filter(function(x) { return x.id !== id; });
  saveData();
  if (curHookId === id) curHookId = catData.items.length > 0 ? catData.items[0].id : null;
  renderCenter();
}

/* ===== EDIT STAGE (前3秒/中部/CTA) ===== */
function editStage(cat, id, stageKey) {
  const catData = DATA[cat];
  if (!catData) return;
  const item = catData.items.find(function(x) { return x.id === id; });
  if (!item) return;
  const labelMap = { before3s: '前3秒', middle: '中部', cta: 'CTA' };
  const label = labelMap[stageKey] || stageKey;
  const val = prompt(label + '内容:', item.stages[stageKey] || '');
  if (val === null) return;
  pushUndo();
  item.stages[stageKey] = val.trim();
  saveData();
  renderCenter();
}

/* ===== ADD NEW HOOK (兼容旧调用，默认转 openAddModal) ===== */
function addNewHook(cat, name, region) {
  openAddModal(cat, region);
}

/* ===== ADD/EDIT CATEGORY (点左侧 + 触发，统一用弹框) ===== */
function addNewCategory(ev) {
  if (ev) { ev.stopPropagation(); ev.preventDefault(); }
  _catModalEdit = null;
  document.getElementById('cm-name').value = '';
  document.getElementById('cm-desc').value = '';
  _catModalColor = CAT_COLORS[Object.keys(DATA).length % CAT_COLORS.length];
  document.getElementById('cm-title').textContent = '新增一级分类';
  renderColorSwatches(_catModalColor);
  document.getElementById('cat-modal').classList.add('show');
  setTimeout(function() { document.getElementById('cm-name').focus(); }, 50);
}

/* ===== EXPORT COMBO ===== */
function exportCombo() {
  if (!selected.length) { alert('请先选择零件！'); return; }
  const esc = function(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
  const byCat = {};
  selected.forEach(function(s) {
    if (!byCat[s.cat]) byCat[s.cat] = [];
    byCat[s.cat].push(s);
  });

  const lines = ['Meto 素材公式', '─'.repeat(30), '已选零件：' + selected.map(function(s) { return s.name; }).join(' + '), ''];
  Object.keys(byCat).forEach(function(cat) {
    const catLabel = DATA[cat] ? DATA[cat].label : cat;
    lines.push('◆ ' + catLabel);
    byCat[cat].forEach(function(s) {
      const item = s.item || (DATA[cat] && DATA[cat].items.find(function(x) { return x.id === s.id; }));
      if (item) {
        lines.push('  · ' + item.name + ' [' + item.region + ']');
        lines.push('    前3秒: ' + (item.stages.before3s || ''));
        lines.push('    中部: ' + (item.stages.middle || ''));
        lines.push('    CTA: ' + (item.stages.cta || ''));
      } else {
        lines.push('  · ' + s.name);
      }
    });
    lines.push('');
  });

  const d = new Date();
  const pad = function(n) { return String(n).padStart(2, '0'); };
  lines.push('生成时间：' + d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()));
  const txt = lines.join('\n');
  navigator.clipboard.writeText(txt).then(function() { alert('已复制到剪贴板！'); }).catch(function() { alert(txt); });
}

/* ===== NAV INTERACTION ===== */
function openCategory(cat, el) {
  const ch = document.getElementById('children-' + cat);
  const ar = document.getElementById('arrow-' + cat);
  const isOpen = ch && ch.classList.contains('open');

  // Close all navs
  document.querySelectorAll('.nav-children').forEach(function(c) { c.classList.remove('open'); });
  document.querySelectorAll('.nav-arrow').forEach(function(a) { a.classList.remove('open'); });
  document.querySelectorAll('.nav-root').forEach(function(r) { r.classList.remove('active'); });
  document.querySelectorAll('.nav-special').forEach(function(n) { n.classList.remove('active'); });

  if (!isOpen) {
    if (ch) ch.classList.add('open');
    if (ar) ar.classList.add('open');
    if (el) el.classList.add('active');
    // Auto-select first hook
    const firstHook = DATA[cat] && DATA[cat].items[0];
    if (firstHook) openHook(cat, firstHook.id);
  } else {
    curCategory = cat;
    renderCenter();
  }
}

function openHook(cat, hookId) {
  curCategory = cat;
  curHookId = hookId;

  // Update nav active states
  document.querySelectorAll('.nav-root').forEach(function(r) { r.classList.remove('active'); });
  document.querySelectorAll('.nav-child').forEach(function(c) { c.classList.remove('active'); });
  document.querySelectorAll('.nav-special').forEach(function(n) { n.classList.remove('active'); });

  const root = document.querySelector('#nav-' + cat + ' .nav-root');
  if (root) root.classList.add('active');

  // Ensure children open
  const ch = document.getElementById('children-' + cat);
  const ar = document.getElementById('arrow-' + cat);
  if (ch) ch.classList.add('open');
  if (ar) ar.classList.add('open');

  // Highlight current child
  const catData = DATA[cat];
  if (catData) {
    const idx = catData.items.findIndex(function(x) { return x.id === hookId; });
    if (idx >= 0) {
      const children = ch && ch.querySelectorAll('.nav-child');
      if (children && children[idx]) children[idx].classList.add('active');
    }
  }

  renderCenter();
}

function showHistory() {
  curCategory = 'history';
  document.querySelectorAll('.nav-root').forEach(function(r) { r.classList.remove('active'); });
  document.querySelectorAll('.nav-child').forEach(function(c) { c.classList.remove('active'); });
  document.querySelectorAll('.nav-special').forEach(function(n) { n.classList.remove('active'); });
  const histEl = document.getElementById('nav-history');
  if (histEl) histEl.classList.add('active');
  renderCenter();
}

/* ===== YT TABLE SECTION ===== */
function todayStr() { var d = new Date(); return d.getFullYear() + '.' + (d.getMonth()+1) + '.' + d.getDate(); }
function ytidOf(d, c, u) { return btoa(encodeURIComponent((d||'')+'|'+(c||'')+'|'+(u||''))); }
function findYT(ytid) {
  var list = YT_DATA[currentSection] || [];
  for (var i = 0; i < list.length; i++) if (ytidOf(list[i].date, list[i].code, list[i].url) === ytid) return {item:list[i], idx:i};
  return null;
}
function focusYTSearch() { var i = document.getElementById('yt-search'); if (i) { i.focus(); i.scrollIntoView({behavior:'smooth',block:'center'}); } }
function copyYT(ytid, btn) {
  var r = findYT(ytid); if (!r) return;
  var ta = document.createElement('textarea'); ta.value = r.item.url || ''; document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); if (btn) { var o = btn.textContent; btn.textContent = '✓'; btn.style.background = '#10b981'; btn.style.color = '#fff'; setTimeout(function(){btn.textContent=o; btn.style.background=''; btn.style.color='';}, 1000); } } catch(e) {}
  document.body.removeChild(ta);
}
function editYT(ytid) {
  var r = findYT(ytid); if (!r) return;
  var it = r.item;
  var nm = prompt('素材名称:', it.name || ''); if (nm === null) return;
  var rg = prompt('地区 (欧美/亚洲/中东/印度):', it.region || ''); if (rg === null) return;
  var u = prompt('素材链接:', it.url || ''); if (u === null) return;
  var ts = prompt('标签 (逗号分隔):', (it.tags||[]).join(',')); if (ts === null) return;
  var d = prompt('日期 (如 2026.6.30):', it.date || ''); if (d === null) return;
  it.name = nm.trim(); it.region = rg; it.url = u.trim();
  it.tags = ts.split(/[,，\uff0c]/).map(function(s){return s.trim();}).filter(Boolean);
  it.date = d.trim();
  YT_DATA[currentSection].sort(function(a,b){return (b.date||'').localeCompare(a.date||'');});
  saveYT(); renderYT();
}
function delYT(ytid) {
  var r = findYT(ytid); if (!r) return;
  var label = r.item.name || r.item.url || '该素材';
  if (!confirm('确定删除 ' + label + '?')) return;
  YT_DATA[currentSection].splice(r.idx, 1);
  saveYT(); renderYT();
}
function saveInline(regionKey) {
  var nE = document.getElementById('yt-add-name-' + regionKey);
  var dE = document.getElementById('yt-add-date-' + regionKey);
  var uE = document.getElementById('yt-add-url-' + regionKey);
  var tE = document.getElementById('yt-add-tags-' + regionKey);
  if (!dE) return;
  var name = nE ? nE.value.trim() : '';
  var d = dE.value.trim();
  var u = uE ? uE.value.trim() : '';
  var ts = tE ? tE.value.trim() : '';
  if (!u) { alert('请输入素材链接'); if (uE) uE.focus(); return; }
  var tags = ts ? ts.split(/[,，\uff0c]/).map(function(s){return s.trim();}).filter(Boolean) : [];
  YT_DATA[currentSection].push({ date: d || todayStr(), region: regionKey, name: name, url: u, tags: tags });
  YT_DATA[currentSection].sort(function(a,b){return (b.date||'').localeCompare(a.date||'');});
  saveYT(); renderYT();
}
function saveBatch(regionKey) {
  var list = []; var today = todayStr();
  for (var i = 1; i <= 10; i++) {
    var nE = document.getElementById('yt-batch-name-' + regionKey + '-' + i);
    var rE = document.getElementById('yt-batch-region-' + regionKey + '-' + i);
    var uE = document.getElementById('yt-batch-url-' + regionKey + '-' + i);
    var tE = document.getElementById('yt-batch-tags-' + regionKey + '-' + i);
    var name = nE ? nE.value.trim() : '';
    var rg = rE ? rE.value : '';
    var u = uE ? uE.value.trim() : '';
    var ts = tE ? tE.value.trim() : '';
    if (!u) continue;
    var tags = ts ? ts.split(/[,，\uff0c]/).map(function(s){return s.trim();}).filter(Boolean) : [];
    list.push({ date: today, region: rg, name: name, url: u, tags: tags });
  }
  if (!list.length) { alert('请至少填写一条素材的链接'); return; }
  list.forEach(function(it) { YT_DATA[currentSection].push(it); });
  YT_DATA[currentSection].sort(function(a,b){return (b.date||'').localeCompare(a.date||'');});
  saveYT(); renderYT();
  alert('已保存 ' + list.length + ' 条');
}
function renderYT() {
  var body = document.getElementById('ytBody');
  if (!body) return;
  var filter = (document.getElementById('yt-region-filter') || {}).value || '全部';
  var search = ((document.getElementById('yt-search') || {}).value || '').toLowerCase().trim();
  var dateStart = (document.getElementById('yt-date-start') || {}).value || '';
  var dateEnd = (document.getElementById('yt-date-end') || {}).value || '';
  var list = YT_DATA[currentSection] || [];
  var items = list.filter(function(it) {
    if (filter !== '全部' && it.region !== filter) return false;
    if (dateStart && it.date && it.date < dateStart) return false;
    if (dateEnd && it.date && it.date > dateEnd) return false;
    if (search) {
      var n = (it.name || '').toLowerCase();
      var u = (it.url || '').toLowerCase();
      var t = (it.tags || []).join(' ').toLowerCase();
      var d = (it.date || '').toLowerCase();
      if (n.indexOf(search) === -1 && u.indexOf(search) === -1 && t.indexOf(search) === -1 && d.indexOf(search) === -1) return false;
    }
    return true;
  });
  var countEl = document.getElementById('yt-count');
  if (countEl) countEl.textContent = '共 ' + items.length + '/' + list.length + ' 条';

  if (!list.length) {
    body.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-text">暂无数据，请添加第一条素材</div><div class="empty-state-actions"><button class="empty-state-btn primary" onclick="openAddYTModal()">➕ 添加素材</button><button class="empty-state-btn secondary" onclick="openBatchYTModal()">📋 批量新增 10 条</button></div></div>';
    return;
  }
  if (!items.length) {
    body.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔍</div><div class="empty-state-text">无匹配数据</div><div class="empty-state-actions"><button class="empty-state-btn secondary" onclick="document.getElementById(\'yt-search\').value=\'\';renderYT()">清空搜索</button></div></div>';
    return;
  }

  // 分地区 → 分日期二级分组
  var grouped = {};
  var regionOrder = ['欧美','亚洲','中东','印度','?'];
  items.forEach(function(it) {
    var rg = it.region || '?';
    var dk = it.date || '?';
    if (!grouped[rg]) grouped[rg] = {};
    if (!grouped[rg][dk]) grouped[rg][dk] = [];
    grouped[rg][dk].push(it);
  });
  var html = '';
  regionOrder.forEach(function(rg) {
    if (!grouped[rg] || !Object.keys(grouped[rg]).length) return;
    var dateKeys = Object.keys(grouped[rg]).sort().reverse();
    var rc = 0; dateKeys.forEach(function(dk){ rc += grouped[rg][dk].length; });
    var rgColor = {'欧美':'#3b82f6','亚洲':'#ec4899','中东':'#f59e0b','印度':'#8b5cf6','?':'#6b7280'}[rg] || '#6b7280';

    html += '<div class="month-block">';
    html += '  <div class="month-header">▼ ' + rg + '<span class="month-count" style="background:' + rgColor + ';color:#fff;padding:1px 7px;border-radius:10px;margin-left:8px;font-size:11px">' + rc + ' 条</span></div>';
    html += '  <table class="yt"><thead><tr>';
    html += '<th style="width:110px">日期</th>';
    html += '<th style="width:90px">地区</th>';
    html += '<th>名称</th>';
    html += '<th>链接</th>';
    html += '<th style="width:100px">标签</th>';
    html += '<th style="width:130px">操作</th>';
    html += '</tr></thead><tbody>';

    dateKeys.forEach(function(dk) {
      var rows = grouped[rg][dk];
      rows.forEach(function(it, idx) {
        var ytid = ytidOf(it.date, it.code, it.url);
        html += '<tr>';
        if (idx === 0) html += '<td class="date-cell" rowspan="' + rows.length + '">' + dk + '</td>';
        html += '<td><span class="region-cell">' + esc(it.region || '') + '</span></td>';
        html += '<td>' + esc(it.name || '') + '</td>';
        html += '<td class="url-cell"><a href="' + esc(it.url || '#') + '" target="_blank" rel="noopener">' + esc((it.url || '').substring(0, 80)) + ((it.url || '').length > 80 ? '…' : '') + '</a></td>';
        html += '<td>' + esc((it.tags || []).join(', ')) + '</td>';
        html += '<td class="action-cell">';
        html += '<button data-yt-action="copy" data-ytid="' + ytid + '">📋</button>';
        html += '<button data-yt-action="edit" data-ytid="' + ytid + '">✎</button>';
        html += '<button class="del" data-yt-action="del" data-ytid="' + ytid + '">✕</button>';
        html += '</td></tr>';
      });
    });
    html += '</tbody></table>';

    html += '<div class="add-row">';
    html += '<input type="text" id="yt-add-name-' + rg + '" placeholder="素材名称 (如 V1755宣传片)" style="width:160px" />';
    html += '<input type="text" id="yt-add-date-' + rg + '" placeholder="日期 (如 2026.6.30)" value="' + todayStr() + '" style="width:120px" />';
    html += '<input type="text" id="yt-add-url-' + rg + '" placeholder="素材链接" style="flex:1;min-width:180px" />';
    html += '<input type="text" id="yt-add-tags-' + rg + '" placeholder="标签 (逗号分隔)" style="width:110px" />';
    html += '<button onclick="saveInline(\'' + rg + '\')">保存</button>';
    html += '</div>';

    html += '<div class="batch-trigger" onclick="toggleBatch(\'' + rg + '\')">+ 批量新增 10 条素材</div>';
    html += '<div class="batch-form" id="yt-batch-' + rg + '" style="display:none">';
    html += '<div class="batch-hint">⚠ 留空的行不会保存。地区默认「' + rg + '」，日期默认今天。</div>';
    html += '<div class="batch-col-labels"><span>#</span><span>名称</span><span>地区</span><span>链接</span><span>标签</span></div>';
    for (var i = 1; i <= 10; i++) {
      html += '<div class="batch-row">';
      html += '<span class="num">' + i + '.</span>';
      html += '<input type="text" id="yt-batch-name-' + rg + '-' + i + '" placeholder="名称" />';
      html += '<select id="yt-batch-region-' + rg + '-' + i + '"><option value="' + rg + '">' + rg + '</option><option value="">—</option><option value="欧美">欧美</option><option value="亚洲">亚洲</option><option value="中东">中东</option><option value="印度">印度</option></select>';
      html += '<input type="text" class="url" id="yt-batch-url-' + rg + '-' + i + '" placeholder="https://..." />';
      html += '<input type="text" class="tags" id="yt-batch-tags-' + rg + '-' + i + '" placeholder="标签" />';
      html += '</div>';
    }
    html += '<div class="batch-actions">';
    html += '<button class="save" onclick="saveBatch(\'' + rg + '\')">💾 一键保存全部 (10 条)</button>';
    html += '<button class="cancel" onclick="toggleBatch(\'' + rg + '\')">取消</button>';
    html += '</div></div>';

    html += '</div>';
  });
  body.innerHTML = html;
}
function toggleBatch(mk) {
  var f = document.getElementById('yt-batch-' + mk);
  if (f) f.style.display = (f.style.display === 'none') ? 'block' : 'none';
}
function esc(s) { return String(s).replace(/[&<>"']/g, function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }

/* YT action button delegation */
document.addEventListener('click', function(e) {
  var btn = e.target.closest && e.target.closest('[data-yt-action]');
  if (!btn) return;
  e.preventDefault();
  var a = btn.getAttribute('data-yt-action');
  var y = btn.getAttribute('data-ytid');
  if (a === 'copy') copyYT(y, btn);
  else if (a === 'edit') editYT(y);
  else if (a === 'del') delYT(y);
});

/* ===== ADD YT MODAL ===== */
function clearDateFilter() {
  var s = document.getElementById('yt-date-start');
  var e = document.getElementById('yt-date-end');
  if (s) s.value = '';
  if (e) e.value = '';
  renderYT();
}
function openAddYTModal() {
  var m = document.getElementById('addYTModal');
  if (!m) return;
  var dateEl = document.getElementById('add-yt-date');
  if (dateEl) dateEl.value = todayStr();
  ['add-yt-name','add-yt-url','add-yt-tags'].forEach(function(id){
    var e = document.getElementById(id); if (e) e.value = '';
  });
  m.style.display = 'flex';
  setTimeout(function(){ var n = document.getElementById('add-yt-name'); if (n) n.focus(); }, 50);
}
function closeAddYTModal() {
  var m = document.getElementById('addYTModal');
  if (m) m.style.display = 'none';
}
function submitAddYT() {
  var name = (document.getElementById('add-yt-name').value || '').trim();
  var url = (document.getElementById('add-yt-url').value || '').trim();
  var region = document.getElementById('add-yt-region').value;
  var date = (document.getElementById('add-yt-date').value || '').trim();
  var tagsStr = (document.getElementById('add-yt-tags').value || '').trim();
  if (!url) { alert('请输入素材链接'); document.getElementById('add-yt-url').focus(); return; }
  if (!date) { alert('请输入日期'); document.getElementById('add-yt-date').focus(); return; }
  var tags = tagsStr ? tagsStr.split(/[,，\uff0c]/).map(function(s){return s.trim();}).filter(Boolean) : [];
  YT_DATA[currentSection].push({ date: date, region: region, name: name, url: url, tags: tags });
  YT_DATA[currentSection].sort(function(a,b){return (b.date||'').localeCompare(a.date||'');});
  saveYT(); renderYT();
  closeAddYTModal();
}

/* ===== BATCH YT MODAL ===== */
function openBatchYTModal() {
  var m = document.getElementById('batchYTModal');
  var rowsEl = document.getElementById('batch-yt-rows');
  if (!m || !rowsEl) return;
  var html = '';
  for (var i = 1; i <= 10; i++) {
    html += '<div style="display:grid;grid-template-columns:30px 1fr 80px 2fr 130px;gap:6px;margin-bottom:6px;align-items:center">';
    html += '<span style="font-size:11px;color:var(--muted);text-align:center">' + i + '.</span>';
    html += '<input type="text" id="batch-yt-name-' + i + '" placeholder="名称（可选）" style="padding:5px 8px;background:var(--card);color:var(--text);border:1px solid var(--border);border-radius:3px;font-size:11px" />';
    html += '<select id="batch-yt-region-' + i + '" style="padding:5px 8px;background:var(--card);color:var(--text);border:1px solid var(--border);border-radius:3px;font-size:11px"><option value="欧美">欧美</option><option value="亚洲">亚洲</option><option value="中东">中东</option><option value="印度">印度</option></select>';
    html += '<input type="text" id="batch-yt-url-' + i + '" placeholder="https://..." style="padding:5px 8px;background:var(--card);color:var(--text);border:1px solid var(--border);border-radius:3px;font-size:11px" />';
    html += '<input type="text" id="batch-yt-tags-' + i + '" placeholder="标签" style="padding:5px 8px;background:var(--card);color:var(--text);border:1px solid var(--border);border-radius:3px;font-size:11px" />';
    html += '</div>';
  }
  rowsEl.innerHTML = html;
  m.style.display = 'flex';
}
function closeBatchYTModal() {
  var m = document.getElementById('batchYTModal');
  if (m) m.style.display = 'none';
}
function submitBatchYT() {
  var today = todayStr();
  var list = [];
  for (var i = 1; i <= 10; i++) {
    var nE = document.getElementById('batch-yt-name-' + i);
    var rE = document.getElementById('batch-yt-region-' + i);
    var uE = document.getElementById('batch-yt-url-' + i);
    var tE = document.getElementById('batch-yt-tags-' + i);
    var name = nE ? nE.value.trim() : '';
    var region = rE ? rE.value : '欧美';
    var url = uE ? uE.value.trim() : '';
    var tagsStr = tE ? tE.value.trim() : '';
    if (!url) continue;
    var tags = tagsStr ? tagsStr.split(/[,，\uff0c]/).map(function(s){return s.trim();}).filter(Boolean) : [];
    list.push({ date: today, region: region, name: name, url: url, tags: tags });
  }
  if (!list.length) { alert('请至少填写一条素材的链接'); return; }
  list.forEach(function(it) { YT_DATA[currentSection].push(it); });
  YT_DATA[currentSection].sort(function(a,b){return (b.date||'').localeCompare(a.date||'');});
  saveYT(); renderYT();
  closeBatchYTModal();
  alert('已保存 ' + list.length + ' 条素材');
}

// ESC closes modals
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeAddYTModal();
    closeBatchYTModal();
  }
});

/* ===== INIT ===== */
initTheme();
switchSection('creative');
</script>

<!-- ===== Modal 弹框：添加新钩子方案 ===== -->
<div id="add-modal" class="modal-overlay" onclick="if(event.target===this)closeAddModal()">
  <div class="modal-card" onclick="event.stopPropagation()">
    <div class="modal-header">
      <div class="modal-title">添加新钩子方案</div>
      <button class="modal-close" onclick="closeAddModal()" title="关闭">×</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <label>名称 <span class="required">*</span></label>
        <input id="mf-name" type="text" placeholder="例：美女推荐 / 视频聊天 / 智能匹配"/>
      </div>
      <div class="form-row">
        <label>标签 <span style="color:var(--muted);font-weight:400;text-transform:none;">(回车添加，点击 × 删除)</span></label>
        <div id="mf-tags" class="tag-input-wrapper">
          <input id="mf-tag-input" type="text" placeholder="输入标签后回车..."/>
        </div>
      </div>
      <div class="form-row">
        <label>地区</label>
        <div class="radio-group">
          <label><input type="radio" name="mf-region" value="欧美" checked> 欧美</label>
          <label><input type="radio" name="mf-region" value="中东南亚"> 中东南亚</label>
        </div>
      </div>
      <div class="form-row">
        <label>前 3 秒</label>
        <textarea id="mf-before3s" rows="2" placeholder="例：美女真人出镜 + 惊讶表情 + 'OMG' 字幕"></textarea>
      </div>
      <div class="form-row">
        <label>中部</label>
        <textarea id="mf-middle" rows="2" placeholder="例：产品演示 + 核心卖点 + 真人体验"></textarea>
      </div>
      <div class="form-row">
        <label>CTA</label>
        <textarea id="mf-cta" rows="2" placeholder="例：下载免费 / 立即体验 / 点击了解"></textarea>
      </div>
      <div class="form-row">
        <label>潜力等级</label>
        <div class="radio-group">
          <label><input type="radio" name="mf-pot" value="高"> 高</label>
          <label><input type="radio" name="mf-pot" value="中" checked> 中</label>
          <label><input type="radio" name="mf-pot" value="低"> 低</label>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn" onclick="closeAddModal()">取消</button>
      <button class="btn btn-primary" onclick="submitAddHook()">保存</button>
    </div>
  </div>
</div>

<!-- ===== Modal: 编辑钩子方案 ===== -->
<div id="edit-part-modal" class="modal-overlay" onclick="if(event.target===this)closeEditPartModal()">
  <div class="modal-card" onclick="event.stopPropagation()">
    <div class="modal-header">
      <div class="modal-title">编辑钩子方案</div>
      <button class="modal-close" onclick="closeEditPartModal()" title="关闭">×</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <label>名称 <span class="required">*</span></label>
        <input id="ep-name" type="text" placeholder="例：美女推荐 / 视频聊天"/>
      </div>
      <div class="form-row">
        <label>地区</label>
        <div class="radio-group">
          <label><input type="radio" name="ep-region" value="欧美"> 欧美</label>
          <label><input type="radio" name="ep-region" value="中东南亚"> 中东南亚</label>
        </div>
      </div>
      <div class="form-row">
        <label>前 3 秒</label>
        <textarea id="ep-before3s" rows="2" placeholder="例：美女真人出镜 + 惊讶表情 + 'OMG' 字幕"></textarea>
      </div>
      <div class="form-row">
        <label>中部</label>
        <textarea id="ep-middle" rows="2" placeholder="例：产品演示 + 核心卖点 + 真人体验"></textarea>
      </div>
      <div class="form-row">
        <label>CTA</label>
        <textarea id="ep-cta" rows="2" placeholder="例：下载免费 / 立即体验 / 点击了解"></textarea>
      </div>
      <div class="form-row">
        <label>潜力等级</label>
        <div class="radio-group">
          <label><input type="radio" name="ep-pot" value="高"> 高</label>
          <label><input type="radio" name="ep-pot" value="中"> 中</label>
          <label><input type="radio" name="ep-pot" value="低"> 低</label>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn" onclick="closeEditPartModal()">取消</button>
      <button class="btn btn-primary" onclick="submitEditPart()">保存</button>
    </div>
  </div>
</div>

<!-- ===== Modal: 新增/编辑一级分类 ===== -->
<div id="cat-modal" class="modal-overlay" onclick="if(event.target===this)closeCatModal()">
  <div class="modal-card" onclick="event.stopPropagation()">
    <div class="modal-header">
      <div class="modal-title" id="cm-title">新增一级分类</div>
      <button class="modal-close" onclick="closeCatModal()" title="关闭">×</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <label>分类名称 <span class="required">*</span></label>
        <input id="cm-name" type="text" placeholder="例：种草 / 直播 / 1V1 / 匹配"/>
      </div>
      <div class="form-row">
        <label>描述（可选）</label>
        <input id="cm-desc" type="text" placeholder="简单描述这个分类的用途"/>
      </div>
      <div class="form-row">
        <label>颜色</label>
        <div class="color-swatches" id="color-swatches"></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn" onclick="closeCatModal()">取消</button>
      <button class="btn btn-primary" onclick="submitCatModal()">保存</button>
    </div>
  </div>
</div>

<!-- ===== Modal: 新增/编辑历史优秀组合 ===== -->
<div id="history-modal" class="modal-overlay" onclick="if(event.target===this)closeHistoryModal()">
  <div class="modal-card" style="max-width:600px;max-height:90vh;overflow-y:auto;" onclick="event.stopPropagation()">
    <div class="modal-header">
      <div class="modal-title" id="hm-title">新增历史组合</div>
      <button class="modal-close" onclick="closeHistoryModal()" title="关闭">×</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <label>组合名称 <span class="required">*</span></label>
        <input id="hm-name" type="text" placeholder="例：种草+匹配+视频聊天"/>
      </div>
      <div class="form-row">
        <label>ID 编号</label>
        <input id="hm-id" type="text" placeholder="自动生成（如 HC-06），可手动修改"/>
      </div>
      <div class="form-row">
        <label>星级</label>
        <div class="radio-group">
          <label><input type="radio" name="hm-vol" value="★★★★★" checked> ★★★★★</label>
          <label><input type="radio" name="hm-vol" value="★★★★"> ★★★★</label>
          <label><input type="radio" name="hm-vol" value="★★★"> ★★★</label>
          <label><input type="radio" name="hm-vol" value="★★"> ★★</label>
        </div>
      </div>
      <div class="form-row">
        <label>说明</label>
        <textarea id="hm-note" rows="2" placeholder="简要说明这个组合的特点和适用场景"></textarea>
      </div>
      <div class="form-row">
        <label>选择零件（点击添加，最多 3 个）</label>
        <div class="part-picker-grid" id="hm-picker-grid"></div>
        <div class="part-picker-selected" id="hm-selected-parts">
          <span class="part-picker-hint">点击上方零件添加</span>
        </div>
      </div>
      <div class="form-row">
        <label>对应预设组合（可选）</label>
        <select id="hm-preset" style="width:100%;padding:8px 10px;border-radius:6px;border:1px solid var(--border);background:var(--card);color:var(--text);font-size:13px;">
          <option value="">— 无对应预设 —</option>
          <option value="0">🌸 种草·欧美美女推荐</option>
          <option value="1">🔥 直播·中东南亚美女主播</option>
          <option value="2">📹 1V1·欧美视频聊天</option>
          <option value="3">⚡ 匹配·AI推荐欧美</option>
          <option value="4">📸 真实展示·中东南亚美女</option>
          <option value="5">🎭 剧情·情感共鸣欧美</option>
          <option value="6">🎙 原生·中东南亚用户采访</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn" onclick="closeHistoryModal()">取消</button>
      <button class="btn btn-primary" onclick="submitHistoryModal()">保存</button>
    </div>
  </div>
</div>

<script>
/* ===== Modal: 新增/编辑一级分类 ===== */
const CAT_COLORS = ['#ec4899','#f97316','#8b5cf6','#3b82f6','#10b981','#ef4444','#06b6d4','#a855f7','#f59e0b','#14b8a6','#e879f9','#fb923c'];
let _catModalEdit = null;
let _catModalColor = '#ec4899';

function renderColorSwatches(selected) {
  var wrap = document.getElementById('color-swatches');
  if (!wrap) return;
  wrap.innerHTML = CAT_COLORS.map(function(c) {
    return '<div class="color-swatch' + (c === selected ? ' selected' : '') + '" style="background:' + c + '" data-color="' + c + '" title="' + c + '"></div>';
  }).join('');
  wrap.querySelectorAll('.color-swatch').forEach(function(el) {
    el.onclick = function() { _catModalColor = el.getAttribute('data-color'); renderColorSwatches(_catModalColor); };
  });
}

function openCatModal(key) {
  _catModalEdit = key || null;
  if (key && DATA[key]) {
    document.getElementById('cm-title').textContent = '编辑一级分类';
    document.getElementById('cm-name').value = DATA[key].label || '';
    document.getElementById('cm-desc').value = DATA[key].desc || '';
    _catModalColor = DATA[key].color || CAT_COLORS[0];
  } else {
    document.getElementById('cm-title').textContent = '新增一级分类';
    document.getElementById('cm-name').value = '';
    document.getElementById('cm-desc').value = '';
    _catModalColor = CAT_COLORS[Object.keys(DATA).length % CAT_COLORS.length];
  }
  renderColorSwatches(_catModalColor);
  document.getElementById('cat-modal').classList.add('show');
  setTimeout(function() { document.getElementById('cm-name').focus(); }, 50);
}

function closeCatModal() { document.getElementById('cat-modal').classList.remove('show'); }

function submitCatModal() {
  var name = document.getElementById('cm-name').value.trim();
  if (!name) { alert('请填写分类名称'); return; }
  var desc = document.getElementById('cm-desc').value.trim();
  var color = _catModalColor;
  var key;
  if (_catModalEdit && DATA[_catModalEdit]) {
    key = _catModalEdit;
    pushUndo();
    DATA[key].label = name;
    DATA[key].desc = desc || name + ' 创意大类';
    DATA[key].color = color;
    CATEGORY_COLORS[key] = color;
    saveData();
    closeCatModal();
    return;
  }
  key = name.trim().toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-').substring(0, 16) || ('cat' + Date.now());
  if (DATA[key]) { alert('已存在同名分类：' + name); return; }
  pushUndo();
  DATA[key] = { label: name, color: color, desc: desc || name + ' 创意大类', items: [] };
  CATEGORY_COLORS[key] = color;
  var leftPanel = document.querySelector('.left-panel');
  if (leftPanel) {
    var navDiv = document.createElement('div');
    navDiv.className = 'nav-category';
    navDiv.id = 'nav-' + key;
    navDiv.innerHTML = '<div class="nav-root" style="--lc:' + color + '" onclick="openCategory(\'' + key + '\',this)">' +
      '<div class="nav-dot" style="background:' + color + '"></div>' +
      escHtml(name) + ' <span class="nav-arrow" id="arrow-' + key + '">▶</span>' +
      '<span class="nav-add" onclick="event.stopPropagation();addNewCategory(event)" title="新增一级标签">+</span>' +
      '</div><div class="nav-children" id="children-' + key + '"></div>';
    var histEl = document.getElementById('nav-history');
    if (histEl) leftPanel.insertBefore(navDiv, histEl);
    else leftPanel.appendChild(navDiv);
  }
  saveData();
  closeCatModal();
  openCategory(key, null);
}

/* ===== Modal: 新增/编辑历史优秀组合 ===== */
let _histCtx = { editId: null, parts: [] };

function openHistoryModal(editId) {
  _histCtx = { editId: editId || null, parts: [] };
  if (editId) {
    var h = HISTORY.find(function(x) { return x.id === editId; });
    if (h) {
      document.getElementById('hm-title').textContent = '编辑历史组合';
      document.getElementById('hm-name').value = h.name || '';
      document.getElementById('hm-id').value = h.id || '';
      document.getElementById('hm-note').value = h.note || '';
      var volRs = document.getElementsByName('hm-vol');
      for (var i = 0; i < volRs.length; i++) volRs[i].checked = (volRs[i].value === h.vol);
      document.getElementById('hm-preset').value = (h.preset != null) ? String(h.preset) : '';
      _histCtx.parts = h.parts.map(function(p) { return { text: p.text, cat: p.cat, color: p.color || CATEGORY_COLORS[p.cat] }; });
    }
  } else {
    document.getElementById('hm-title').textContent = '新增历史组合';
    document.getElementById('hm-name').value = '';
    document.getElementById('hm-id').value = '';
    document.getElementById('hm-note').value = '';
    var volRs2 = document.getElementsByName('hm-vol');
    for (var j = 0; j < volRs2.length; j++) volRs2[j].checked = (volRs2[j].value === '★★★★★');
    document.getElementById('hm-preset').value = '';
  }
  renderPartPicker();
  renderHistSelectedParts();
  document.getElementById('history-modal').classList.add('show');
}

function closeHistoryModal() { document.getElementById('history-modal').classList.remove('show'); }

function renderPartPicker() {
  var grid = document.getElementById('hm-picker-grid');
  if (!grid) return;
  var cats = Object.keys(DATA);
  var html = '';
  cats.forEach(function(cat) {
    var catData = DATA[cat];
    if (!catData || !catData.items) return;
    var seenNames = {};
    catData.items.forEach(function(item) {
      // 去除同分类下同名重复零件（如 AI推荐 欧美/中东南亚只保留一条）
      if (seenNames[item.name]) return;
      seenNames[item.name] = true;
      var color = CATEGORY_COLORS[cat] || '#4f6ef7';
      var sel = _histCtx.parts.some(function(p) { return p.text === item.name && p.cat === cat; });
      html += '<div class="part-picker-item' + (sel ? ' sel' : '') + '" data-cat="' + escHtml(cat) + '" data-name="' + escHtml(item.name) + '" data-color="' + escHtml(color) + '">' +
        '<div class="part-picker-dot" style="background:' + color + '"></div>' +
        escHtml(item.name) + ' <span style="font-size:9px;color:var(--muted);">(' + escHtml(catData.label || cat) + ')</span></div>';
    });
  });
  grid.innerHTML = html;
  grid.querySelectorAll('.part-picker-item').forEach(function(el) {
    el.onclick = function() {
      var cat = el.getAttribute('data-cat');
      var name = el.getAttribute('data-name');
      var color = el.getAttribute('data-color');
      var existIdx = _histCtx.parts.findIndex(function(p) { return p.text === name && p.cat === cat; });
      if (existIdx >= 0) {
        _histCtx.parts.splice(existIdx, 1);
      } else {
        if (_histCtx.parts.length >= 3) { alert('最多选择 3 个零件'); return; }
        _histCtx.parts.push({ text: name, cat: cat, color: color });
      }
      renderPartPicker();
      renderHistSelectedParts();
    };
  });
}

function renderHistSelectedParts() {
  var wrap = document.getElementById('hm-selected-parts');
  if (!wrap) return;
  if (!_histCtx.parts.length) { wrap.innerHTML = '<span class="part-picker-hint">点击上方零件添加</span>'; return; }
  var html = '';
  _histCtx.parts.forEach(function(p, i) {
    html += '<div class="chip" style="background:color-mix(in srgb,' + p.color + ' 15%,transparent);border:1px solid ' + p.color + ';color:' + p.color + '">' +
      escHtml(p.text) + ' <span onclick="hmRemovePart(' + i + ')">×</span></div>';
  });
  wrap.innerHTML = html;
}

function hmRemovePart(idx) { _histCtx.parts.splice(idx, 1); renderPartPicker(); renderHistSelectedParts(); }

function submitHistoryModal() {
  var name = document.getElementById('hm-name').value.trim();
  if (!name) { alert('请填写组合名称'); return; }
  var id = document.getElementById('hm-id').value.trim();
  var volR = document.querySelector('input[name="hm-vol"]:checked');
  var vol = volR ? volR.value : '★★★★★';
  var note = document.getElementById('hm-note').value.trim();
  var presetVal = document.getElementById('hm-preset').value;
  var preset = presetVal !== '' ? parseInt(presetVal, 10) : null;
  if (!_histCtx.parts.length) { alert('请至少选择 1 个零件'); return; }
  if (!id) {
    var num = HISTORY.length + 1;
    id = 'HC-' + String(num).padStart(2, '0');
    while (HISTORY.some(function(h) { return h.id === id; })) id = 'HC-' + String(++num).padStart(2, '0');
  }
  var newEntry = { id: id, name: name, vol: vol, note: note, parts: _histCtx.parts.slice(), preset: preset };
  if (_histCtx.editId) {
    var idx = HISTORY.findIndex(function(h) { return h.id === _histCtx.editId; });
    if (idx >= 0) HISTORY[idx] = newEntry;
  } else {
    HISTORY.push(newEntry);
  }
  saveData();
  closeHistoryModal();
  if (curCategory === 'history') renderCenter();
}

function delHistory(id) {
  if (!confirm('确认删除组合 [' + id + ']？')) return;
  var idx = HISTORY.findIndex(function(h) { return h.id === id; });
  if (idx >= 0) HISTORY.splice(idx, 1);
  saveData();
  renderCenter();
}

/* ===== Modal: 添加新钩子 ===== */
let _addModalCtx = { cat: null, defaultRegion: '欧美', tags: [] };

function openAddModal(cat, defaultRegion) {
  _addModalCtx = { cat: cat, defaultRegion: defaultRegion || '欧美', tags: [] };
  // reset form
  document.getElementById('mf-name').value = '';
  document.getElementById('mf-before3s').value = '';
  document.getElementById('mf-middle').value = '';
  document.getElementById('mf-cta').value = '';
  renderAddModalTags();
  // default region
  const radios = document.getElementsByName('mf-region');
  for (const r of radios) r.checked = (r.value === (defaultRegion || '欧美'));
  document.getElementById('add-modal').classList.add('show');
  setTimeout(function() { document.getElementById('mf-name').focus(); }, 50);
}

function closeAddModal() {
  document.getElementById('add-modal').classList.remove('show');
  _addModalCtx = { cat: null, defaultRegion: '欧美', tags: [] };
}

function renderAddModalTags() {
  const wrap = document.getElementById('mf-tags');
  // remove all chips but keep input
  Array.from(wrap.querySelectorAll('.tag-chip')).forEach(function(el) { el.remove(); });
  _addModalCtx.tags.forEach(function(t, i) {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.innerHTML = escHtml(t) + ' <span class="x" data-i="' + i + '">×</span>';
    wrap.insertBefore(chip, document.getElementById('mf-tag-input'));
  });
  // bind x clicks
  Array.from(wrap.querySelectorAll('.tag-chip .x')).forEach(function(x) {
    x.onclick = function() {
      const idx = parseInt(x.getAttribute('data-i'), 10);
      _addModalCtx.tags.splice(idx, 1);
      renderAddModalTags();
    };
  });
}

// tag input: enter to add (modal already in DOM — script runs after body)
(function() {
  const tagInput = document.getElementById('mf-tag-input');
  if (tagInput) {
    tagInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const v = tagInput.value.trim();
        if (v && _addModalCtx.tags.indexOf(v) < 0) {
          _addModalCtx.tags.push(v);
          renderAddModalTags();
        }
        tagInput.value = '';
      }
    });
  }
})();

function submitAddHook() {
  const cat = _addModalCtx.cat;
  if (!cat) { closeAddModal(); return; }
  const name = document.getElementById('mf-name').value.trim();
  if (!name) { alert('请填写名称'); return; }
  const before3s = document.getElementById('mf-before3s').value.trim();
  const middle = document.getElementById('mf-middle').value.trim();
  const cta = document.getElementById('mf-cta').value.trim();
  const regionRadio = document.querySelector('input[name="mf-region"]:checked');
  const region = regionRadio ? regionRadio.value : '欧美';
  const potRadio = document.querySelector('input[name="mf-pot"]:checked');
  const pot = potRadio ? potRadio.value : '中';
  const tags = _addModalCtx.tags.slice();

  const catData = DATA[cat];
  if (!catData) { closeAddModal(); return; }
  // generate unique id
  const slug = name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-').toLowerCase().substring(0, 12) || 'item';
  const regSuffix = region === '欧美' ? 'eu' : 'sea';
  const baseId = cat + '-' + slug + '-' + regSuffix;
  let newId = baseId; let n2 = 1;
  while (catData.items.some(function(x) { return x.id === newId; })) { newId = baseId + '-' + (++n2); }
  pushUndo();
  catData.items.push({
    id: newId,
    name: name,
    region: region,
    stages: { before3s: before3s, middle: middle, cta: cta },
    tags: tags.length ? tags : ['新'],
    pot: pot
  });
  saveData();
  curHookId = newId;
  closeAddModal();
  renderCenter();
  // 同时刷新左侧导航（新增的零件属于当前 cat）
  const leftPanel = document.querySelector('.left-panel');
  if (leftPanel) { /* 保持当前 cat 展开 */ }
}

// ESC 键关闭所有弹框
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeAddModal(); closeCatModal(); closeHistoryModal(); }
});
</script>