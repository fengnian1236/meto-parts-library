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

// 3. Stage card button - use byte-exact extraction
const si = content.indexOf('event.stopPropagation();editStage');
if (si >= 0) {
    const btnEnd = content.indexOf('">✎</button>', si);
    if (btnEnd >= 0) {
        const oldStage = content.substring(si, btnEnd + 11);
        // Find s.cls position
        const clsIdx = oldStage.indexOf('s.cls');
        // Verify positions from find_btn.js: s at 92, , at 85, ' before s at 100
        // Strategy: 
        //   beforeCls = up to the comma (position 85), but we need to also remove the ' before s.cls
        //   Actually: the ' at position 100 is the opening ' of s.cls param
        //   The ', at position 85 is: space(84), comma(85), space(86), '(87) before s(92)
        //   s.cls param is: '\' at 87, ' at 100...'\'' at 103
        //   Wait: from find_btn.js: comma at 85, closeQ at 100 (the ' of s.cls)
        //   The ' at closeQ=100 is the opening ' of s.cls
        //   The ' that closes curHookId is just before position 87
        //   So: remove comma(85) through closeQ(100), i.e. substring(0, 85) + substring(101)
        //   This gives: beforeCls ends with curHookId|'| and afterCls starts with |'|
        //   Result: curHookId|''|' = curHookId|' + ' = syntax error!
        //   
        //   CORRECT: closeQ+1 = 101 = the ' that CLOSES curHookId param
        //   We need to KEEP that '!
        //   The ' at 100 = opening ' of s.cls param
        //   closeQ = 100 (the ' that opens s.cls)
        //   closeQ+1 = 101 (the ' that closes curHookId)
        //   
        //   Actually: s.cls param is: '(87) + \' at 100...\' at 103 + '(103)
        //   wait: '\' in JS file = \ + ' in the actual content
        //   From file: ' at 87, then + space s space c space l space s + space + space ' at 100, \ at 102, ' at 103
        //   hmm let me just verify by extracting and printing
        const afterScls = clsIdx + 5; // position of ' right after s.cls
        // Find the ' that closes the s.cls param
        // After s.cls: space(97), +(98), space(99), '(100)
        // Then the s.cls param closing: \(101), '(102)  
        // Actually from the find_btn.js: closeQ at 100 which is the ' at " + s.cls + "
        // That ' is the opening ' of s.cls param
        // s.cls param: '\' + s.cls + '\'
        // The '\' at the start of s.cls param is at closeQ=100
        // The '\' at the end is at closeQ+2 (since s.cls param looks like '\' at start, s.cls, '\' at end)
        // Actually from find_btn.js: closeQ=100 is the ' at " + s.cls + "
        // That means: after s.cls: space, +, space, ', \, '
        // Wait: '\' in the file = backslash + ' in the actual bytes
        // So: s.cls + ' + \ + ' = s.cls + '\'
        // After s.cls: space + + space + ' + \ + ' = the file bytes from 97 to 103
        // s.cls param opening ': at position 100
        // s.cls param closing ': at position 103
        // Wait but find_btn.js says closeQ=100 for "afterScls = 92+5 = 97" search
        // Let me verify by searching for the second '
        let q1 = afterScls; // first ' after s.cls (this is the ' of "+ s.cls +")
        let q2 = q1 + 1;
        while (q2 < oldStage.length && oldStage[q2] !== "'") q2++;
        // q2 is the ' that closes the s.cls param
        // Now beforeCls should be up to the comma at 85
        // But we need to also remove the opening ' of s.cls (at q1=100)
        // Remove from comma(85) to q1(100) inclusive: before = 0..84, after = 101..
        // This gives: curHookId|'| (at 84) + afterCls at 101 which starts with '|
        // Result: |'|' = '', concatenation = empty string! That's wrong!
        //
        // I think the issue is that I need to check what's at position 85
        // From find_btn.js: char at 85 = "," (comma)
        // And 100 = "'" (the ' of s.cls opening)
        // So the comma and everything up to and including the ' of s.cls needs to be removed
        // beforeCls = 0..84 (ends at space before comma)
        // afterClsPart = 101.. (starts at the ' that closes curHookId)
        // Result: ...curHookId|'| + |' + s.cls... = curHookId|'|' + s.cls...
        // Still wrong because we keep the opening ' of s.cls!
        //
        // Actually: s.cls param is '\' + s.cls + '\'
        // The file has: ' at 87 (opening '), ... s.cls ... ' at 100 (this is the ' before \)
        // No wait. Let me look at find_btn.js output: closeQ = 100 char = "'" byte = 27
        // And btn[100] is in the section " + s.cls + "
        // s.cls param: '\' at 87, then content, then \' at 100 (closing)
        // So closeQ=100 is the CLOSING ' of s.cls param!
        // Let me verify: closeQ is found by searching for ' after afterScls=97
        // At 97: space (not ')
        // At 98: + (not ')
        // At 99: space (not ')
        // At 100: ' (found!) 
        // This ' at 100 is the ' in " + s.cls + "
        // But the s.cls param looks like '\' + s.cls + '\'
        // The ' at 100 is the ' AFTER the + 
        // Before the ' at 100: space, +, space = " + "
        // After the ' at 100: \ + ' = \' (the closing \' of s.cls param)
        // So closeQ=100 IS the closing ' of s.cls param!
        // The opening ' of s.cls param is at: need to find the ' before s.cls
        // Let me find it
        let openQ = afterScls - 1;
        while (openQ >= 0 && oldStage[openQ] !== "'") openQ--;
        // openQ is the ' before s.cls (the opening ' of s.cls param)
        // Verify: openQ should be at position 87
        console.log('DEBUG: openQ=', openQ, 'closeQ=', q2, 'charAtOpenQ=', JSON.stringify(oldStage[openQ]), 'charAtCloseQ=', JSON.stringify(oldStage[q2]));
        
        // Remove from comma(85) to closeQ(100) inclusive
        // beforeCls = 0..84 (up to space before comma)
        // afterClsPart = 101.. (starts at what comes after closeQ=100)
        const beforeCls = oldStage.substring(0, 85); // up to comma at 85
        const afterClsPart = oldStage.substring(q2 + 1);
        const newStageRaw = beforeCls + afterClsPart;
        const newStage = newStageRaw
            .replace('editStage(', 'openEditPartModal(')
            .replace('title="编辑此项"', 'title="编辑此钩子"');
        
        console.log('DEBUG: beforeCls:', JSON.stringify(beforeCls.substring(beforeCls.length - 30)));
        console.log('DEBUG: afterClsPart:', JSON.stringify(afterClsPart.substring(0, 30)));
        console.log('DEBUG: newStage:', JSON.stringify(newStage.substring(0, 80)));
        
        r = ra(content, oldStage, newStage);
        content = r.content;
        console.log('[3] Stage button (' + r.count + ')');
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
console.log('\nVerify:');
console.log('  openEditPartModal:', openCnt);
console.log('  editStage onclick:', stageOnclick, '(should be 0)');
console.log('  editPart fn def:', editPartDef, '(should be 1)');
console.log('  Stage btn s.cls:', stageHasCls, '(should be false)');
console.log('  edit-part-modal id:', v.includes('id="edit-part-modal"'));
console.log('  submitEditPart:', v.includes('function submitEditPart()'));
