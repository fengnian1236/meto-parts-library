const fs = require('fs');
const git = 'D:\\Qclaw\\v0.2.30.594\\resources\\git\\bin\\git.exe';
const { execSync } = require('child_process');
const path = 'C:\\Users\\daiji\\meto-parts-library\\index.html';

// Extract just the <script> block for syntax check
const content = fs.readFileSync(path, 'utf8');
const si = content.indexOf('<script>');
const ei = content.lastIndexOf('</script>');
const script = content.substring(si, ei + 9);
fs.writeFileSync('C:\\Users\\daiji\\meto-parts-library\\_check.js', script);
try {
    execSync('node --check C:\\Users\\daiji\\meto-parts-library\\_check.js', { stdio: 'pipe', timeout: 15000 });
    console.log('JS Syntax: OK');
} catch(e) {
    const msg = e.stderr ? e.stderr.toString() : e.message;
    console.log('JS Syntax: ERR\n', msg.substring(0, 500));
}

// Show the stage card button
const stageBtn = content.indexOf('openEditPartModal');
if (stageBtn >= 0) {
    const before = content.lastIndexOf('<button', stageBtn);
    const after = content.indexOf('</button>', stageBtn) + 9;
    const btnHTML = content.substring(before, after);
    console.log('\nStage card button:', btnHTML);
    console.log('Contains s.cls:', btnHTML.includes('s.cls'));
    console.log('Contains openEditPartModal:', btnHTML.includes('openEditPartModal'));
    console.log('Contains title edit:', btnHTML.includes('编辑此钩子'));
}

// Show the hook item button
const hookBtn = content.indexOf("'>✎ 编辑</button>");
if (hookBtn >= 0) {
    const before = content.lastIndexOf('<button', hookBtn);
    const after = hookBtn + 17;
    const btnHTML = content.substring(before, after);
    console.log('\nHook item button:', btnHTML);
    console.log('Contains openEditPartModal:', btnHTML.includes('openEditPartModal'));
}

// Show a related card button
const relBtn = content.indexOf("'>✕</button>");
if (relBtn >= 0) {
    const before = content.lastIndexOf('<button', relBtn);
    const after = relBtn + 11;
    const btnHTML = content.substring(before, after);
    console.log('\nRelated card button:', btnHTML);
    console.log('Contains openEditPartModal:', btnHTML.includes('openEditPartModal'));
}

// Modal check
console.log('\nModal:', content.includes('id="edit-part-modal"'));
console.log('Modal has show class logic:', content.includes('classList.add(\'show\')'));
console.log('Modal has remove class logic:', content.includes('classList.remove(\'show\')'));
console.log('submitEditPart fn:', content.includes('function submitEditPart()'));
console.log('closeEditPartModal fn:', content.includes('function closeEditPartModal()'));
console.log('_editPartCtx:', content.includes('_editPartCtx'));
