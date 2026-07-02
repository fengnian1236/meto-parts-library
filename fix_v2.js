const fs = require('fs');
const { execSync } = require('child_process');
const path = 'C:\\Users\\daiji\\meto-parts-library\\index.html';
const git = 'D:\\Qclaw\\v0.2.30.594\\resources\\git\\bin\\git.exe';

// Restore
execSync(git + ' checkout -- index.html', { cwd: 'C:\\Users\\daiji\\meto-parts-library', stdio: 'pipe' });
let content = fs.readFileSync(path, 'utf8');
console.log('Restored, length:', content.length);

// ================================================================
// Helper
// ================================================================
function replaceAll(c, oldStr, newStr) {
    let count = 0;
    while (c.includes(oldStr)) {
        c = c.replace(oldStr, newStr);
        count++;
    }
    return { content: c, count };
}

// ================================================================
// 1. CSS
// ================================================================
const oldCSS = '.stage-card-edit { position: absolute; top: 4px; right: 4px; display: none; gap: 2px; }\r\n  .edit-on .stage-card-edit { display: flex; }';
const newCSS = '.stage-card-edit { position: absolute; top: 4px; right: 4px; display: flex; gap: 2px; }';
let r = replaceAll(content, oldCSS, newCSS);
if (r.count > 0) { content = r.content; console.log('[1] CSS OK (' + r.count + ')'); }
else {
    r = replaceAll(content, oldCSS.replace(/\r\n/g, '\n'), newCSS.replace(/\r\n/g, '\n'));
    if (r.count > 0) { content = r.content; console.log('[1] CSS OK LF (' + r.count + ')'); }
    else console.log('[1] CSS skip');
}

// ================================================================
// 2. Modal HTML
// ================================================================
const modalHTML = '<!-- ===== Modal: 编辑钩子方案 ===== -->\n<div id="edit-part-modal" class="modal-overlay" onclick="if(event.target===this)closeEditPartModal()">\n  <div class="modal-card" onclick="event.stopPropagation()">\n    <div class="modal-header">\n      <div class="modal-title">编辑钩子方案</div>\n      <button class="modal-close" onclick="closeEditPartModal()" title="关闭">×</button>\n    </div>\n    <div class="modal-body">\n      <div class="form-row">\n        <label>名称 <span class="required">*</span></label>\n        <input id="ep-name" type="text" placeholder="例：美女推荐 / 视频聊天"/>\n      </div>\n      <div class="form-row">\n        <label>地区</label>\n        <div class="radio-group">\n          <label><input type="radio" name="ep-region" value="欧美"> 欧美</label>\n          <label><input type="radio" name="ep-region" value="中东南亚"> 中东南亚</label>\n        </div>\n      </div>\n      <div class="form-row">\n        <label>前 3 秒</label>\n        <textarea id="ep-before3s" rows="2" placeholder="例：美女真人出镜 + 惊讶表情 + 'OMG' 字幕"></textarea>\n      </div>\n      <div class="form-row">\n        <label>中部</label>\n        <textarea id="ep-middle" rows="2" placeholder="例：产品演示 + 核心卖点 + 真人体验"></textarea>\n      </div>\n      <div class="form-row">\n        <label>CTA</label>\n        <textarea id="ep-cta" rows="2" placeholder="例：下载免费 / 立即体验 / 点击了解"></textarea>\n      </div>\n      <div class="form-row">\n        <label>潜力等级</label>\n        <div class="radio-group">\n          <label><input type="radio" name="ep-pot" value="高"> 高</label>\n          <label><input type="radio" name="ep-pot" value="中"> 中</label>\n          <label><input type="radio" name="ep-pot" value="低"> 低</label>\n        </div>\n      </div>\n    </div>\n    <div class="modal-footer">\n      <button class="btn" onclick="closeEditPartModal()">取消</button>\n      <button class="btn btn-primary" onclick="submitEditPart()">保存</button>\n    </div>\n  </div>\n</div>\n\n<!-- ===== Modal: 新增/编辑一级分类 ===== -->';
if (content.includes('<!-- ===== Modal: 新增/编辑一级分类 ===== -->')) {
    content = content.replace('<!-- ===== Modal: 新增/编辑一级分类 ===== -->', modalHTML);
    console.log('[2] Modal inserted');
} else console.log('[2] Modal marker missing');

// ================================================================
// 3. Extract EXACT strings from file and build replacements
// ================================================================

// --- Stage card button ---
// The file has: onclick="event.stopPropagation();editStage(\'' + curCategory + '\',\'' + (curHookId||'') + '\',\'' + s.cls + '\')" title="编辑此项">✎</button>
// Let's extract it
const stageOnStart = content.indexOf('onclick="event.stopPropagation();editStage');
const stageBtnEnd = content.indexOf('">✎</button>', stageOnStart);
if (stageOnStart >= 0 && stageBtnEnd >= 0) {
    const oldStageAttr = content.substring(stageOnStart, stageBtnEnd + 11);
    // Build new: replace function name + params + title
    // oldStageAttr looks like: event.stopPropagation();editStage(\'' + curCategory + '\',\'' + (curHookId||'') + '\',\'' + s.cls + '\')
    // Find the function call part (after the semicolon)
    const funcStart = oldStageAttr.indexOf('editStage');
    const funcEnd = oldStageAttr.lastIndexOf('")"');
    const beforeFunc = oldStageAttr.substring(0, funcStart);
    const afterFunc = oldStageAttr.substring(funcEnd + 3);
    const oldFuncCall = oldStageAttr.substring(funcStart, funcEnd + 3);
    const newFuncCall = oldFuncCall
        .split('editStage')[1]  // remove function name
        .replace(/^\(\\'\\'' \+ curCategory \\+ '\\'\\'',\\'\\'' \+ \(curHookId\|\|'\\''\) \\+ '\\'\\'',\\'\\'' \+ s\.cls \\+ '\\'\\''\)$/, 
                 '(\'\\'' + curCategory + '\\'\\',\\'\\'' + (curHookId||\'\') + '\\'\\')')
        .replace('title="编辑此项"', 'title="编辑此钩子"');
    
    // Actually let me just do string manipulation
    const newStageAttr = beforeFunc + 'openEditPartModal' + 
        (oldFuncCall.startsWith('(??') ? '' : '') +
        oldFuncCall
            .replace(/^\(\\'\\'' \+ curCategory \\+ '\\'\\'',\\'\\'' \+ \(curHookId\|\|'\\''\) \\+ '\\'\\'',\\'\\'' \+ s\.cls \\+ '\\'\\''\)$/,
                     '(\'\\'' + curCategory + '\\'\\',\\'\\'' + (curHookId||\'\') + '\\'\\')')
            .replace('title="编辑此项"', 'title="编辑此钩子"');
    
    // Simpler: just replace the specific parts
    let newStageAttr2 = oldStageAttr
        .replace('editStage(\'\\'' + curCategory + \'\\',\'\\'' + (curHookId||\'\') + \'\\',\'\\'' + s.cls + \'\\'',
                 'openEditPartModal(\'\\'' + curCategory + \'\\',\'\\'' + (curHookId||\'\') + \'\\'')
        .replace('title="编辑此项"', 'title="编辑此钩子"');
    
    if (oldStageAttr !== newStageAttr2) {
        r = replaceAll(content, oldStageAttr, newStageAttr2);
        content = r.content;
        console.log('[3] Stage button OK (' + r.count + ')');
    } else {
        console.log('[3] Stage attr unchanged');
        console.log('[3] oldStageAttr:', JSON.stringify(oldStageAttr));
    }
} else console.log('[3] Stage button not found');

// --- Hook item button ---
const hookStart = content.indexOf('onclick="editPart(\'\\'' + curCategory + \'\\',\'\\'' + hookItem.id + \'\\')">✎ 编辑</button>');
if (hookStart >= 0) {
    const hookEnd = content.indexOf('">✎ 编辑</button>', hookStart);
    const oldHookAttr = content.substring(hookStart, hookEnd + 17);
    const newHookAttr = oldHookAttr
        .replace('editPart(\'\\'' + curCategory + \'\\',\'\\'' + hookItem.id + \'\\'',
                 'openEditPartModal(\'\\'' + curCategory + \'\\',\'\\'' + hookItem.id + \'\\'');
    if (oldHookAttr !== newHookAttr) {
        r = replaceAll(content, oldHookAttr, newHookAttr);
        content = r.content;
        console.log('[4] Hook button OK (' + r.count + ')');
    } else console.log('[4] Hook attr unchanged');
} else console.log('[4] Hook button not found');

// --- Related card buttons ---
const relOld = 'editPart(\'\\'' + curCategory + \'\\',\'\\'' + rel.id + \'\\')">✕</button>';
let relCount = 0;
while (content.includes(relOld)) {
    r = replaceAll(content, relOld, 
        "openEditPartModal(\\'\\'' + curCategory + '\\'\\',\\'\\'' + rel.id + '\\'\\')">✕</button>");
    content = r.content;
    relCount += r.count;
}
console.log('[5] Rel buttons:', relCount);

// ================================================================
// 6. JS Functions
// ================================================================
const js = `
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
    content = content.replace(m6, js + m6);
    console.log('[6] JS inserted');
} else {
    const alt = '/* ===== DELETE PARTS ===== */';
    if (content.includes(alt)) {
        content = content.replace(alt, js + alt);
        console.log('[6] JS at DELETE PARTS');
    } else console.log('[6] No JS insert point');
}

// Write
const bomB = Buffer.from([0xEF, 0xBB, 0xBF]);
const newContent = Buffer.concat([bomB, Buffer.from(content, 'utf8')]);
fs.writeFileSync(path, newContent);
console.log('\nWritten:', newContent.length, 'bytes');

// Verify
const v = fs.readFileSync(path, 'utf8');
console.log('openEditPartModal:', (v.match(/openEditPartModal/g)||[]).length);
console.log('editStage onclick:', (v.match(/onclick.*editStage/g)||[]).length);
console.log('edit-part-modal:', v.includes('id="edit-part-modal"'));
console.log('submitEditPart:', v.includes('function submitEditPart()'));
