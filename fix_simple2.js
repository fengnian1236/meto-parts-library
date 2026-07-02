const fs = require('fs');
const { execSync } = require('child_process');
const git = 'D:\\Qclaw\\v0.2.30.594\\resources\\git\\bin\\git.exe';
const path = 'C:\\Users\\daiji\\meto-parts-library\\index.html';

// Restore
execSync(git + ' checkout -- index.html', { cwd: 'C:\\Users\\daiji\\meto-parts-library', stdio: 'pipe' });
let content = fs.readFileSync(path, 'utf8');
console.log('Restored, length:', content.length);

// ================================================================
// Helper
// ================================================================
function ra(c, old, neu) {
    let cnt = 0;
    while (c.includes(old)) { c = c.replace(old, neu); cnt++; }
    return { content: c, count: cnt };
}

// ================================================================
// 1. CSS
// ================================================================
const oldCSS = '.stage-card-edit { position: absolute; top: 4px; right: 4px; display: none; gap: 2px; }\r\n  .edit-on .stage-card-edit { display: flex; }';
const newCSS = '.stage-card-edit { position: absolute; top: 4px; right: 4px; display: flex; gap: 2px; }';
let r = ra(content, oldCSS, newCSS);
if (r.count > 0) { content = r.content; console.log('[1] CSS OK (' + r.count + ')'); }
else {
    r = ra(content, oldCSS.replace(/\r\n/g, '\n'), newCSS.replace(/\r\n/g, '\n'));
    if (r.count > 0) { content = r.content; console.log('[1] CSS OK LF'); }
    else console.log('[1] CSS skip');
}

// ================================================================
// 2. Modal HTML
// ================================================================
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

// ================================================================
// 3-5. Extract exact strings from file and replace
// ================================================================

// --- Stage card button ---
const si = content.indexOf('event.stopPropagation();editStage');
if (si >= 0) {
    const btnEnd = content.indexOf('">✎</button>', si);
    if (btnEnd >= 0) {
        const oldStage = content.substring(si, btnEnd + 11);
        // Build new version: change function name, remove s.cls param, change title
        // Strategy: replace "editStage" -> "openEditPartModal", remove "s.cls" param, change title
        // Extract: editStage( [cat], [curHookId], [s.cls] )
        // New: openEditPartModal( [cat], [curHookId] )
        const withoutCls = oldStage
            .replace('editStage(', 'openEditPartModal(')
            .replace(",'\\'' + s.cls + '\\''", '');
        const newStage = withoutCls.replace('title="编辑此项"', 'title="编辑此钩子"');
        if (oldStage !== newStage) {
            r = ra(content, oldStage, newStage);
            content = r.content;
            console.log('[3] Stage button (' + r.count + ')');
        } else console.log('[3] Stage button unchanged');
    }
}

// --- Hook item button ---
// Find: onclick="editPart('\' + curCategory + '\',\'' + hookItem.id + '\')">✎ 编辑</button>
// We need to find it without knowing exact escaping - use indexOf
const hi = content.indexOf("hookItem.id + '");
if (hi >= 0) {
    // Walk back to onclick="
    let hookStart = hi;
    while (hookStart > 0 && !content.substring(hookStart - 10, hookStart + 1).endsWith('onclick="')) hookStart--;
    const hookEnd = content.indexOf('">✎ 编辑</button>', hi);
    if (hookEnd >= 0 && hookStart >= 0) {
        const oldHook = content.substring(hookStart, hookEnd + 17);
        const newHook = oldHook.replace('editPart(', 'openEditPartModal(');
        if (oldHook !== newHook) {
            r = ra(content, oldHook, newHook);
            content = r.content;
            console.log('[4] Hook button (' + r.count + ')');
        } else console.log('[4] Hook button unchanged');
    }
}

// --- Related card buttons ---
let relCount = 0;
let relIdx = content.indexOf("rel.id + '");
while (relIdx >= 0) {
    let relStart = relIdx;
    while (relStart > 0 && !content.substring(relStart - 10, relStart + 1).endsWith("editPart(")) relStart--;
    const relEnd = content.indexOf('">✕</button>', relIdx);
    if (relEnd >= 0 && relStart >= 0) {
        const oldRel = content.substring(relStart, relEnd + 11);
        const newRel = oldRel.replace('editPart(', 'openEditPartModal(');
        if (oldRel !== newRel) {
            const { content: c2, count: cnt } = ra(content, oldRel, newRel);
            content = c2;
            relCount += cnt;
        }
    }
    relIdx = content.indexOf("rel.id + '", relIdx + 1);
}
console.log('[5] Related buttons (' + relCount + ')');

// ================================================================
// 6. JS Functions
// ================================================================
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
const stageOn = (v.match(/onclick[^>]*editStage/g)||[]).length;
const editPartDef = (v.match(/function editPart\(/g)||[]).length;
console.log('\nVerify:');
console.log('  openEditPartModal:', openCnt);
console.log('  editStage onclick:', stageOn, '(should be 0)');
console.log('  editPart fn def:', editPartDef, '(should be 1)');
console.log('  edit-part-modal id:', v.includes('id="edit-part-modal"'));
console.log('  submitEditPart fn:', v.includes('function submitEditPart()'));
console.log('  closeEditPartModal fn:', v.includes('function closeEditPartModal()'));
