const fs = require('fs');
const { execSync } = require('child_process');
const path = 'C:\\Users\\daiji\\meto-parts-library\\index.html';
const git = 'D:\\Qclaw\\v0.2.30.594\\resources\\git\\bin\\git.exe';

// Restore from git
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
// 1. CSS - make stage card edit button always visible
// ================================================================
const oldCSS = '.stage-card-edit { position: absolute; top: 4px; right: 4px; display: none; gap: 2px; }\r\n  .edit-on .stage-card-edit { display: flex; }';
const newCSS = '.stage-card-edit { position: absolute; top: 4px; right: 4px; display: flex; gap: 2px; }';
let r = replaceAll(content, oldCSS, newCSS);
if (r.count > 0) { content = r.content; console.log('[1] CSS OK (' + r.count + ')'); }
else {
    const lf = oldCSS.replace(/\r\n/g, '\n');
    r = replaceAll(content, lf, newCSS.replace(/\r\n/g, '\n'));
    if (r.count > 0) { content = r.content; console.log('[1] CSS OK LF'); }
    else console.log('[1] CSS skip');
}

// ================================================================
// 2. Insert edit-part modal HTML
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
// 3. Stage card button: editStage -> openEditPartModal
// ================================================================
// The file uses \'\' (backslash-quote-quote) as escaped quotes
// Pattern: editStage(\'' + curCategory + '\',\'' + (curHookId||'') + '\',\'' + s.cls + '\')
// New: openEditPartModal(\'' + curCategory + '\',\'' + (curHookId||'') + '\')

// Use split to handle the \'\' pattern correctly
const oldStagePart = "editStage" + "(\\'\\'' + curCategory + '\\'\\',\\'\\'' + (curHookId||'\\'') + '\\'\\',\\'\\'' + s.cls + '\\'\\''";
const newStagePart = "openEditPartModal" + "(\\'\\'' + curCategory + '\\'\\',\\'\\'' + (curHookId||'\\'') + '\\'\\''";
const oldStageBtn = "onclick=\"event.stopPropagation();" + oldStagePart + ")\" title=\"编辑此项\">✎</button>";
const newStageBtn = "onclick=\"event.stopPropagation();" + newStagePart + ")\" title=\"编辑此钩子\">✎</button>";

if (content.includes(oldStageBtn)) {
    r = replaceAll(content, oldStageBtn, newStageBtn);
    content = r.content;
    console.log('[3] Stage button (' + r.count + ')');
} else {
    console.log('[3] Stage btn not found, trying alternate pattern...');
    // Try: just the function call part
    const si = content.indexOf("event.stopPropagation();editStage");
    if (si >= 0) {
        const end = content.indexOf('">✎</button>', si);
        const actualBtn = content.substring(si, end + 11);
        console.log('[3] Actual btn from file:', JSON.stringify(actualBtn.substring(0, 80)));
        // Try replacing the function call
        const funcOld = "editStage" + "(\\'\\'' + curCategory + '\\'\\',\\'\\'' + (curHookId||'\\'') + '\\'\\',\\'\\'' + s.cls + '\\'\\''";
        const funcNew = "openEditPartModal" + "(\\'\\'' + curCategory + '\\'\\',\\'\\'' + (curHookId||'\\'') + '\\'\\''";
        if (actualBtn.includes(funcOld)) {
            const newBtn = actualBtn.split(funcOld).join(funcNew).split('title="编辑此项"').join('title="编辑此钩子"');
            r = replaceAll(content, actualBtn, newBtn);
            content = r.content;
            console.log('[3] Stage button fixed (' + r.count + ')');
        } else {
            // Try with simpler pattern
            const simpleOld = "editStage(\\'\\'' + curCategory + '\\'\\',\\'\\'' + (curHookId||'\\'') + '\\'\\',\\'\\'' + s.cls + '\\'\\''";
            const simpleNew = "openEditPartModal(\\'\\'' + curCategory + '\\'\\',\\'\\'' + (curHookId||'\\'') + '\\'\\''";
            if (actualBtn.includes(simpleOld)) {
                const newBtn = actualBtn.split(simpleOld).join(simpleNew).split('title="编辑此项"').join('title="编辑此钩子"');
                r = replaceAll(content, actualBtn, newBtn);
                content = r.content;
                console.log('[3] Stage button fixed (simple) (' + r.count + ')');
            } else {
                console.log('[3] STILL not found. Checking actual bytes...');
                // Show exact bytes
                const idx = actualBtn.indexOf('curCategory');
                const chunk = actualBtn.substring(idx - 30, idx + 30);
                const buf = Buffer.from(chunk);
                console.log('  Bytes:', Array.from(buf.slice(0, 60)).map(b => b.toString(16)).join(' '));
                console.log('  Text:', JSON.stringify(chunk));
            }
        }
    }
}

// ================================================================
// 4. Hook item edit button: editPart -> openEditPartModal
// ================================================================
const oldHookPart = "editPart" + "(\\'\\'' + curCategory + '\\'\\',\\'\\'' + hookItem.id + '\\'\\''";
const newHookPart = "openEditPartModal" + "(\\'\\'' + curCategory + '\\'\\',\\'\\'' + hookItem.id + '\\'\\''";
const oldHookBtn = 'onclick="' + oldHookPart + ')">✎ 编辑</button>';
const newHookBtn = 'onclick="' + newHookPart + ')">✎ 编辑</button>';

if (content.includes(oldHookBtn)) {
    r = replaceAll(content, oldHookBtn, newHookBtn);
    content = r.content;
    console.log('[4] Hook button (' + r.count + ')');
} else {
    console.log('[4] Hook btn not found');
}

// ================================================================
// 5. Related card edit buttons
// ================================================================
const oldRelPart = "editPart" + "(\\'\\'' + curCategory + '\\'\\',\\'\\'' + rel.id + '\\'\\''";
const newRelPart = "openEditPartModal" + "(\\'\\'' + curCategory + '\\'\\',\\'\\'' + rel.id + '\\'\\''";
const oldRelBtn = oldRelPart + ')">✕</button>';
const newRelBtn = newRelPart + ')">✕</button>';

let relCount = 0;
while (content.includes(oldRelBtn)) {
    r = replaceAll(content, oldRelBtn, newRelBtn);
    content = r.content;
    relCount += r.count;
}
console.log('[5] Related buttons (' + relCount + ')');

// ================================================================
// 6. Add JS functions before EDIT / DELETE PARTS
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
        console.log('[6] JS at alt marker');
    } else {
        console.log('[6] No marker, searching...');
        const idx = content.indexOf('function editPart(cat, id)');
        if (idx >= 0) {
            const before = content.lastIndexOf('/* =====', idx);
            const near = content.substring(before, before + 50);
            console.log('[6] Found editPart at', idx, 'near:', JSON.stringify(near));
        }
    }
}

// ================================================================
// Write with BOM
// ================================================================
const bom = Buffer.from([0xEF, 0xBB, 0xBF]);
const newC = Buffer.concat([bom, Buffer.from(content, 'utf8')]);
fs.writeFileSync(path, newC);
console.log('\nWritten:', newC.length, 'bytes');

// Verify
const v = fs.readFileSync(path, 'utf8');
const openCnt = (v.match(/openEditPartModal/g)||[]).length;
const stageOnclick = (v.match(/onclick[^>]*editStage/g)||[]).length;
const editPartFunc = (v.match(/function editPart\(/g)||[]).length;
console.log('\nVerify:');
console.log('  openEditPartModal calls:', openCnt);
console.log('  editStage in onclick:', stageOnclick, '(should be 0)');
console.log('  editPart function def:', editPartFunc, '(should be 1)');
console.log('  edit-part-modal id:', v.includes('id="edit-part-modal"'));
console.log('  submitEditPart:', v.includes('function submitEditPart()'));
console.log('  closeEditPartModal:', v.includes('function closeEditPartModal()'));
