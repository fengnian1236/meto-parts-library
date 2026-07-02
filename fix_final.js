const fs = require('fs');
const { execSync } = require('child_process');
const path = 'C:\\Users\\daiji\\meto-parts-library\\index.html';
const git = 'D:\\Qclaw\\v0.2.30.594\\resources\\git\\bin\\git.exe';

// Restore from git first
execSync(git + ' checkout -- index.html', { cwd: 'C:\\Users\\daiji\\meto-parts-library', stdio: 'pipe' });
let content = fs.readFileSync(path, 'utf8');
console.log('Restored, length:', content.length);

// ================================================================
// HELPER: Replace ALL occurrences using exact strings
// ================================================================
function replaceAll(content, oldStr, newStr) {
    if (!content.includes(oldStr)) return { content, count: 0 };
    let result = content, count = 0;
    while (result.includes(oldStr)) {
        result = result.replace(oldStr, newStr);
        count++;
    }
    return { content: result, count };
}

// ================================================================
// 1. CSS: Make stage-card-edit always visible
// ================================================================
const cssOld = '.stage-card-edit { position: absolute; top: 4px; right: 4px; display: none; gap: 2px; }\r\n  .edit-on .stage-card-edit { display: flex; }';
const cssNew = '.stage-card-edit { position: absolute; top: 4px; right: 4px; display: flex; gap: 2px; }';
let r = replaceAll(content, cssOld, cssNew);
if (r.count > 0) { content = r.content; console.log('[1] CSS OK'); }
else {
    r = replaceAll(content, cssOld.replace(/\r\n/g, '\n'), cssNew.replace(/\r\n/g, '\n'));
    if (r.count > 0) { content = r.content; console.log('[1] CSS OK (LF)'); }
    else console.log('[1] CSS skip');
}

// ================================================================
// 2. HTML: Insert edit-part modal
// ================================================================
const modalHTML = '<!-- ===== Modal: 编辑钩子方案 ===== -->\n<div id="edit-part-modal" class="modal-overlay" onclick="if(event.target===this)closeEditPartModal()">\n  <div class="modal-card" onclick="event.stopPropagation()">\n    <div class="modal-header">\n      <div class="modal-title">编辑钩子方案</div>\n      <button class="modal-close" onclick="closeEditPartModal()" title="关闭">×</button>\n    </div>\n    <div class="modal-body">\n      <div class="form-row">\n        <label>名称 <span class="required">*</span></label>\n        <input id="ep-name" type="text" placeholder="例：美女推荐 / 视频聊天"/>\n      </div>\n      <div class="form-row">\n        <label>地区</label>\n        <div class="radio-group">\n          <label><input type="radio" name="ep-region" value="欧美"> 欧美</label>\n          <label><input type="radio" name="ep-region" value="中东南亚"> 中东南亚</label>\n        </div>\n      </div>\n      <div class="form-row">\n        <label>前 3 秒</label>\n        <textarea id="ep-before3s" rows="2" placeholder="例：美女真人出镜 + 惊讶表情 + 'OMG' 字幕"></textarea>\n      </div>\n      <div class="form-row">\n        <label>中部</label>\n        <textarea id="ep-middle" rows="2" placeholder="例：产品演示 + 核心卖点 + 真人体验"></textarea>\n      </div>\n      <div class="form-row">\n        <label>CTA</label>\n        <textarea id="ep-cta" rows="2" placeholder="例：下载免费 / 立即体验 / 点击了解"></textarea>\n      </div>\n      <div class="form-row">\n        <label>潜力等级</label>\n        <div class="radio-group">\n          <label><input type="radio" name="ep-pot" value="高"> 高</label>\n          <label><input type="radio" name="ep-pot" value="中"> 中</label>\n          <label><input type="radio" name="ep-pot" value="低"> 低</label>\n        </div>\n      </div>\n    </div>\n    <div class="modal-footer">\n      <button class="btn" onclick="closeEditPartModal()">取消</button>\n      <button class="btn btn-primary" onclick="submitEditPart()">保存</button>\n    </div>\n  </div>\n</div>\n\n<!-- ===== Modal: 新增/编辑一级分类 ===== -->';
if (content.includes('<!-- ===== Modal: 新增/编辑一级分类 ===== -->')) {
    content = content.replace('<!-- ===== Modal: 新增/编辑一级分类 ===== -->', modalHTML);
    console.log('[2] Modal HTML inserted');
} else console.log('[2] Modal marker missing');

// ================================================================
// 3. STAGE CARD BUTTON: Extract exact string from file, then replace
// ================================================================
// Find the exact onclick= button
const stageOnIdx = content.indexOf('onclick="event.stopPropagation();editStage');
if (stageOnIdx >= 0) {
    const btnEnd = content.indexOf('">✎</button>', stageOnIdx);
    if (btnEnd >= 0) {
        const oldStage = content.substring(stageOnIdx, btnEnd + 11);
        // Build new version: change function name, remove s.cls param, change title
        // The old pattern: event.stopPropagation();editStage(\'' + curCategory + '\',\'' + (curHookId||'') + '\',\'' + s.cls + '\')
        // New: event.stopPropagation();openEditPartModal(\'' + curCategory + '\',\'' + (curHookId||'') + '\')
        let newStage = oldStage
            .split("event.stopPropagation();editStage(\\'\\'' + curCategory + '\\'\\',\\'\\'' + (curHookId||'\\'') + '\\'\\',\\'\\'' + s.cls + '\\'\\'')")
            .join("event.stopPropagation();openEditPartModal(\\'\\'' + curCategory + '\\'\\',\\'\\'' + (curHookId||'\\'') + '\\'\\'')")
            .split('title="编辑此项"').join('title="编辑此钩子"');
        if (oldStage !== newStage) {
            r = replaceAll(content, oldStage, newStage);
            content = r.content;
            console.log('[3] Stage button replaced (' + r.count + 'x)');
        } else {
            console.log('[3] Stage: split failed, oldStage=' + JSON.stringify(oldStage));
        }
    }
} else console.log('[3] Stage button not found');

// ================================================================
// 4. HOOK ITEM EDIT BUTTON: Extract and replace
// ================================================================
const hookIdx = content.indexOf('onclick="editPart(\'\\'' + curCategory + \'\\',\'\\'' + hookItem.id + \'\\')">✎ 编辑</button>');
if (hookIdx >= 0) {
    const btnEnd = content.indexOf('">✎ 编辑</button>', hookIdx);
    const oldHook = content.substring(hookIdx, btnEnd + 17);
    let newHook = oldHook
        .split("editPart(\\'\\'' + curCategory + '\\'\\',\\'\\'' + hookItem.id + '\\'\\'')")
        .join("openEditPartModal(\\'\\'' + curCategory + '\\'\\',\\'\\'' + hookItem.id + '\\'\\'')");
    if (oldHook !== newHook) {
        r = replaceAll(content, oldHook, newHook);
        content = r.content;
        console.log('[4] Hook button replaced (' + r.count + 'x)');
    } else console.log('[4] Hook split failed');
} else console.log('[4] Hook button not found');

// ================================================================
// 5. RELATED CARD EDIT BUTTONS: Extract and replace
// ================================================================
const relSearch = 'editPart(\'\\'' + curCategory + \'\\',\'\\'' + rel.id + \'\\')">✕</button>';
let relCount = 0;
while (content.includes(relSearch)) {
    r = replaceAll(content, relSearch, 
        "openEditPartModal(\\'\\'' + curCategory + '\\'\\',\\'\\'' + rel.id + '\\'\\')">✕</button>");
    content = r.content;
    relCount += r.count;
}
console.log('[5] Related buttons replaced:', relCount, 'occurrences');

// ================================================================
// 6. JS FUNCTIONS
// ================================================================
const jsFunctions = `
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

const marker = '/* ===== EDIT / DELETE PARTS ===== */';
if (content.includes(marker)) {
    content = content.replace(marker, jsFunctions + marker);
    console.log('[6] JS functions inserted');
} else {
    const alt = '/* ===== DELETE PARTS ===== */';
    if (content.includes(alt)) {
        content = content.replace(alt, jsFunctions + alt);
        console.log('[6] JS inserted at DELETE PARTS');
    } else console.log('[6] No JS insert point');
}

// ================================================================
// Write
// ================================================================
const bom = Buffer.from([0xEF, 0xBB, 0xBF]);
const newContent = Buffer.concat([bom, Buffer.from(content, 'utf8')]);
fs.writeFileSync(path, newContent);
console.log('\nWritten:', newContent.length, 'bytes');

// Verify
const v = fs.readFileSync(path, 'utf8');
const openCount = (v.match(/openEditPartModal/g)||[]).length;
const editStageCount = (v.match(/editStage/g)||[]).length;
const editPartCount = (v.match(/editPart/g)||[]).length;
console.log('\n--- Verify ---');
console.log('openEditPartModal calls:', openCount);
console.log('editStage calls remaining:', editStageCount, '(should be 0 in onclick)');
console.log('editPart function def count:', editPartCount, '(should be 1)');
console.log('edit-part-modal id:', v.includes('id="edit-part-modal"'));
console.log('submitEditPart:', v.includes('function submitEditPart()'));
console.log('closeEditPartModal:', v.includes('function closeEditPartModal()'));
console.log('_editPartCtx:', v.includes('_editPartCtx'));
