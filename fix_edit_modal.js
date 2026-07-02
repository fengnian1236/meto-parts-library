const fs = require('fs');
const path = 'C:\\Users\\daiji\\meto-parts-library\\index.html';
let content = fs.readFileSync(path, 'utf8');
const originalLen = content.length;
console.log('Loaded:', originalLen, 'chars');

// ================================================================
// Helper: Replace ALL occurrences of a string
// ================================================================
function replaceAll(content, find, replace) {
    let count = 0;
    let result = content;
    while (result.includes(find)) {
        result = result.replace(find, replace);
        count++;
    }
    console.log(`  Replaced ${count}x: "${find.substring(0,50)}..."`);
    return result;
}

// ================================================================
// STEP 1: CSS - make stage card edit button always visible
// ================================================================
const oldCSS = '.stage-card-edit { position: absolute; top: 4px; right: 4px; display: none; gap: 2px; }\r\n  .edit-on .stage-card-edit { display: flex; }';
const newCSS = '.stage-card-edit { position: absolute; top: 4px; right: 4px; display: flex; gap: 2px; }';
if (content.includes(oldCSS)) {
    content = content.replace(oldCSS, newCSS);
    console.log('[1] CSS OK');
} else {
    // Try LF version
    const oldCSSLF = oldCSS.replace(/\r\n/g, '\n');
    if (content.includes(oldCSSLF)) {
        content = content.replace(oldCSSLF, newCSS.replace(/\r\n/g, '\n'));
        console.log('[1] CSS OK (LF)');
    } else {
        console.log('[1] CSS: pattern not found, skipping');
    }
}

// ================================================================
// STEP 2: Add edit-part modal HTML
// ================================================================
const editModalHTML = `<!-- ===== Modal: 编辑钩子方案 ===== -->
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

<!-- ===== Modal: 新增/编辑一级分类 ===== -->`;

if (content.includes('<!-- ===== Modal: 新增/编辑一级分类 ===== -->')) {
    content = content.replace('<!-- ===== Modal: 新增/编辑一级分类 ===== -->', editModalHTML);
    console.log('[2] Edit modal HTML inserted');
} else {
    console.log('[2] WARNING: cat modal marker not found');
}

// ================================================================
// STEP 3: Extract exact strings from file and do replacements
// ================================================================

// Find stage card button
let stageOld = null, stageNew = null;
const sIdx = content.indexOf('editStage');
if (sIdx >= 0) {
    // Extract from onclick= to </button>
    const onAttr = content.indexOf('onclick="event.stopPropagation();editStage', sIdx);
    if (onAttr >= 0) {
        const end = content.indexOf('">✎</button>', onAttr);
        if (end >= 0) {
            stageOld = content.substring(onAttr, end + 11);
            // Build new version
            stageNew = stageOld
                .replace('editStage(\'\\'' + curCategory + \'\\',\'\\'' + (curHookId||\'\') + \'\\',\'\\'' + s.cls', 
                         'openEditPartModal(\'\\'' + curCategory + \'\\',\'\\'' + (curHookId||\'\') + \'\\'')
                .replace('title="编辑此项"', 'title="编辑此钩子"');
            console.log('[3] Stage button - old:', JSON.stringify(stageOld));
            console.log('[3] Stage button - new:', JSON.stringify(stageNew));
            content = replaceAll(content, stageOld, stageNew);
        }
    }
}
if (!stageOld) console.log('[3] Stage button: NOT FOUND');

// Find hook item edit button
let hookOld = null, hookNew = null;
const hIdx = content.indexOf('editPart(\'\\'' + curCategory + \'\\',\'\\'' + hookItem.id');
if (hIdx >= 0) {
    const end = content.indexOf('">✎ 编辑</button>', hIdx);
    if (end >= 0) {
        hookOld = content.substring(hIdx, end + 17);
        hookNew = hookOld.replace('editPart(\'\\'' + curCategory + \'\\',\'\\'' + hookItem.id', 
                                   'openEditPartModal(\'\\'' + curCategory + \'\\',\'\\'' + hookItem.id');
        console.log('[4] Hook btn - old:', JSON.stringify(hookOld));
        console.log('[4] Hook btn - new:', JSON.stringify(hookNew));
        content = replaceAll(content, hookOld, hookNew);
    }
}
if (!hookOld) console.log('[4] Hook item button: NOT FOUND');

// Find related card edit buttons
let relOld = null, relNew = null;
const rIdx = content.indexOf('editPart(\'\\'' + curCategory + \'\\',\'\\'' + rel.id');
if (rIdx >= 0) {
    const end = content.indexOf('">✕</button>', rIdx);
    if (end >= 0) {
        relOld = content.substring(rIdx, end + 11);
        relNew = relOld.replace('editPart(\'\\'' + curCategory + \'\\',\'\\'' + rel.id',
                                'openEditPartModal(\'\\'' + curCategory + \'\\',\'\\'' + rel.id');
        console.log('[5] Rel btn - old:', JSON.stringify(relOld));
        console.log('[5] Rel btn - new:', JSON.stringify(relNew));
        content = replaceAll(content, relOld, relNew);
    }
}
if (!relOld) console.log('[5] Related card buttons: NOT FOUND');

// ================================================================
// STEP 4: Add JS functions
// ================================================================
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
  for (var r = 0; r < rgs.length; r++) {
    rgs[r].checked = (rgs[r].value === (item.region || '欧美'));
  }
  document.getElementById('ep-before3s').value = item.stages.before3s || '';
  document.getElementById('ep-middle').value = item.stages.middle || '';
  document.getElementById('ep-cta').value = item.stages.cta || '';
  var pots = document.getElementsByName('ep-pot');
  for (var pr = 0; pr < pots.length; pr++) {
    pots[pr].checked = (pots[pr].value === (item.pot || '中'));
  }
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

// Insert before EDIT / DELETE PARTS comment
const marker = '/* ===== EDIT / DELETE PARTS ===== */';
if (content.includes(marker)) {
    content = content.replace(marker, editModalJS + marker);
    console.log('[6] JS functions inserted');
} else {
    // Try alternate markers
    const alt1 = '/* ===== DELETE PARTS ===== */';
    const alt2 = '/* ===== DELETE PART ===== */';
    if (content.includes(alt1)) {
        content = content.replace(alt1, editModalJS + alt1);
        console.log('[6] JS functions inserted (alt1)');
    } else if (content.includes(alt2)) {
        content = content.replace(alt2, editModalJS + alt2);
        console.log('[6] JS functions inserted (alt2)');
    } else {
        // Try to find any marker near editPart function
        const epIdx = content.indexOf('function editPart(cat, id)');
        if (epIdx >= 0) {
            const beforeIdx = content.lastIndexOf('/* =====', epIdx);
            const marker2 = content.substring(beforeIdx, epIdx);
            console.log('[6] Found editPart at', epIdx, 'near marker:', JSON.stringify(marker2));
        } else {
            console.log('[6] WARNING: No insert point found');
        }
    }
}

// ================================================================
// Write with BOM
// ================================================================
const bom = Buffer.from([0xEF, 0xBB, 0xBF]);
const newContent = Buffer.concat([bom, Buffer.from(content, 'utf8')]);
fs.writeFileSync(path, newContent);
console.log('\nWritten:', newContent.length, 'bytes');

// ================================================================
// Verify
// ================================================================
const verify = fs.readFileSync(path, 'utf8');
console.log('\n--- Verification ---');
const openCnt = (verify.match(/openEditPartModal/g)||[]).length;
const editStageCnt = (verify.match(/editStage/g)||[]).length;
console.log('openEditPartModal calls:', openCnt);
console.log('editStage calls remaining:', editStageCnt);
console.log('edit-part-modal id:', verify.includes('id="edit-part-modal"'));
console.log('submitEditPart:', verify.includes('function submitEditPart()'));
console.log('closeEditPartModal:', verify.includes('function closeEditPartModal()'));
