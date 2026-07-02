const fs = require('fs');
const { execSync } = require('child_process');
const git = 'D:\\Qclaw\\v0.2.30.594\\resources\\git\\bin\\git.exe';
const path = 'C:\\Users\\daiji\\meto-parts-library\\index.html';

execSync(git + ' checkout -- index.html', { cwd: 'C:\\Users\\daiji\\meto-parts-library', stdio: 'pipe' });
let content = fs.readFileSync(path, 'utf8');

function ra(c, old, neu) {
    let cnt = 0;
    while (c.includes(old)) { c = c.replace(old, neu); cnt++; }
    return { content: c, count: cnt };
}

// 1. CSS
const oldCSS = '.stage-card-edit { position: absolute; top: 4px; right: 4px; display: none; gap: 2px; }\r\n  .edit-on .stage-card-edit { display: flex; }';
const newCSS = '.stage-card-edit { position: absolute; top: 4px; right: 4px; display: flex; gap: 2px; }';
let r = ra(content, oldCSS, newCSS);
if (r.count > 0) { content = r.content; console.log('[1] CSS OK (' + r.count + ')'); }
else {
    r = ra(content, oldCSS.replace(/\r\n/g, '\n'), newCSS.replace(/\r\n/g, '\n'));
    if (r.count > 0) { content = r.content; console.log('[1] CSS OK LF'); }
    else console.log('[1] CSS skip');
}

// 2. Modal HTML
const mhtml = '<!-- ===== Modal: 新增/编辑一级分类 ===== -->';
if (content.includes(mhtml)) {
    const insert = `<!-- ===== Modal: 编辑钩子方案 ===== -->
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

` + mhtml;
    content = content.split(mhtml).join(insert);
    console.log('[2] Modal inserted');
}

// 3. Stage card button - correct positions from debug_bytes.js:
// Positions: 80='+', 81=' ', 82=''', 83='\', 84=''', 85=',', 86='\', 87=''', 88=''', 89=' ', 90='+', 91=' ', 92='s', 93='.', 94='c', 95='l', 96='s', 97=' ', 98='+', 99=' ', 100=''', 101='\', 102=''', 103=')', 104='"', ...
// s.cls is at 92-96
// s.cls param: \' + s.cls + \' = positions 86-102
// Comma before s.cls: 85
// Need to remove comma(85) through closing ' of s.cls param(102)
// beforeCls = 0..85 (exclude comma, include \ at 86)
// afterClsPart = 103.. (start after the closing ') of s.cls param)
const si = content.indexOf('event.stopPropagation();editStage');
if (si >= 0) {
    const btnEnd = content.indexOf('">✎</button>', si);
    if (btnEnd >= 0) {
        const oldStage = content.substring(si, btnEnd + 11);
        // Remove s.cls param: comma(85) through closing ' of s.cls(102)
        const beforeCls = oldStage.substring(0, 85); // up to but NOT including comma
        const afterClsPart = oldStage.substring(103); // skip the closing ' of s.cls param
        const newStageRaw = beforeCls + afterClsPart;
        const newStage = newStageRaw
            .replace('editStage(', 'openEditPartModal(')
            .replace('title="编辑此项"', 'title="编辑此钩子"');
        
        r = ra(content, oldStage, newStage);
        content = r.content;
        console.log('[3] Stage button (' + r.count + ')');
        console.log('[3]   new ends:', JSON.stringify(newStage.substring(newStage.length - 40)));
    }
}

// 4. Hook item button
const hi = content.indexOf("hookItem.id + '");
if (hi >= 0) {
    let hStart = hi;
    while (hStart > 0 && !content.substring(hStart - 10, hStart).endsWith('onclick="')) hStart--;
    const hEnd = content.indexOf('">✎ 编辑</button>', hi);
    if (hEnd >= 0) {
        const oldHook = content.substring(hStart, hEnd + 17);
        const newHook = oldHook.replace('editPart(', 'openEditPartModal(');
        r = ra(content, oldHook, newHook);
        content = r.content;
        console.log('[4] Hook button (' + r.count + ')');
    }
}

// 5. Related card buttons
let relCount = 0;
let ri = content.indexOf("rel.id + '");
while (ri >= 0) {
    let rStart = ri;
    while (rStart > 0 && !content.substring(rStart - 10, rStart).endsWith("editPart(")) rStart--;
    const rEnd = content.indexOf('">✕</button>', ri);
    if (rEnd >= 0) {
        const oldRel = content.substring(rStart, rEnd + 11);
        const newRel = oldRel.replace('editPart(', 'openEditPartModal(');
        const res = ra(content, oldRel, newRel);
        content = res.content;
        relCount += res.count;
    }
    ri = content.indexOf("rel.id + '", ri + 1);
}
console.log('[5] Related (' + relCount + ')');

// 6. JS Functions
const jsFn = `
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

`;

const m6 = '/* ===== EDIT / DELETE PARTS ===== */';
if (content.includes(m6)) {
    content = content.split(m6).join(jsFn + m6);
    console.log('[6] JS inserted');
} else {
    const alt = '/* ===== DELETE PARTS ===== */';
    if (content.includes(alt)) {
        content = content.split(alt).join(jsFn + alt);
        console.log('[6] JS at alt');
    } else console.log('[6] No insert point');
}

// Write with BOM
const bom = Buffer.from([0xEF, 0xBB, 0xBF]);
const newC = Buffer.concat([bom, Buffer.from(content, 'utf8')]);
fs.writeFileSync(path, newC);
console.log('\nWritten:', newC.length, 'bytes');

// Verify
const v = fs.readFileSync(path, 'utf8');
const openCnt = (v.match(/openEditPartModal/g)||[]).length;
const stageOnclick = (v.match(/onclick[^>]*editStage/g)||[]).length;
const editPartDef = (v.match(/function editPart\(/g)||[]).length;
const stageIdx = v.indexOf('event.stopPropagation();openEditPartModal');
const stageHasCls = stageIdx >= 0 && v.substring(stageIdx, stageIdx + 200).includes('s.cls');
const newBtnCorrect = stageIdx >= 0 && v.substring(stageIdx, stageIdx + 200).endsWith('\')" title="编辑此钩子">✎</button');
console.log('\nVerify:');
console.log('  openEditPartModal:', openCnt);
console.log('  editStage onclick:', stageOnclick, '(should be 0)');
console.log('  editPart fn def:', editPartDef, '(should be 1)');
console.log('  Stage btn s.cls:', stageHasCls, '(should be false)');
console.log('  New btn ends correctly:', newBtnCorrect);
console.log('  edit-part-modal id:', v.includes('id="edit-part-modal"'));
console.log('  submitEditPart:', v.includes('function submitEditPart()'));
