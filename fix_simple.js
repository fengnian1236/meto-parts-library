const fs = require('fs');
const { execSync } = require('child_process');
const path = 'C:\\Users\\daiji\\meto-parts-library\\index.html';
const git = 'D:\\Qclaw\\v0.2.30.594\\resources\\git\\bin\\git.exe';

// Restore
execSync(git + ' checkout -- index.html', { cwd: 'C:\\Users\\daiji\\meto-parts-library', stdio: 'pipe' });
let content = fs.readFileSync(path, 'utf8');
console.log('Restored, length:', content.length);

// ================================================================
// 1. CSS
// ================================================================
const oldCSS = '.stage-card-edit { position: absolute; top: 4px; right: 4px; display: none; gap: 2px; }\r\n  .edit-on .stage-card-edit { display: flex; }';
const newCSS = '.stage-card-edit { position: absolute; top: 4px; right: 4px; display: flex; gap: 2px; }';
let count = 0;
if (content.includes(oldCSS)) {
    content = content.split(oldCSS).join(newCSS);
    console.log('[1] CSS OK');
} else {
    const lf = oldCSS.replace(/\r\n/g, '\n');
    if (content.includes(lf)) {
        content = content.split(lf).join(newCSS.replace(/\r\n/g, '\n'));
        console.log('[1] CSS OK (LF)');
    } else console.log('[1] CSS skip');
}

// ================================================================
// 2. Modal HTML
// ================================================================
const mhtml = '<!-- ===== Modal: 新增/编辑一级分类 ===== -->';
if (content.includes(mhtml)) {
    const insert = '<!-- ===== Modal: 编辑钩子方案 ===== -->\n<div id="edit-part-modal" class="modal-overlay" onclick="if(event.target===this)closeEditPartModal()">\n  <div class="modal-card" onclick="event.stopPropagation()">\n    <div class="modal-header">\n      <div class="modal-title">编辑钩子方案</div>\n      <button class="modal-close" onclick="closeEditPartModal()" title="关闭">×</button>\n    </div>\n    <div class="modal-body">\n      <div class="form-row">\n        <label>名称 <span class="required">*</span></label>\n        <input id="ep-name" type="text" placeholder="例：美女推荐 / 视频聊天"/>\n      </div>\n      <div class="form-row">\n        <label>地区</label>\n        <div class="radio-group">\n          <label><input type="radio" name="ep-region" value="欧美"> 欧美</label>\n          <label><input type="radio" name="ep-region" value="中东南亚"> 中东南亚</label>\n        </div>\n      </div>\n      <div class="form-row">\n        <label>前 3 秒</label>\n        <textarea id="ep-before3s" rows="2" placeholder="例：美女真人出镜 + 惊讶表情 + \'OMG\' 字幕"></textarea>\n      </div>\n      <div class="form-row">\n        <label>中部</label>\n        <textarea id="ep-middle" rows="2" placeholder="例：产品演示 + 核心卖点 + 真人体验"></textarea>\n      </div>\n      <div class="form-row">\n        <label>CTA</label>\n        <textarea id="ep-cta" rows="2" placeholder="例：下载免费 / 立即体验 / 点击了解"></textarea>\n      </div>\n      <div class="form-row">\n        <label>潜力等级</label>\n        <div class="radio-group">\n          <label><input type="radio" name="ep-pot" value="高"> 高</label>\n          <label><input type="radio" name="ep-pot" value="中"> 中</label>\n          <label><input type="radio" name="ep-pot" value="低"> 低</label>\n        </div>\n      </div>\n    </div>\n    <div class="modal-footer">\n      <button class="btn" onclick="closeEditPartModal()">取消</button>\n      <button class="btn btn-primary" onclick="submitEditPart()">保存</button>\n    </div>\n  </div>\n</div>\n\n' + mhtml;
    content = content.split(mhtml).join(insert);
    console.log('[2] Modal inserted');
}

// ================================================================
// 3. Stage card button - EXTRACT from file, then replace
// ================================================================
const si = content.indexOf('event.stopPropagation();editStage');
if (si >= 0) {
    // Extract the exact onclick= button text from file
    const btnEnd = content.indexOf('">✎</button>', si);
    if (btnEnd >= 0) {
        const oldBtn = content.substring(si, btnEnd + 11);
        // Replace the function call: editStage(...) -> openEditPartModal(...)
        // The old: editStage(\'' + curCategory + '\',\'' + (curHookId||'') + '\',\'' + s.cls + '\')
        // New: openEditPartModal(\'' + curCategory + '\',\'' + (curHookId||'') + '\')
        // Build from the extracted string by simple substitution
        let newBtn = oldBtn
            .split('editStage').join('openEditPartModal')
            .split('s.cls').join('')
            .replace(/,\s*'\)$/, "')")  // remove trailing ,\') pattern
            .replace('title="编辑此项"').join('title="编辑此钩子"');
        // Fix double )) issue from removing s.cls param
        newBtn = newBtn.replace("||'')','')", "||'')");
        newBtn = newBtn.replace("||'') || '')", "||'')");
        
        if (oldBtn !== newBtn) {
            content = content.split(oldBtn).join(newBtn);
            console.log('[3] Stage button OK');
            console.log('[3]   old:', JSON.stringify(oldBtn));
            console.log('[3]   new:', JSON.stringify(newBtn));
        } else {
            console.log('[3] Stage unchanged, trying manual fix...');
            // Find the function parameters and fix manually
            const p1 = "editStage(\\'\\'' + curCategory + '\\'\\',\\'\\'' + (curHookId||'\\'') + '\\'\\',\\'\\'' + s.cls + '\\'\\'";
            const p2 = "openEditPartModal(\\'\\'' + curCategory + '\\'\\',\\'\\'' + (curHookId||'\\'') + '\\'\\'";
            if (content.includes(p1)) {
                content = content.split(p1).join(p2);
                content = content.split('title="编辑此项"').join('title="编辑此钩子"');
                console.log('[3] Stage fixed with p1');
            } else console.log('[3] p1 not found');
        }
    }
}

// ================================================================
// 4. Hook item button
// ================================================================
const hi = content.indexOf('editPart(\'\\'' + curCategory + \'\\',\'\\'' + hookItem.id + \'\\')">✎ 编辑</button>');
if (hi >= 0) {
    const he = content.indexOf('">✎ 编辑</button>', hi);
    const oldHook = content.substring(hi, he + 17);
    const newHook = oldHook.split('editPart').join('openEditPartModal');
    if (oldHook !== newHook) {
        content = content.split(oldHook).join(newHook);
        console.log('[4] Hook button OK');
    }
} else console.log('[4] Hook button not found');

// ================================================================
// 5. Related card buttons
// ================================================================
const relOld = "editPart(\\'\\'' + curCategory + '\\'\\',\\'\\'' + rel.id + '\\'\\'\")\">✕</button>";
let relCount = 0;
while (content.includes(relOld)) {
    content = content.split(relOld).join("openEditPartModal(\\'\\'' + curCategory + '\\'\\',\\'\\'' + rel.id + '\\'\\'\")\">✕</button>");
    relCount++;
}
console.log('[5] Rel buttons:', relCount);

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
        console.log('[6] JS at DELETE PARTS');
    } else console.log('[6] No insert point');
}

// Write
const bomB = Buffer.from([0xEF, 0xBB, 0xBF]);
const newC = Buffer.concat([bomB, Buffer.from(content, 'utf8')]);
fs.writeFileSync(path, newC);
console.log('\nWritten:', newC.length, 'bytes');

// Verify
const v = fs.readFileSync(path, 'utf8');
console.log('\nopenEditPartModal:', (v.match(/openEditPartModal/g)||[]).length);
console.log('editStage onclick:', (v.match(/onclick[^>]*editStage/g)||[]).length);
console.log('edit-part-modal:', v.includes('id="edit-part-modal"'));
console.log('submitEditPart:', v.includes('function submitEditPart()'));
