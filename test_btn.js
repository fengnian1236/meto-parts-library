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
    // Extract just the error line
    const lines = msg.split('\n');
    console.log('JS Syntax: ERR');
    for (const l of lines) {
        if (l.includes('Error') || l.includes('_check.js')) console.log(l.substring(0, 200));
    }
}

// Find stage card button - search for the stage-specific button (the one with event.stopPropagation)
const stageBtnIdx = content.indexOf('event.stopPropagation();openEditPartModal');
if (stageBtnIdx >= 0) {
    const btnStart = content.lastIndexOf('<button', stageBtnIdx);
    const btnEnd = content.indexOf('</button>', stageBtnIdx) + 9;
    const btnHTML = content.substring(btnStart, btnEnd);
    console.log('\n=== STAGE CARD BUTTON ===');
    console.log(btnHTML);
    console.log('Has s.cls param:', btnHTML.includes("s.cls"));
    console.log('Param count:', (btnHTML.match(/\\'/g)||[]).length);
}

// Show hook item button
const hookBtn = content.indexOf("'>✎ 编辑</button>");
if (hookBtn >= 0) {
    const before = content.lastIndexOf('<button', hookBtn);
    const after = hookBtn + 17;
    const btnHTML = content.substring(before, after);
    console.log('\n=== HOOK ITEM BUTTON ===');
    console.log(btnHTML);
}

// Modal
console.log('\nModal:', content.includes('id="edit-part-modal"'));
console.log('submitEditPart:', content.includes('function submitEditPart()'));
