const fs = require('fs');
const { execSync } = require('child_process');
const git = 'D:\\Qclaw\\v0.2.30.594\\resources\\git\\bin\\git.exe';
const path = 'C:\\Users\\daiji\\meto-parts-library\\index.html';

// Restore from git first
execSync(git + ' checkout -- index.html', { cwd: 'C:\\Users\\daiji\\meto-parts-library', stdio: 'pipe' });
let content = fs.readFileSync(path, 'utf8');

function ra(c, old, neu) {
    let cnt = 0;
    while (c.includes(old)) { c = c.replace(old, neu); cnt++; }
    return { content: c, count: cnt };
}

// 1. Fix CSS - make stage-card-edit always visible
const oldCSS = '.stage-card-edit { position: absolute; top: 4px; right: 4px; display: none; gap: 2px; }\r\n  .edit-on .stage-card-edit { display: flex; }';
const newCSS = '.stage-card-edit { position: absolute; top: 4px; right: 4px; display: flex; gap: 2px; }';
let r = ra(content, oldCSS, newCSS);
if (r.count > 0) { content = r.content; console.log('[1] CSS OK (' + r.count + ')'); }
else {
    // Try with LF
    r = ra(content, oldCSS.replace(/\r\n/g, '\n'), newCSS.replace(/\r\n/g, '\n'));
    if (r.count > 0) { content = r.content; console.log('[1] CSS OK LF'); }
    else console.log('[1] CSS skip - checking...');
}

// 2. Add edit modal HTML before the first existing modal
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

`;

const firstModal = '<!-- ===== Modal: 新增/编辑一级分类 ===== -->';
if (content.includes(firstModal)) {
    content = content.split(firstModal).join(editModalHTML + firstModal);
    console.log('[2] Edit modal inserted');
} else {
    console.log('[2] Modal insert point not found');
}

// 3. Replace editStage function with modal version
const oldEditStage = `/* ===== EDIT STAGE (前3秒/中部/CTA) ===== */
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
}`;

const newEditStage = `/* ===== EDIT STAGE (前3秒/中部/CTA) - 使用弹框 ===== */
let _editStageCtx = { cat: null, id: null, stageKey: null };

function editStage(cat, id, stageKey) {
  const catData = DATA[cat];
  if (!catData) return;
  const item = catData.items.find(function(x) { return x.id === id; });
  if (!item) return;
  
  _editStageCtx = { cat: cat, id: id, stageKey: stageKey };
  const labelMap = { before3s: '前3秒', middle: '中部', cta: 'CTA' };
  const label = labelMap[stageKey] || stageKey;
  
  // Populate modal
  document.getElementById('ep-name').value = item.name || '';
  const rgs = document.getElementsByName('ep-region');
  for (let i = 0; i < rgs.length; i++) {
    rgs[i].checked = (rgs[i].value === (item.region || '欧美'));
  }
  document.getElementById('ep-before3s').value = item.stages.before3s || '';
  document.getElementById('ep-middle').value = item.stages.middle || '';
  document.getElementById('ep-cta').value = item.stages.cta || '';
  const pots = document.getElementsByName('ep-pot');
  for (let i = 0; i < pots.length; i++) {
    pots[i].checked = (pots[i].value === (item.pot || '中'));
  }
  
  // Update title
  document.querySelector('#edit-part-modal .modal-title').textContent = '编辑 ' + label;
  
  document.getElementById('edit-part-modal').classList.add('show');
  setTimeout(function() { document.getElementById('ep-name').focus(); }, 50);
}

function closeEditPartModal() {
  document.getElementById('edit-part-modal').classList.remove('show');
  _editStageCtx = { cat: null, id: null, stageKey: null };
}

function submitEditPart() {
  const ctx = _editStageCtx;
  if (!ctx.cat || !ctx.id) return;
  
  const catData = DATA[ctx.cat];
  if (!catData) return;
  const item = catData.items.find(function(x) { return x.id === ctx.id; });
  if (!item) return;
  
  const name = document.getElementById('ep-name').value.trim();
  if (!name) { alert('请输入名称'); return; }
  
  const rgs = document.getElementsByName('ep-region');
  let region = '欧美';
  for (let i = 0; i < rgs.length; i++) {
    if (rgs[i].checked) { region = rgs[i].value; break; }
  }
  
  const pots = document.getElementsByName('ep-pot');
  let pot = '中';
  for (let i = 0; i < pots.length; i++) {
    if (pots[i].checked) { pot = pots[i].value; break; }
  }
  
  pushUndo();
  item.name = name;
  item.region = region;
  item.pot = pot;
  item.stages.before3s = (document.getElementById('ep-before3s').value || '').trim();
  item.stages.middle = (document.getElementById('ep-middle').value || '').trim();
  item.stages.cta = (document.getElementById('ep-cta').value || '').trim();
  
  saveData();
  closeEditPartModal();
  renderCenter();
}`;

r = ra(content, oldEditStage, newEditStage);
if (r.count > 0) { content = r.content; console.log('[3] editStage replaced (' + r.count + ')'); }
else {
    // Try with different line endings
    r = ra(content, oldEditStage.replace(/\r\n/g, '\n'), newEditStage.replace(/\r\n/g, '\n'));
    if (r.count > 0) { content = r.content; console.log('[3] editStage replaced LF'); }
    else console.log('[3] editStage not found');
}

// 4. Replace editPart function with modal version
const oldEditPart = `/* ===== EDIT / DELETE PARTS ===== */
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
}`;

const newEditPart = `/* ===== EDIT / DELETE PARTS ===== */
let _editPartCtx = { cat: null, id: null };

function editPart(cat, id) {
  const catData = DATA[cat];
  if (!catData) return;
  const item = catData.items.find(function(x) { return x.id === id; });
  if (!item) return;
  
  _editPartCtx = { cat: cat, id: id };
  
  // Populate modal
  document.getElementById('ep-name').value = item.name || '';
  const rgs = document.getElementsByName('ep-region');
  for (let i = 0; i < rgs.length; i++) {
    rgs[i].checked = (rgs[i].value === (item.region || '欧美'));
  }
  document.getElementById('ep-before3s').value = item.stages.before3s || '';
  document.getElementById('ep-middle').value = item.stages.middle || '';
  document.getElementById('ep-cta').value = item.stages.cta || '';
  const pots = document.getElementsByName('ep-pot');
  for (let i = 0; i < pots.length; i++) {
    pots[i].checked = (pots[i].value === (item.pot || '中'));
  }
  
  // Update title
  document.querySelector('#edit-part-modal .modal-title').textContent = '编辑钩子方案';
  
  document.getElementById('edit-part-modal').classList.add('show');
  setTimeout(function() { document.getElementById('ep-name').focus(); }, 50);
}

function submitEditPartFromCard() {
  const ctx = _editPartCtx;
  if (!ctx.cat || !ctx.id) return;
  
  const catData = DATA[ctx.cat];
  if (!catData) return;
  const item = catData.items.find(function(x) { return x.id === ctx.id; });
  if (!item) return;
  
  const name = document.getElementById('ep-name').value.trim();
  if (!name) { alert('请输入名称'); return; }
  
  const rgs = document.getElementsByName('ep-region');
  let region = '欧美';
  for (let i = 0; i < rgs.length; i++) {
    if (rgs[i].checked) { region = rgs[i].value; break; }
  }
  
  const pots = document.getElementsByName('ep-pot');
  let pot = '中';
  for (let i = 0; i < pots.length; i++) {
    if (pots[i].checked) { pot = pots[i].value; break; }
  }
  
  pushUndo();
  item.name = name;
  item.region = region;
  item.pot = pot;
  item.stages.before3s = (document.getElementById('ep-before3s').value || '').trim();
  item.stages.middle = (document.getElementById('ep-middle').value || '').trim();
  item.stages.cta = (document.getElementById('ep-cta').value || '').trim();
  
  saveData();
  closeEditPartModal();
  renderCenter();
}`;

r = ra(content, oldEditPart, newEditPart);
if (r.count > 0) { content = r.content; console.log('[4] editPart replaced (' + r.count + ')'); }
else {
    r = ra(content, oldEditPart.replace(/\r\n/g, '\n'), newEditPart.replace(/\r\n/g, '\n'));
    if (r.count > 0) { content = r.content; console.log('[4] editPart replaced LF'); }
    else console.log('[4] editPart not found');
}

// 5. Update ESC key handler to close edit modal
try {
    const oldEsc = `document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeAddModal(); closeCatModal(); closeHistoryModal(); }
});`;
    const newEsc = `document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeAddModal(); closeCatModal(); closeHistoryModal(); closeEditPartModal(); }
});`;
    r = ra(content, oldEsc, newEsc);
    if (r.count > 0) { content = r.content; console.log('[5] ESC handler updated'); }
    else console.log('[5] ESC handler not found');
} catch(e) { console.log('[5] ESC error:', e.message); }

// Write with BOM
const bom = Buffer.from([0xEF, 0xBB, 0xBF]);
const newC = Buffer.concat([bom, Buffer.from(content, 'utf8')]);
fs.writeFileSync(path, newC);
console.log('\nWritten:', newC.length, 'bytes');

// Verify
const v = fs.readFileSync(path, 'utf8');
console.log('\nVerify:');
console.log('  edit-part-modal id:', v.includes('id="edit-part-modal"'));
console.log('  submitEditPart fn:', v.includes('function submitEditPart()'));
console.log('  closeEditPartModal fn:', v.includes('function closeEditPartModal()'));
console.log('  _editStageCtx:', v.includes('_editStageCtx'));
console.log('  _editPartCtx:', v.includes('_editPartCtx'));
console.log('  stage-card-edit display:flex:', v.includes('.stage-card-edit { position: absolute; top: 4px; right: 4px; display: flex;'));
