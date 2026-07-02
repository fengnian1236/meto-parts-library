const fs = require('fs');
const path = 'C:\\Users\\daiji\\meto-parts-library\\index.html';
let content = fs.readFileSync(path, 'utf8');

// Step 1: Restore from git first
const git = 'D:\\Qclaw\\v0.2.30.594\\resources\\git\\bin\\git.exe';
const { execSync } = require('child_process');
try {
    execSync(`${git} checkout -- index.html`, { cwd: 'C:\\Users\\daiji\\meto-parts-library', stdio: 'pipe' });
    content = fs.readFileSync(path, 'utf8');
    console.log('Restored, length:', content.length);
} catch(e) {
    console.log('Checkout failed:', e.message);
}

// ---- CHANGE 1: CSS ----
const oldCSS = '.stage-card-edit { position: absolute; top: 4px; right: 4px; display: none; gap: 2px; }\r\n  .edit-on .stage-card-edit { display: flex; }';
const newCSS = '.stage-card-edit { position: absolute; top: 4px; right: 4px; display: flex; gap: 2px; }';
if (content.includes(oldCSS)) {
    content = content.replace(oldCSS, newCSS);
    console.log('[1] CSS OK');
} else {
    const oldCSSLF = oldCSS.replace(/\r\n/g, '\n');
    if (content.includes(oldCSSLF)) {
        content = content.replace(oldCSSLF, newCSS.replace(/\r\n/g, '\n'));
        console.log('[1] CSS OK (LF)');
    } else {
        console.log('[1] CSS: not found');
    }
}

// ---- CHANGE 2: Add edit modal HTML ----
const editModalHTML = '<!-- ===== Modal: 编辑钩子方案 ===== -->\n<div id="edit-part-modal" class="modal-overlay" onclick="if(event.target===this)closeEditPartModal()">\n  <div class="modal-card" onclick="event.stopPropagation()">\n    <div class="modal-header">\n      <div class="modal-title">编辑钩子方案</div>\n      <button class="modal-close" onclick="closeEditPartModal()" title="关闭">×</button>\n    </div>\n    <div class="modal-body">\n      <div class="form-row">\n        <label>名称 <span class="required">*</span></label>\n        <input id="ep-name" type="text" placeholder="例：美女推荐 / 视频聊天"/>\n      </div>\n      <div class="form-row">\n        <label>地区</label>\n        <div class="radio-group">\n          <label><input type="radio" name="ep-region" value="欧美"> 欧美</label>\n          <label><input type="radio" name="ep-region" value="中东南亚"> 中东南亚</label>\n        </div>\n      </div>\n      <div class="form-row">\n        <label>前 3 秒</label>\n        <textarea id="ep-before3s" rows="2" placeholder="例：美女真人出镜 + 惊讶表情 + 'OMG' 字幕"></textarea>\n      </div>\n      <div class="form-row">\n        <label>中部</label>\n        <textarea id="ep-middle" rows="2" placeholder="例：产品演示 + 核心卖点 + 真人体验"></textarea>\n      </div>\n      <div class="form-row">\n        <label>CTA</label>\n        <textarea id="ep-cta" rows="2" placeholder="例：下载免费 / 立即体验 / 点击了解"></textarea>\n      </div>\n      <div class="form-row">\n        <label>潜力等级</label>\n        <div class="radio-group">\n          <label><input type="radio" name="ep-pot" value="高"> 高</label>\n          <label><input type="radio" name="ep-pot" value="中"> 中</label>\n          <label><input type="radio" name="ep-pot" value="低"> 低</label>\n        </div>\n      </div>\n    </div>\n    <div class="modal-footer">\n      <button class="btn" onclick="closeEditPartModal()">取消</button>\n      <button class="btn btn-primary" onclick="submitEditPart()">保存</button>\n    </div>\n  </div>\n</div>\n\n<!-- ===== Modal: 新增/编辑一级分类 ===== -->';
if (content.includes('<!-- ===== Modal: 新增/编辑一级分类 ===== -->')) {
    content = content.replace('<!-- ===== Modal: 新增/编辑一级分类 ===== -->', editModalHTML);
    console.log('[2] Modal HTML inserted');
} else {
    console.log('[2] Modal marker not found');
}

// ---- CHANGE 3: Extract and replace stage card button ----
const sIdx = content.indexOf('event.stopPropagation();editStage');
if (sIdx >= 0) {
    // Extract the full onclick attribute value
    const quoteStart = content.lastIndexOf('"', sIdx - 10);
    const btnEnd = content.indexOf('">✎</button>', sIdx);
    if (btnEnd >= 0) {
        const oldBtn = content.substring(quoteStart + 1, btnEnd + 11);
        const newBtn = oldBtn
            .replace('editStage(\'\\'' + curCategory + \'\\',\'\\'' + (curHookId||\'\') + \'\\',\'\\'' + s.cls + \'\\'', 
                     'openEditPartModal(\'\\'' + curCategory + \'\\',\'\\'' + (curHookId||\'\') + \'\\'')
            .replace('title="编辑此项"', 'title="编辑此钩子"');
        if (oldBtn !== newBtn) {
            content = content.replace(oldBtn, newBtn);
            console.log('[3] Stage button replaced');
        } else {
            console.log('[3] Stage button pattern unchanged, doing direct replacement');
            // Direct replacement of the function name and parameters
            const directOld = 'event.stopPropagation();editStage(\'\\'' + curCategory + \'\\',\'\\'' + (curHookId||\'\') + \'\\',\'\\'' + s.cls + \'\\')';
            const directNew = 'event.stopPropagation();openEditPartModal(\'\\'' + curCategory + \'\\',\'\\'' + (curHookId||\'\') + \'\\')';
            if (content.includes(directOld)) {
                content = content.replace(directOld, directNew);
                console.log('[3] Stage button replaced (direct)');
            } else {
                console.log('[3] Direct pattern not found. Extracted oldBtn:', JSON.stringify(oldBtn));
            }
        }
    }
} else {
    console.log('[3] editStage not found');
}

// ---- CHANGE 4: Hook item edit button ----
const hPattern = 'editPart(\'\\'' + curCategory + \'\\',\'\\'' + hookItem.id + \'\\')';
const hFound = content.indexOf(hPattern);
if (hFound >= 0) {
    const hEnd = content.indexOf('">✎ 编辑</button>', hFound);
    if (hEnd >= 0) {
        const oldHook = content.substring(hFound, hEnd + 17);
        const newHook = oldHook.replace('editPart(\'\\'' + curCategory + \'\\',\'\\'' + hookItem.id',
                                        'openEditPartModal(\'\\'' + curCategory + \'\\',\'\\'' + hookItem.id');
        if (oldHook !== newHook) {
            content = content.replace(oldHook, newHook);
            console.log('[4] Hook item button replaced');
        } else {
            console.log('[4] Hook item unchanged');
        }
    }
} else {
    console.log('[4] Hook item pattern not found');
}

// ---- CHANGE 5: Related card edit buttons ----
const rPattern = 'editPart(\'\\'' + curCategory + \'\\',\'\\'' + rel.id + \'\\')';
let rCount = 0;
let rContent = content;
while (rContent.indexOf(rPattern) >= 0) {
    const rf = rContent.indexOf(rPattern);
    const re = rContent.indexOf('">✕</button>', rf);
    if (re >= 0) {
        const oldRel = rContent.substring(rf, re + 11);
        const newRel = oldRel.replace('editPart(\'\\'' + curCategory + \'\\',\'\\'' + rel.id',
                                      'openEditPartModal(\'\\'' + curCategory + \'\\',\'\\'' + rel.id');
        rContent = rContent.replace(oldRel, newRel);
        rCount++;
    } else break;
}
if (rCount > 0) {
    content = rContent;
    console.log('[5] Related card buttons replaced:', rCount, 'occurrences');
} else {
    console.log('[5] Related card pattern not found');
}

// ---- CHANGE 6: Add JS functions ----
const editModalJS = `
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

const marker6 = '/* ===== EDIT / DELETE PARTS ===== */';
if (content.includes(marker6)) {
    content = content.replace(marker6, editModalJS + marker6);
    console.log('[6] JS inserted before EDIT/DELETE PARTS');
} else {
    const alt = '/* ===== DELETE PARTS ===== */';
    if (content.includes(alt)) {
        content = content.replace(alt, editModalJS + alt);
        console.log('[6] JS inserted before DELETE PARTS');
    } else {
        // Find editPart function and insert before it
        const epFn = content.indexOf('function editPart(cat, id)');
        if (epFn >= 0) {
            const before = content.lastIndexOf('/* =====', epFn);
            if (before >= 0) {
                const m = content.substring(before, before + 40);
                content = content.replace(m, editModalJS + m);
                console.log('[6] JS inserted before:', JSON.stringify(m));
            }
        } else {
            console.log('[6] No insert point found');
        }
    }
}

// Write with BOM
const bom2 = Buffer.from([0xEF, 0xBB, 0xBF]);
const newContent = Buffer.concat([bom2, Buffer.from(content, 'utf8')]);
fs.writeFileSync(path, newContent);
console.log('\nWritten:', newContent.length, 'bytes (was:', originalLen, ')');

// Verify
const v = fs.readFileSync(path, 'utf8');
const open = (v.match(/openEditPartModal/g)||[]).length;
const editS = (v.match(/editStage/g)||[]).length;
const editP = (v.match(/editPart/g)||[]).length;
console.log('\nVerify:');
console.log('  openEditPartModal:', open);
console.log('  editStage (should be 0):', editS);
console.log('  editPart function def (should be 1):', editP);
console.log('  modal id:', v.includes('id="edit-part-modal"'));
console.log('  submitEditPart:', v.includes('function submitEditPart()'));
